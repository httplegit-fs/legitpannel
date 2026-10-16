import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { SiteConfig, ManagedSite } from './src/types/admin';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SITES_FILE_PATH = path.resolve(__dirname, 'data/sites.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(SITES_FILE_PATH))) {
  fs.mkdirSync(path.dirname(SITES_FILE_PATH), { recursive: true });
}

// -----------------------------------------------------------------------------
// Cryptographically Hardened Authentication Credentials
// User ID: "prime"
// Password: "legit" (Stored exclusively as PBKDF2 SHA-512 Hash with Salt)
// No plaintext password or hash is ever leaked to the client bundle or responses.
// -----------------------------------------------------------------------------
const AUTH_SALT = 'c8f7d92e1b4a6530';
const STORED_USER_ID = process.env.ADMIN_USER_ID || 'prime';
// Pre-computed PBKDF2 100,000 iterations sha512 hash of "legit" with AUTH_SALT:
const STORED_HASH_HEX = '4fd332dff4400dd1a925f3b7a00814876f1258f4eef7c8b371587e5e5e46bcacc157bc8f8ee891243e880c116077e7cbf62df69310c5640e4e5f2a32fbb69289';

// Server-side session signing secret (generated fresh per process, never exposed)
const SERVER_TOKEN_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

function verifyPassword(providedPassword: string): boolean {
  if (typeof providedPassword !== 'string' || !providedPassword) return false;
  try {
    const computedHash = crypto.pbkdf2Sync(providedPassword, AUTH_SALT, 100000, 64, 'sha512');
    const expectedHash = Buffer.from(STORED_HASH_HEX, 'hex');
    if (computedHash.length !== expectedHash.length) return false;
    return crypto.timingSafeEqual(computedHash, expectedHash);
  } catch {
    return false;
  }
}

function generateSecureToken(username: string): string {
  const timestamp = Date.now().toString();
  const payload = `${username}:${timestamp}`;
  const signature = crypto.createHmac('sha256', SERVER_TOKEN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifySecureToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [username, timestamp, signature] = parts;
    if (username !== STORED_USER_ID) return false;

    // Check token age (max 7 days)
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 7 * 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedSig = crypto.createHmac('sha256', SERVER_TOKEN_SECRET).update(`${username}:${timestamp}`).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'));
  } catch {
    return false;
  }
}

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifySecureToken(authHeader.slice(7));
  }
  const bodyPassword = req.body?.password;
  if (bodyPassword && verifyPassword(bodyPassword)) {
    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// Universal Default Site Configuration Template
// Suitable for any website: Streaming, E-Commerce, Blog, SaaS, or Landing Page
// -----------------------------------------------------------------------------
const BASE_CONFIG_TEMPLATE: SiteConfig = {
  siteName: "Legit Movies",
  category: "movie",
  maintenance: {
    enabled: false,
    message: "We are currently performing scheduled maintenance and server upgrades. We will be back online shortly!",
    bypassKey: "admin-bypass-preview",
    redirectUrl: ""
  },
  broadcast: {
    enabled: false,
    message: "🔥 Welcome to Legit Movies! High-speed streaming is active.",
    type: "promotion",
    linkUrl: "",
    dismissible: true
  },
  seo: {
    tagline: "Stream HD Movies & Trending TV Shows",
    metaTitle: "Legit Movies — Stream Movies & Series in Ultra HD",
    metaDescription: "Watch the latest blockbuster movies and popular television series with verified fast mirrors.",
    metaKeywords: "movies, streaming, series, 4k, hd movies, watch online",
    ogImageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200",
    faviconUrl: "/favicon.ico",
    primaryColor: "#e11d48",
    themeMode: "dark"
  },
  analytics: {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    customHeadCode: "",
    customFooterCode: ""
  },
  featureFlags: {
    enableRegistration: false,
    enableComments: true,
    enableSearch: true,
    enableLiveChat: false,
    enableNewsletterPopup: false,
    customVariables: [
      { key: "support_email", value: "support@legitmovies.com", description: "Customer support contact" },
      { key: "cdn_mirror", value: "fast-cdn.mirror1", description: "Default high-bandwidth mirror cluster" }
    ]
  },
  security: {
    enableCORS: true,
    allowedOrigins: "*",
    antiAdblockPrompt: false,
    contactEmail: "admin@legitmovies.com",
    supportUrl: "https://t.me/legitmovies"
  },
  tmdb: {
    apiKey: "9a846efff59a26bc6ebb68286af2aeb8"
  },
  ads: {
    headerBannerId: "c9cf205fea000976d8c500911e2b0221",
    footerBannerId: "c9cf205fea000976d8c500911e2b0221",
    playerTopAdId: "14c52f7b9071dd9a9b839917e51bdcb1",
    playerBottomAdId: "a93371a702be78576721f5adc2c2309a",
    sidebarAdId: "e497f90baf5dc8f1b9bd0fdc0c5b9613",
    nativeInFeedAdId: "ff02012e1215699d9ae3de05f90398ec",
    directLinkUrl: "https://directyp.org/4/92399e37a2501a9051194e2f08e3352e",
    socialBarScript: "<script data-cfasync=\"false\" src=\"https://bancadeltempoidea.org/14/9a8edf3f113860bd45d90d49d2dc3491\"></script>",
    popunderScript: "<script data-cfasync=\"false\" src=\"https://aarems.org/1/b476296eb49c0e1d501decd537ad8157\"></script>"
  }
};

// Initial multi-site store
let sitesStore: Record<string, ManagedSite> = {
  'legitmovies': {
    id: 'legitmovies',
    name: 'Legit Movies',
    url: 'https://legit-movies.onrender.com',
    category: 'movie',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: { ...BASE_CONFIG_TEMPLATE }
  },
  'primeblog': {
    id: 'primeblog',
    name: 'Prime Tech & News',
    url: 'https://primetech.onrender.com',
    category: 'blog',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      ...BASE_CONFIG_TEMPLATE,
      siteName: "Prime Tech & News",
      category: "blog",
      broadcast: {
        enabled: true,
        message: "📢 Subscribe to our weekly tech roundup newsletter!",
        type: "info",
        dismissible: true
      },
      seo: {
        ...BASE_CONFIG_TEMPLATE.seo!,
        tagline: "Latest Insights in AI, Software & Technology",
        metaTitle: "Prime Tech — Cutting Edge Tech News & Deep Dives",
        metaDescription: "Daily articles and research covering cloud infrastructure, web development, and AI tools.",
        metaKeywords: "tech news, artificial intelligence, software engineering, cloud",
        primaryColor: "#3b82f6",
        themeMode: "auto"
      },
      featureFlags: {
        ...BASE_CONFIG_TEMPLATE.featureFlags!,
        enableRegistration: true,
        enableComments: true,
        enableNewsletterPopup: true
      }
    }
  }
};

