export type SiteCategory = 'movie' | 'ecommerce' | 'blog' | 'saas' | 'general';

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  bypassKey?: string;
  redirectUrl?: string;
}

export interface BroadcastConfig {
  enabled: boolean;
  message: string;
  type?: 'info' | 'warning' | 'alert' | 'promotion';
  linkUrl?: string;
  dismissible?: boolean;
}

export interface SeoConfig {
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
  faviconUrl: string;
  primaryColor: string;
  themeMode: 'dark' | 'light' | 'auto';
}

export interface AnalyticsConfig {
  googleAnalyticsId: string; // G-XXXXXXXXXX
  googleTagManagerId: string; // GTM-XXXXXXX
  facebookPixelId: string;
  customHeadCode: string;
  customFooterCode: string;
}

export interface FeatureFlagItem {
  key: string;
  value: string;
  description: string;
}

export interface FeatureFlagsConfig {
  enableRegistration: boolean;
  enableComments: boolean;
  enableSearch: boolean;
  enableLiveChat: boolean;
  enableNewsletterPopup: boolean;
  customVariables: FeatureFlagItem[];
}

export interface SecurityPolicyConfig {
  enableCORS: boolean;
  allowedOrigins: string;
  antiAdblockPrompt: boolean;
  contactEmail: string;
  supportUrl: string;
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
  category: SiteCategory;
  maintenance: MaintenanceConfig;
  broadcast: BroadcastConfig;
  seo?: SeoConfig;
  analytics?: AnalyticsConfig;
  featureFlags?: FeatureFlagsConfig;
  security?: SecurityPolicyConfig;
  tmdb?: TmdbConfig;
  ads: AdsConfig;
}

export interface ManagedSite {
  id: string; // unique slug e.g. 'legitmovies'
  name: string;
  url: string; // e.g. 'https://legitmovies.onrender.com'
  category?: SiteCategory;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
  config: SiteConfig;
}

export interface AdminSession {
  isAuthenticated: boolean;
  token: string | null;
  adminName: string;
}

export interface ApiAccessLog {
  timestamp: string;
  method: string;
  path: string;
  siteId?: string;
  ip: string;
  status: number;
}
