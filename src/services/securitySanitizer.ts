import { SiteConfig, SecurityAuditEntry } from '../types/config';

// Locked remote endpoints - strictly immutable, immune to parameter tampering
export const LOCKED_ENDPOINTS = {
  PRIMARY: 'https://legitpannel.onrender.com/api/config',
  ALTERNATIVE: 'https://legitpannel.onrender.com/api/site-config',
  FALLBACK: '/site-config.json',
} as const;

/**
 * Strips all HTML tags and leaves clean, unformatted plain text.
 * Prevents stored XSS from broadcast or maintenance message fields.
 */
export function sanitizePlainText(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Strip HTML tags
  const noHtml = input.replace(/<[^>]*>?/gm, '');
  // Clean null bytes and dangerous control characters
  return noHtml.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

/**
 * Validates TMDB API key: alphanumeric string between 16 and 64 characters.
 */
export function validateTmdbApiKey(key: unknown): { isValid: boolean; sanitized: string; reason?: string } {
  if (typeof key !== 'string') {
    return { isValid: false, sanitized: '', reason: 'Key must be a string' };
  }
  const trimmed = key.trim();
  const tmdbRegex = /^[a-zA-Z0-9]{16,64}$/;
  if (tmdbRegex.test(trimmed)) {
    return { isValid: true, sanitized: trimmed };
  }
  return {
    isValid: false,
    sanitized: '',
    reason: 'Invalid TMDB Key format. Must be alphanumeric (16-64 chars).',
  };
}

/**
 * Validates Ad IDs (headerBannerId, footerBannerId, etc.).
 * Strictly accepts alphanumeric hex codes. Rejects any HTML tags, quotes, or script injection.
 */
export function validateAdId(id: unknown): { isValid: boolean; sanitized: string; reason?: string } {
  if (typeof id !== 'string') {
    return { isValid: false, sanitized: '', reason: 'Ad ID must be a string' };
  }
  const trimmed = id.trim();
  // Validates standard 16-64 character hexadecimal / alphanumeric ad unit IDs
  const adIdRegex = /^[a-fA-F0-9]{16,64}$/;
  if (adIdRegex.test(trimmed)) {
    return { isValid: true, sanitized: trimmed };
  }
  return {
    isValid: false,
    sanitized: '',
    reason: 'Invalid Ad ID. Must be a clean alphanumeric hex identifier (16-64 chars).',
  };
}

/**
 * Validates Direct Link URL.
 * Only accepts valid https:// or http:// protocols.
 * Strictly blocks javascript:, data:, blob:, file:, and other unsafe URIs.
 */
export function validateDirectLink(url: unknown): { isValid: boolean; sanitized: string; reason?: string } {
  if (typeof url !== 'string') {
    return { isValid: false, sanitized: '', reason: 'URL must be a string' };
  }
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      // Disallow javascript: inside query or username/pass
      if (/javascript:/i.test(trimmed) || /data:/i.test(trimmed)) {
        return { isValid: false, sanitized: '', reason: 'Dangerous URI scheme detected' };
      }
      return { isValid: true, sanitized: trimmed };
    }
    return { isValid: false, sanitized: '', reason: 'URL must use https:// or http:// protocol' };
  } catch {
    return { isValid: false, sanitized: '', reason: 'Malformed URL format' };
  }
}

/**
 * Validates and sanitizes third-party ad script tags (e.g. socialBarScript, popunderScript).
 * Only authorizes clean <script src="https://..."></script> tags pointing to secure https:// scripts.
 * Strips out any inline executable code (eval, cookie access, localStorage, innerHTML).
 */
