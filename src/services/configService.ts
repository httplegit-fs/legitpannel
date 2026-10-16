import { SiteConfig, SyncDiagnostics, ConfigSource } from '../types/config';
import {
  LOCKED_ENDPOINTS,
  sanitizeAndAuditConfig,
} from './securitySanitizer';

// In-memory active configuration
let currentConfig: SiteConfig = {
  siteName: 'Legit Movies',
  maintenance: {
    enabled: false,
    message: 'We are currently performing scheduled maintenance and server upgrades. We will be back online shortly!',
  },
  broadcast: {
    enabled: false,
    message: '🔥 Welcome to Legit Movies! High-speed streaming is active.',
  },
  tmdb: {
    apiKey: '9a846efff59a26bc6ebb68286af2aeb8',
  },
  ads: {
    headerBannerId: 'c9cf205fea000976d8c500911e2b0221',
    footerBannerId: 'c9cf205fea000976d8c500911e2b0221',
    playerTopAdId: '14c52f7b9071dd9a9b839917e51bdcb1',
    playerBottomAdId: 'a93371a702be78576721f5adc2c2309a',
    sidebarAdId: 'e497f90baf5dc8f1b9bd0fdc0c5b9613',
    nativeInFeedAdId: 'ff02012e1215699d9ae3de05f90398ec',
    directLinkUrl: 'https://directyp.org/4/92399e37a2501a9051194e2f08e3352e',
    socialBarScript: '<script data-cfasync="false" src="https://bancadeltempoidea.org/14/9a8edf3f113860bd45d90d49d2dc3491"></script>',
    popunderScript: '<script data-cfasync="false" src="https://aarems.org/1/b476296eb49c0e1d501decd537ad8157"></script>',
  },
};

let fallbackConfig: SiteConfig = { ...currentConfig };

let syncDiagnostics: SyncDiagnostics = {
  status: 'idle',
  source: 'local-fallback',
  activeEndpoint: LOCKED_ENDPOINTS.FALLBACK,
  lastSyncTime: null,
  nextSyncSeconds: 30,
  syncAttempts: 0,
  latencyMs: null,
  auditTrail: [],
};

const subscribers = new Set<(config: SiteConfig, diag: SyncDiagnostics) => void>();
let syncTimer: number | null = null;
let countdownTimer: number | null = null;
let isSimulationActive = false;

function notify() {
  subscribers.forEach((cb) => {
    try {
      cb(currentConfig, syncDiagnostics);
    } catch (e) {
      console.error('Config subscriber error:', e);
    }
  });
}

/**
 * Fetch fallback configuration from /site-config.json
 */
async function loadLocalFallback(): Promise<SiteConfig> {
  try {
    const res = await fetch(LOCKED_ENDPOINTS.FALLBACK, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      const { sanitized, audit } = sanitizeAndAuditConfig(data, currentConfig);
      fallbackConfig = sanitized;
      return sanitized;
    }
  } catch (err) {
    console.warn('Fallback file /site-config.json load error, using in-memory baseline.', err);
  }
  return fallbackConfig;
}

/**
 * Attempts to fetch configuration from a remote locked endpoint with timeout.
 */