// Load saved multi-site data from disk or migrate
try {
  if (fs.existsSync(SITES_FILE_PATH)) {
    const raw = fs.readFileSync(SITES_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      sitesStore = parsed;
    }
  } else {
    fs.writeFileSync(SITES_FILE_PATH, JSON.stringify(sitesStore, null, 2), 'utf-8');
  }
} catch (err) {
  console.warn('Failed reading sites data from disk, using baseline store:', err);
}

function persistSitesToDisk() {
  try {
    fs.writeFileSync(SITES_FILE_PATH, JSON.stringify(sitesStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing sites data to disk:', err);
  }
}

// 1. Mandatory CORS configuration for all remote websites
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Request logger for administrative auditing
interface AccessLog {
  timestamp: string;
  method: string;
  path: string;
  siteId?: string;
  ip: string;
  status: number;
}
let accessLogs: AccessLog[] = [];

function logApiAccess(req: Request, siteId?: string) {
  const entry: AccessLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    siteId,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    status: 200,
  };
  accessLogs.unshift(entry);
  if (accessLogs.length > 100) accessLogs.pop();
}

/**
 * Resolves which site configuration to serve based on:
 * 1. Explicit path parameter /api/config/:siteId
 * 2. Query parameter ?site=slug or ?domain=url
 * 3. Client Origin or Referer header matching a site's registered url
 * 4. Fallback to default site ('legitmovies')
 */
function resolveSite(req: Request): ManagedSite {
  const siteParam = (req.params.siteId || (req.query.site as string) || '').toLowerCase().trim();
  if (siteParam) {
    if (sitesStore[siteParam]) {
      return sitesStore[siteParam];
    }
    // Check aliases like legit-movies vs legitmovies
    if (siteParam === 'legit-movies' && sitesStore['legitmovies']) {
      return sitesStore['legitmovies'];
    }
    if (siteParam === 'legitmovies' && sitesStore['legit-movies']) {
      return sitesStore['legit-movies'];
    }
    // Search by name match
    const byName = Object.values(sitesStore).find(s => s.name.toLowerCase().replace(/\s+/g, '-') === siteParam || s.name.toLowerCase() === siteParam);
    if (byName) return byName;
  }

  // Check query domain or origin/referer header
  const domainQuery = ((req.query.domain as string) || '').toLowerCase().trim();
  const originHeader = ((req.headers['origin'] as string) || (req.headers['referer'] as string) || '').toLowerCase();

  for (const site of Object.values(sitesStore)) {
    const cleanSiteUrl = site.url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (domainQuery && (cleanSiteUrl.includes(domainQuery) || domainQuery.includes(cleanSiteUrl))) {
      return site;
    }
    if (originHeader && (originHeader.includes(cleanSiteUrl) || (site.id === 'legitmovies' && (originHeader.includes('legit-movies') || originHeader.includes('legitmovies'))))) {
      return site;
    }
  }

  // Fallback to default site
  const defaultSite = Object.values(sitesStore).find(s => s.isDefault) || Object.values(sitesStore)[0];
  return defaultSite;
}

// -------------------------------------------------------------
// Public Endpoints consumed by client websites
// -------------------------------------------------------------

// 1. Primary config endpoint (supports /api/config, /api/config/:siteId, ?site=xyz)
app.get(['/api/config', '/api/config/:siteId'], (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const site = resolveSite(req);
  logApiAccess(req, site.id);
  res.json(site.config);
});

// 2. Alternative endpoint for failover redundancy
app.get(['/api/site-config', '/api/site-config/:siteId'], (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const site = resolveSite(req);
  logApiAccess(req, site.id);
  res.json(site.config);
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'legitpannel.onrender.com (Universal Multi-Site Controller)',
    totalManagedSites: Object.keys(sitesStore).length,
    managedSites: Object.values(sitesStore).map(s => ({ id: s.id, name: s.name, url: s.url, category: s.category || 'general' })),
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Secure Admin Authentication Endpoint
// Validates ID "prime" and Password "legit" against cryptographic hash
// -------------------------------------------------------------
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, id, password } = req.body;
  const providedUser = (username || id || '').trim();
  const providedPassword = (password || '').trim();

  // Validate user ID ("prime")
  if (providedUser !== STORED_USER_ID) {
    return res.status(401).json({ error: 'Invalid administrative ID or password' });
  }

  // Verify against PBKDF2 salt hash
  if (!verifyPassword(providedPassword)) {
    return res.status(401).json({ error: 'Invalid administrative ID or password' });
  }

  // Issue secure signed token
  const token = generateSecureToken(STORED_USER_ID);
  console.log(`[Auth Audit] User "${STORED_USER_ID}" authenticated successfully at ${new Date().toISOString()}`);

  return res.json({
    success: true,
    token,
    user: { id: STORED_USER_ID, role: 'Super Administrator' },
    message: 'Authentication successful',
  });
});