export function sanitizeScriptTag(script: unknown): {
  isValid: boolean;
  srcUrl: string | null;
  safeTag: string;
  reason?: string;
} {
  if (typeof script !== 'string' || !script.trim()) {
    return { isValid: true, srcUrl: null, safeTag: '' };
  }

  const raw = script.trim();

  // Check for dangerous inline Javascript execution vectors
  const dangerousPatterns = [
    /eval\s*\(/i,
    /document\s*\.\s*cookie/i,
    /localStorage/i,
    /sessionStorage/i,
    /window\s*\.\s*location/i,
    /<script[^>]*>[^<]+<\/script>/i, // Non-empty inline script body
    /onerror\s*=/i,
    /onload\s*=/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(raw)) {
      return {
        isValid: false,
        srcUrl: null,
        safeTag: '',
        reason: 'Inline executable JavaScript or cookie access blocked',
      };
    }
  }

  // Extract src from <script ... src="https://..." ...></script>
  const srcMatch = raw.match(/src=["'](https:\/\/[^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    const srcUrl = srcMatch[1];
    try {
      const parsed = new URL(srcUrl);
      if (parsed.protocol === 'https:') {
        // Return a clean, normalized safe script tag with cfasync=false
        return {
          isValid: true,
          srcUrl,
          safeTag: `<script data-cfasync="false" src="${encodeURI(srcUrl)}"></script>`,
        };
      }
    } catch {
      return { isValid: false, srcUrl: null, safeTag: '', reason: 'Invalid script src URL' };
    }
  }

  return {
    isValid: false,
    srcUrl: null,
    safeTag: '',
    reason: 'Script must be a <script> tag with a valid https:// src attribute',
  };
}

/**
 * Validates and hardens the full SiteConfig against tampering and injection.
 * Produces an audit log of all checks.
 */
export function sanitizeAndAuditConfig(
  raw: any,
  fallback: SiteConfig
): { sanitized: SiteConfig; audit: SecurityAuditEntry[] } {
  const audit: SecurityAuditEntry[] = [];

  if (!raw || typeof raw !== 'object') {
    audit.push({
      field: 'payload',
      status: 'blocked',
      detail: 'Config payload was not an object. Reverting to fallback configuration.',
    });
    return { sanitized: fallback, audit };
  }

  // 1. siteName
  const rawSiteName = raw.siteName || fallback.siteName;
  const siteName = sanitizePlainText(rawSiteName) || fallback.siteName;
  audit.push({
    field: 'siteName',
    status: rawSiteName !== siteName ? 'sanitized' : 'passed',
    detail: 'Clean plain-text site name verified.',
    sanitizedValue: siteName,
  });

  // 2. maintenance
  const rawMaintenanceEnabled = Boolean(raw.maintenance?.enabled);
  const rawMaintenanceMsg = raw.maintenance?.message ?? fallback.maintenance.message;
  const cleanMaintenanceMsg = sanitizePlainText(rawMaintenanceMsg) || fallback.maintenance.message;
  audit.push({
    field: 'maintenance.message',
    status: rawMaintenanceMsg !== cleanMaintenanceMsg ? 'sanitized' : 'passed',
    detail: 'HTML stripped from maintenance message.',
    sanitizedValue: cleanMaintenanceMsg,
  });

  // 3. broadcast
  const rawBroadcastEnabled = Boolean(raw.broadcast?.enabled);
  const rawBroadcastMsg = raw.broadcast?.message ?? fallback.broadcast.message;
  const cleanBroadcastMsg = sanitizePlainText(rawBroadcastMsg);
  audit.push({
    field: 'broadcast.message',
    status: rawBroadcastMsg !== cleanBroadcastMsg ? 'sanitized' : 'passed',
    detail: 'HTML stripped from broadcast alert text.',
    sanitizedValue: cleanBroadcastMsg,
  });

  // 4. tmdb.apiKey
  const rawTmdbKey = raw.tmdb?.apiKey ?? fallback.tmdb.apiKey;
  const tmdbCheck = validateTmdbApiKey(rawTmdbKey);
  const cleanTmdbKey = tmdbCheck.isValid ? tmdbCheck.sanitized : fallback.tmdb.apiKey;
  audit.push({
    field: 'tmdb.apiKey',
    status: tmdbCheck.isValid ? 'passed' : 'sanitized',
    detail: tmdbCheck.isValid
      ? 'Alphanumeric TMDB token verified.'
      : `${tmdbCheck.reason || 'Invalid token'}. Using fallback token.`,
    sanitizedValue: cleanTmdbKey ? `${cleanTmdbKey.slice(0, 6)}...${cleanTmdbKey.slice(-4)}` : '',
  });

  // 5. Ads: Header & Footer banners
  const rawAds = raw.ads || {};

  const adIdFields: (keyof Pick<
    SiteConfig['ads'],
    'headerBannerId' | 'footerBannerId' | 'playerTopAdId' | 'playerBottomAdId' | 'sidebarAdId' | 'nativeInFeedAdId'
  >)[] = [
    'headerBannerId',
    'footerBannerId',
    'playerTopAdId',
    'playerBottomAdId',
    'sidebarAdId',
    'nativeInFeedAdId',
  ];

  const cleanAdIds: Record<string, string> = {};

  for (const field of adIdFields) {
    const rawVal = rawAds[field] ?? fallback.ads[field];
    const check = validateAdId(rawVal);
    if (check.isValid) {
      cleanAdIds[field] = check.sanitized;
      audit.push({
        field: `ads.${field}`,
        status: 'passed',
        detail: 'Hexadecimal Ad ID verified. No HTML/script injection.',
        sanitizedValue: check.sanitized,
      });
    } else {
      cleanAdIds[field] = fallback.ads[field];
      audit.push({
        field: `ads.${field}`,
        status: 'sanitized',
        detail: `${check.reason}. Defaulting to safe fallback Ad ID.`,
        sanitizedValue: fallback.ads[field],
      });
    }
  }

  // 6. directLinkUrl
  const rawDirectLink = rawAds.directLinkUrl ?? fallback.ads.directLinkUrl;
  const directLinkCheck = validateDirectLink(rawDirectLink);
  const cleanDirectLink = directLinkCheck.isValid ? directLinkCheck.sanitized : fallback.ads.directLinkUrl;
  audit.push({
    field: 'ads.directLinkUrl',
    status: directLinkCheck.isValid ? 'passed' : 'blocked',
    detail: directLinkCheck.isValid
      ? 'Safe HTTPS/HTTP direct redirect verified. Javascript: injection blocked.'
      : `${directLinkCheck.reason}. Defaulting to safe direct link.`,
    sanitizedValue: cleanDirectLink,
  });

  // 7. socialBarScript & popunderScript
  const rawSocialBar = rawAds.socialBarScript ?? fallback.ads.socialBarScript;
  const socialBarCheck = sanitizeScriptTag(rawSocialBar);
  const cleanSocialBar = socialBarCheck.isValid ? socialBarCheck.safeTag : '';
  audit.push({
    field: 'ads.socialBarScript',
    status: socialBarCheck.isValid ? (cleanSocialBar ? 'passed' : 'warning') : 'blocked',
    detail: socialBarCheck.isValid
      ? 'Verified HTTPS script loader tag.'
      : `${socialBarCheck.reason}. Inline script/cookie exploit neutralized.`,
  });

  const rawPopunder = rawAds.popunderScript ?? fallback.ads.popunderScript;
  const popunderCheck = sanitizeScriptTag(rawPopunder);
  const cleanPopunder = popunderCheck.isValid ? popunderCheck.safeTag : '';
  audit.push({
    field: 'ads.popunderScript',
    status: popunderCheck.isValid ? (cleanPopunder ? 'passed' : 'warning') : 'blocked',
    detail: popunderCheck.isValid
      ? 'Verified HTTPS popunder script tag.'
      : `${popunderCheck.reason}. Dangerous script stripped.`,
  });

  const sanitized: SiteConfig = {
    siteName,
    maintenance: {
      enabled: rawMaintenanceEnabled,
      message: cleanMaintenanceMsg,
    },
    broadcast: {
      enabled: rawBroadcastEnabled,
      message: cleanBroadcastMsg,
    },
    tmdb: {
      apiKey: cleanTmdbKey,
    },
    ads: {
      headerBannerId: cleanAdIds.headerBannerId,
      footerBannerId: cleanAdIds.footerBannerId,
      playerTopAdId: cleanAdIds.playerTopAdId,
      playerBottomAdId: cleanAdIds.playerBottomAdId,
      sidebarAdId: cleanAdIds.sidebarAdId,
      nativeInFeedAdId: cleanAdIds.nativeInFeedAdId,
      directLinkUrl: cleanDirectLink,
      socialBarScript: cleanSocialBar,
      popunderScript: cleanPopunder,
    },
  };

  return { sanitized, audit };
}
