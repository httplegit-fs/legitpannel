import { SiteConfig, ApiAccessLog, ManagedSite } from '../types/admin';

export const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'Legit Movies',
  category: 'movie',
  maintenance: {
    enabled: false,
    message: 'We are currently performing scheduled maintenance and server upgrades. We will be back online shortly!',
    bypassKey: 'admin-bypass-preview',
    redirectUrl: '',
  },
  broadcast: {
    enabled: false,
    message: '🔥 Welcome to Legit Movies! High-speed streaming is active.',
    type: 'promotion',
    linkUrl: '',
    dismissible: true,
  },
  seo: {
    tagline: 'Stream HD Movies & Trending TV Shows',
    metaTitle: 'Legit Movies — Stream Movies & Series in Ultra HD',
    metaDescription: 'Watch the latest blockbuster movies and popular television series with verified fast mirrors.',
    metaKeywords: 'movies, streaming, series, 4k, hd movies, watch online',
    ogImageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200',
    faviconUrl: '/favicon.ico',
    primaryColor: '#e11d48',
    themeMode: 'dark',
  },
  analytics: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    customHeadCode: '',
    customFooterCode: '',
  },
  featureFlags: {
    enableRegistration: false,
    enableComments: true,
    enableSearch: true,
    enableLiveChat: false,
    enableNewsletterPopup: false,
    customVariables: [
      { key: 'support_email', value: 'support@legitmovies.com', description: 'Customer support contact' },
      { key: 'cdn_mirror', value: 'fast-cdn.mirror1', description: 'Default high-bandwidth mirror cluster' },
    ],
  },
  security: {
    enableCORS: true,
    allowedOrigins: '*',
    antiAdblockPrompt: false,
    contactEmail: 'admin@legitmovies.com',
    supportUrl: 'https://t.me/legitmovies',
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

// Fetch all registered sites
export async function fetchAllSites(): Promise<ManagedSite[]> {
  try {
    const res = await fetch('/api/sites', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data.sites && Array.isArray(data.sites) && data.sites.length > 0) {
        return data.sites;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch /api/sites:', err);
  }

  // Baseline fallback
  return [
    {
      id: 'legitmovies',
      name: 'Legit Movies',
      url: 'https://legitmovies.onrender.com',
      category: 'movie',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: DEFAULT_CONFIG,
    },
  ];
}

// Create a new site
export async function createNewSite(
  token: string | null,
  siteData: { name: string; url: string; slug?: string; category?: string; cloneFrom?: string }
): Promise<{ success: boolean; site?: ManagedSite; message: string; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/sites', {
      method: 'POST',
      headers,
      body: JSON.stringify(siteData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed creating new site', error: data.error };
    }
    return { success: true, site: data.site, message: data.message };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error creating site', error: err.message };
  }
}

// Update site configuration or metadata
export async function updateSite(
  token: string | null,
  siteId: string,
  updates: { name?: string; url?: string; category?: string; isDefault?: boolean; config?: SiteConfig }
): Promise<{ success: boolean; site?: ManagedSite; message: string; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/sites/${siteId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed updating site', error: data.error };
    }
    return { success: true, site: data.site, message: data.message };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error updating site', error: err.message };
  }
}

// Delete a site
export async function deleteSite(
  token: string | null,
  siteId: string
): Promise<{ success: boolean; message: string; sites?: ManagedSite[]; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/sites/${siteId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed deleting site', error: data.error };
    }
    return { success: true, message: data.message, sites: data.sites };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error deleting site', error: err.message };
  }
}

// Update configuration for a specific site
export async function updateRemoteConfig(
  token: string | null,
  config: SiteConfig,
  siteId?: string
): Promise<{ success: boolean; message: string; updatedConfig?: SiteConfig; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/admin/update', {
      method: 'POST',
      headers,
      body: JSON.stringify({ siteId, config }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed to update configuration', error: data.error };
    }
    return { success: true, message: data.message, updatedConfig: data.updatedConfig };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error updating configuration', error: err.message };
  }
}

// Secure Admin Login (Validates ID: "prime" and Password: "legit" against backend PBKDF2 hash)
export async function adminLogin(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Authentication failed' };
    }
    return { success: true, token: data.token, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection failed to auth service' };
  }
}

// TMDB API tester
export async function testTmdbApiKey(
  apiKey: string
): Promise<{ valid: boolean; message: string; sampleMovie?: string; totalResults?: number }> {
  try {
    const res = await fetch('/api/admin/test-tmdb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    const data = await res.json();
    if (res.ok && data.valid) {
      return {
        valid: true,
        message: data.message || 'Key is active and valid.',
        sampleMovie: data.sampleMovie,
        totalResults: data.totalResults,
      };
    }
    return {
      valid: false,
      message: data.message || data.error || 'TMDB API key validation failed.',
    };
  } catch {
    try {
      const direct = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
      if (direct.ok) {
        const d = await direct.json();
        return {
          valid: true,
          message: 'Direct verification successful: TMDB key active!',
          sampleMovie: d.results?.[0]?.title,
          totalResults: d.total_results,
        };
      }
      return { valid: false, message: `TMDB returned HTTP ${direct.status}` };
    } catch (e: any) {
      return { valid: false, message: `Could not verify key: ${e.message}` };
    }
  }
}

// Access logs
export async function fetchAuditLogs(token: string | null): Promise<ApiAccessLog[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/admin/logs', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
  } catch {
    // ignore
  }
  return [];
}