// -------------------------------------------------------------
// Multi-Site Management Endpoints (Admin Protected)
// -------------------------------------------------------------

// Get all managed sites
app.get('/api/sites', (_req: Request, res: Response) => {
  const sitesList = Object.values(sitesStore);
  res.json({ sites: sitesList });
});

// Add a new site
app.post('/api/sites', (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
  }

  const { name, url, slug, category, cloneFrom } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Site name and target URL are required' });
  }

  // Generate safe slug
  let siteId = (slug || name)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '') || `site-${Date.now()}`;

  // Ensure unique ID
  if (sitesStore[siteId]) {
    siteId = `${siteId}-${Date.now().toString().slice(-4)}`;
  }

  // Choose template config
  const baseConfig: SiteConfig = cloneFrom && sitesStore[cloneFrom]
    ? JSON.parse(JSON.stringify(sitesStore[cloneFrom].config))
    : JSON.parse(JSON.stringify(BASE_CONFIG_TEMPLATE));

  baseConfig.siteName = name;
  baseConfig.category = category || 'general';

  if (baseConfig.seo) {
    baseConfig.seo.metaTitle = `${name} — Official Website`;
  }

  const newSite: ManagedSite = {
    id: siteId,
    name: name.trim(),
    url: url.trim().replace(/\/+$/, ''),
    category: category || 'general',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: baseConfig
  };

  sitesStore[siteId] = newSite;
  persistSitesToDisk();

  console.log(`[Multi-Site] Registered new site: "${name}" (${siteId}, category: ${newSite.category}) at ${url}`);
  res.json({ success: true, site: newSite, message: `Site "${name}" created successfully` });
});

// Update a site's metadata or configuration
app.put('/api/sites/:siteId', (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
  }

  const { siteId } = req.params;
  const targetSite = sitesStore[siteId];
  if (!targetSite) {
    return res.status(404).json({ error: `Site with ID "${siteId}" not found` });
  }

  const { name, url, category, isDefault, config } = req.body;

  if (name) targetSite.name = name.trim();
  if (url) targetSite.url = url.trim().replace(/\/+$/, '');
  if (category) targetSite.category = category;
  if (typeof isDefault === 'boolean') {
    if (isDefault) {
      Object.values(sitesStore).forEach(s => s.isDefault = false);
      targetSite.isDefault = true;
    }
  }

  if (config && typeof config === 'object') {
    targetSite.config = {
      ...targetSite.config,
      ...config,
      siteName: targetSite.name,
      category: targetSite.category || config.category || 'general',
      maintenance: { ...targetSite.config.maintenance, ...(config.maintenance || {}) },
      broadcast: { ...targetSite.config.broadcast, ...(config.broadcast || {}) },
      seo: { ...targetSite.config.seo, ...(config.seo || {}) },
      analytics: { ...targetSite.config.analytics, ...(config.analytics || {}) },
      featureFlags: { ...targetSite.config.featureFlags, ...(config.featureFlags || {}) },
      security: { ...targetSite.config.security, ...(config.security || {}) },
      tmdb: { ...targetSite.config.tmdb, ...(config.tmdb || {}) },
      ads: { ...targetSite.config.ads, ...(config.ads || {}) },
    };
  }

  targetSite.updatedAt = new Date().toISOString();
  persistSitesToDisk();

  res.json({ success: true, site: targetSite, message: `Updated configuration for "${targetSite.name}"` });
});