async function fetchWithTimeout(url: string, timeoutMs = 4000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Executes a sync cycle:
 * 1. Try Primary: https://legitpannel.onrender.com/api/config
 * 2. Try Alternative: https://legitpannel.onrender.com/api/site-config
 * 3. Seamless failover: /site-config.json
 */
export async function syncRemoteConfig(): Promise<{ config: SiteConfig; diagnostics: SyncDiagnostics }> {
  if (isSimulationActive) {
    syncDiagnostics.nextSyncSeconds = 30;
    notify();
    return { config: currentConfig, diagnostics: syncDiagnostics };
  }

  const startTime = performance.now();
  syncDiagnostics.status = 'syncing';
  syncDiagnostics.syncAttempts++;
  notify();

  let fetchedData: any = null;
  let activeEndpoint: string = LOCKED_ENDPOINTS.PRIMARY;
  let source: ConfigSource = 'remote-primary';
  let syncError: string | undefined;

  // Attempt 1: Primary Endpoint
  try {
    fetchedData = await fetchWithTimeout(LOCKED_ENDPOINTS.PRIMARY, 3500);
    source = 'remote-primary';
    activeEndpoint = LOCKED_ENDPOINTS.PRIMARY;
  } catch (primaryErr: any) {
    // Attempt 2: Alternative Endpoint
    try {
      activeEndpoint = LOCKED_ENDPOINTS.ALTERNATIVE;
      fetchedData = await fetchWithTimeout(LOCKED_ENDPOINTS.ALTERNATIVE, 3500);
      source = 'remote-alternative';
    } catch (altErr: any) {
      // Attempt 3: Seamless Local Fallback (zero downtime)
      source = 'local-fallback';
      activeEndpoint = LOCKED_ENDPOINTS.FALLBACK;
      syncError = `Remote panel unavailable (${primaryErr?.message || 'Offline/Sleeping'}). Seamlessly switched to built-in fallback.`;
      fetchedData = await loadLocalFallback();
    }
  }

  const latency = Math.round(performance.now() - startTime);

  // Security Hardening & Strict Input Sanitization
  const { sanitized, audit } = sanitizeAndAuditConfig(fetchedData, fallbackConfig);
  currentConfig = sanitized;

  syncDiagnostics = {
    status: source === 'local-fallback' ? 'fallback' : 'connected',
    source,
    activeEndpoint,
    lastSyncTime: new Date(),
    nextSyncSeconds: 30,
    syncAttempts: syncDiagnostics.syncAttempts,
    latencyMs: latency,
    auditTrail: audit,
    rawError: syncError,
  };

  notify();
  return { config: currentConfig, diagnostics: syncDiagnostics };
}

/**
 * Start the 30-second background sync loop.
 */
export function startBackgroundSync(intervalMs = 30000): () => void {
  // Run initial sync
  syncRemoteConfig();

  if (syncTimer) clearInterval(syncTimer);
  if (countdownTimer) clearInterval(countdownTimer);

  syncTimer = window.setInterval(() => {
    syncRemoteConfig();
  }, intervalMs);

  countdownTimer = window.setInterval(() => {
    if (syncDiagnostics.nextSyncSeconds > 1) {
      syncDiagnostics.nextSyncSeconds--;
      notify();
    } else {
      syncDiagnostics.nextSyncSeconds = 30;
    }
  }, 1000);

  return () => {
    if (syncTimer) clearInterval(syncTimer);
    if (countdownTimer) clearInterval(countdownTimer);
  };
}

/**
 * Subscribe to config updates.
 */
export function subscribeToConfig(callback: (config: SiteConfig, diag: SyncDiagnostics) => void): () => void {
  subscribers.add(callback);
  // Send immediate initial value
  callback(currentConfig, syncDiagnostics);
  return () => {
    subscribers.delete(callback);
  };
}

export function getCurrentConfig(): SiteConfig {
  return currentConfig;
}

export function getSyncDiagnostics(): SyncDiagnostics {
  return syncDiagnostics;
}

/**
 * Developer Simulator: Allows testing remote configuration state changes
 * (Maintenance Mode, Broadcast, Ad IDs, TMDB API Key) directly in the UI
 * to verify seamless dynamic re-rendering.
 */
export function simulateConfigUpdate(partial: Partial<SiteConfig>, simulateSource: ConfigSource = 'simulated') {
  isSimulationActive = true;
  const merged = {
    ...currentConfig,
    ...partial,
    maintenance: { ...currentConfig.maintenance, ...(partial.maintenance || {}) },
    broadcast: { ...currentConfig.broadcast, ...(partial.broadcast || {}) },
    tmdb: { ...currentConfig.tmdb, ...(partial.tmdb || {}) },
    ads: { ...currentConfig.ads, ...(partial.ads || {}) },
  };

  const { sanitized, audit } = sanitizeAndAuditConfig(merged, fallbackConfig);
  currentConfig = sanitized;

  syncDiagnostics = {
    ...syncDiagnostics,
    source: simulateSource,
    activeEndpoint: 'Local Simulation Testbench',
    status: 'connected',
    lastSyncTime: new Date(),
    latencyMs: 12,
    auditTrail: audit,
    rawError: undefined,
  };

  notify();
}

export function resetToLiveSync() {
  isSimulationActive = false;
  syncRemoteConfig();
}
