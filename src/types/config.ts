export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
}

export interface BroadcastConfig {
  enabled: boolean;
  message: string;
}

export interface TmdbConfig {
  apiKey: string;
}

export interface AdsConfig {
  headerBannerId: string;
  footerBannerId: string;
  playerTopAdId: string;
  playerBottomAdId: string;
  sidebarAdId: string;
  nativeInFeedAdId: string;
  directLinkUrl: string;
  socialBarScript: string;
  popunderScript: string;
}

export interface SiteConfig {
  siteName: string;
  maintenance: MaintenanceConfig;
  broadcast: BroadcastConfig;
  tmdb: TmdbConfig;
  ads: AdsConfig;
}

export type ConfigSource = 'remote-primary' | 'remote-alternative' | 'local-fallback' | 'simulated';

export interface SecurityAuditEntry {
  field: string;
  status: 'passed' | 'warning' | 'sanitized' | 'blocked';
  detail: string;
  sanitizedValue?: string;
}

export interface SyncDiagnostics {
  status: 'idle' | 'syncing' | 'connected' | 'fallback' | 'error';
  source: ConfigSource;
  activeEndpoint: string;
  lastSyncTime: Date | null;
  nextSyncSeconds: number;
  syncAttempts: number;
  latencyMs: number | null;
  auditTrail: SecurityAuditEntry[];
  rawError?: string;
}