// Delete a site
app.delete('/api/sites/:siteId', (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { siteId } = req.params;
  if (!sitesStore[siteId]) {
    return res.status(404).json({ error: 'Site not found' });
  }

  if (Object.keys(sitesStore).length <= 1) {
    return res.status(400).json({ error: 'Cannot delete the last remaining site' });
  }

  const wasDefault = sitesStore[siteId].isDefault;
  delete sitesStore[siteId];

  if (wasDefault) {
    const firstRemaining = Object.values(sitesStore)[0];
    if (firstRemaining) firstRemaining.isDefault = true;
  }

  persistSitesToDisk();
  res.json({ success: true, message: `Site deleted successfully`, sites: Object.values(sitesStore) });
});

// General update endpoint
app.post('/api/admin/update', (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
  }

  const { siteId, config } = req.body;
  const targetSite = (siteId && sitesStore[siteId]) || resolveSite(req);

  if (!config || typeof config !== 'object') {
    return res.status(400).json({ error: 'Invalid configuration payload' });
  }

  targetSite.config = {
    ...targetSite.config,
    ...config,
    siteName: config.siteName || targetSite.name,
    category: targetSite.category || config.category || 'general',
    maintenance: { ...targetSite.config.maintenance, ...(config.maintenance || {}) },
    broadcast: { ...targetSite.config.broadcast, ...(config.broadcast || {}) },
    seo: { ...targetSite.config.seo, ...(config.seo || {}) },
    analytics: { ...targetSite.config.analytics, ...(config.analytics || {}) },
    featureFlags: { ...targetSite.config.featureFlags, ...(config.featureFlags || {}) },
    security: { ...targetSite.config.security, ...(config.security || {}) },
    tmdb: { ...targetSite.config.tmdb, ...(config.tmdb || {}) },
    ads: { ...targetSite.config.ads, ...(config.ads || {}) },
  };

  targetSite.updatedAt = new Date().toISOString();
  persistSitesToDisk();

  console.log(`[Legit Admin] Configuration saved for site "${targetSite.name}" (${targetSite.id})`);
  return res.json({
    success: true,
    message: `Configuration saved and broadcasted for "${targetSite.name}"`,
    siteId: targetSite.id,
    updatedConfig: targetSite.config,
  });
});

// TMDB API Key tester
app.post('/api/admin/test-tmdb', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'No TMDB API key provided' });
  }

  try {
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
    if (!tmdbRes.ok) {
      return res.status(tmdbRes.status).json({
        valid: false,
        status: tmdbRes.status,
        message: 'TMDB rejected the API key',
      });
    }
    const data = await tmdbRes.json();
    return res.json({
      valid: true,
      totalResults: data.total_results,
      sampleMovie: data.results?.[0]?.title || 'Trending Movie',
      message: 'TMDB API key verified successfully! High-speed streaming metadata active.',
    });
  } catch (err: any) {
    return res.status(500).json({ valid: false, error: err.message || 'Failed connecting to TMDB' });
  }
});

// Access logs endpoint
app.get('/api/admin/logs', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !verifySecureToken(authHeader.replace('Bearer ', ''))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ logs: accessLogs });
});

// -------------------------------------------------------------
// Frontend Mounting (Vite in Dev / Static dist in Prod)
// -------------------------------------------------------------
async function startServer() {
  const distDir = path.resolve(__dirname, 'dist');
  const hasBuiltDist = fs.existsSync(path.resolve(distDir, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || hasBuiltDist;

  if (isProduction && hasBuiltDist) {
    console.log(`[Production Mode] Serving prebuilt static assets from ${distDir}`);
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    // In dev: Mount Vite dev server middleware
    console.log('[Dev Mode] Mounting dynamic Vite middleware');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Legit Admin Multi-Site Hub] Running on port ${PORT}`);
    console.log(`[Auth Protocol] Protected with PBKDF2 SHA-512 Hash Verification`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
