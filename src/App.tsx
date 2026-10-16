import React, { useState, useEffect } from 'react';
import { SiteConfig, AdminSession, ManagedSite } from './types/admin';
import {
  fetchAllSites,
  createNewSite,
  updateSite,
  deleteSite,
  updateRemoteConfig,
  DEFAULT_CONFIG,
} from './services/adminService';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { SitesManagerTab } from './components/admin/tabs/SitesManagerTab';
import { OverviewTab } from './components/admin/tabs/OverviewTab';
import { MaintenanceTab } from './components/admin/tabs/MaintenanceTab';
import { BroadcastTab } from './components/admin/tabs/BroadcastTab';
import { SeoTab } from './components/admin/tabs/SeoTab';
import { AnalyticsTab } from './components/admin/tabs/AnalyticsTab';
import { FeatureFlagsTab } from './components/admin/tabs/FeatureFlagsTab';
import { TmdbTab } from './components/admin/tabs/TmdbTab';
import { AdsTab } from './components/admin/tabs/AdsTab';
import { LivePreviewTab } from './components/admin/tabs/LivePreviewTab';
import { ApiDeployTab } from './components/admin/tabs/ApiDeployTab';
import { AuditLogsTab } from './components/admin/tabs/AuditLogsTab';
import { AddSiteModal } from './components/admin/modals/AddSiteModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const FALLBACK_DEFAULT_SITE: ManagedSite = {
  id: 'legitmovies',
  name: 'Legit Movies',
  url: 'https://legitmovies.onrender.com',
  category: 'movie',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  config: DEFAULT_CONFIG,
};

export default function App() {
  const [session, setSession] = useState<AdminSession>(() => {
    const savedToken = localStorage.getItem('legit_admin_token');
    const savedUser = localStorage.getItem('legit_admin_user') || 'prime';
    return {
      isAuthenticated: Boolean(savedToken),
      token: savedToken,
      adminName: savedUser,
    };
  });

  const [sites, setSites] = useState<ManagedSite[]>([FALLBACK_DEFAULT_SITE]);
  const [activeSiteId, setActiveSiteId] = useState<string>('legitmovies');
  const [activeTab, setActiveTab] = useState<string>('sites');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load all sites from backend on mount
  useEffect(() => {
    fetchAllSites().then((data) => {
      if (data && data.length > 0) {
        setSites(data);
        if (!data.some((s) => s.id === activeSiteId)) {
          setActiveSiteId(data[0].id);
        }
      }
    });
  }, []);

  const activeSite: ManagedSite =
    sites.find((s) => s.id === activeSiteId) || sites[0] || FALLBACK_DEFAULT_SITE;

  // Active site config state with full universal defaults fallback
  const getHydratedConfig = (site: ManagedSite): SiteConfig => {
    return {
      ...DEFAULT_CONFIG,
      ...(site.config || {}),
      siteName: site.name || site.config?.siteName || 'Website',
      category: site.category || site.config?.category || 'general',
      maintenance: { ...DEFAULT_CONFIG.maintenance, ...(site.config?.maintenance || {}) },
      broadcast: { ...DEFAULT_CONFIG.broadcast, ...(site.config?.broadcast || {}) },
      seo: { ...DEFAULT_CONFIG.seo!, ...(site.config?.seo || {}) },
      analytics: { ...DEFAULT_CONFIG.analytics!, ...(site.config?.analytics || {}) },
      featureFlags: { ...DEFAULT_CONFIG.featureFlags!, ...(site.config?.featureFlags || {}) },
      security: { ...DEFAULT_CONFIG.security!, ...(site.config?.security || {}) },
      tmdb: { ...DEFAULT_CONFIG.tmdb!, ...(site.config?.tmdb || {}) },
      ads: { ...DEFAULT_CONFIG.ads, ...(site.config?.ads || {}) },
    };
  };

  const [currentConfig, setCurrentConfig] = useState<SiteConfig>(getHydratedConfig(activeSite));
  const [savedBaseline, setSavedBaseline] = useState<SiteConfig>(getHydratedConfig(activeSite));

  // When activeSite changes, sync local editing config
  useEffect(() => {
    if (activeSite) {
      const hydrated = getHydratedConfig(activeSite);
      setCurrentConfig(hydrated);
      setSavedBaseline(hydrated);
    }
  }, [activeSiteId, sites]);

  const hasUnsavedChanges = JSON.stringify(currentConfig) !== JSON.stringify(savedBaseline);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setSaveToast({ message, type });
    setTimeout(() => {
      setSaveToast(null);
    }, 4500);
  };

  const handleLoginSuccess = (token: string, username: string) => {
    localStorage.setItem('legit_admin_token', token);
    localStorage.setItem('legit_admin_user', username);
    setSession({
      isAuthenticated: true,
      token,
      adminName: username,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('legit_admin_token');
    localStorage.removeItem('legit_admin_user');
    setSession({
      isAuthenticated: false,
      token: null,
      adminName: '',
    });
  };

  // Add new site
  const handleAddNewSite = async (siteData: {
    name: string;
    url: string;
    slug?: string;
    category?: any;
    cloneFrom?: string;
  }): Promise<boolean> => {
    const res = await createNewSite(session.token, siteData);
    if (res.success && res.site) {
      setSites((prev) => [...prev, res.site!]);
      setActiveSiteId(res.site.id);
      setActiveTab('overview');
      showToast(`Website "${res.site.name}" added successfully! Now managing.`);
      return true;
    } else {
      showToast(res.message || 'Failed to add website', 'error');
      return false;
    }
  };

  // Delete site
  const handleDeleteSite = async (siteId: string) => {
    const res = await deleteSite(session.token, siteId);
    if (res.success) {
      const remaining = sites.filter((s) => s.id !== siteId);
      setSites(remaining);
      if (activeSiteId === siteId && remaining.length > 0) {
        setActiveSiteId(remaining[0].id);
      }
      showToast('Website removed successfully.');
    } else {
      showToast(res.message || 'Failed deleting site', 'error');
    }
  };

  // Update site metadata (name, URL)
  const handleUpdateSiteMetadata = async (siteId: string, name: string, url: string) => {
    const res = await updateSite(session.token, siteId, { name, url });
    if (res.success && res.site) {
      setSites((prev) => prev.map((s) => (s.id === siteId ? res.site! : s)));
      showToast(`Website "${name}" updated successfully.`);
    } else {
      showToast(res.message || 'Failed updating site metadata', 'error');
    }
  };

  // Save active site configuration
  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveToast(null);

    const res = await updateRemoteConfig(session.token, currentConfig, activeSite.id);
    setIsSaving(false);

    if (res.success && res.updatedConfig) {
      setSavedBaseline(currentConfig);
      setSites((prev) =>
        prev.map((s) =>
          s.id === activeSite.id
            ? { ...s, config: res.updatedConfig!, updatedAt: new Date().toISOString() }
            : s
        )
      );
      showToast(`Saved & broadcasted to ${activeSite.name} (${activeSite.url})`);
    } else {
      showToast(res.message || 'Failed to save configuration', 'error');
    }
  };

  // Toggle maintenance mode for active site
  const handleToggleMaintenance = async () => {
    const updated = {
      ...currentConfig,
      maintenance: {
        ...currentConfig.maintenance,
        enabled: !currentConfig.maintenance.enabled,
      },
    };
    setCurrentConfig(updated);

    setIsSaving(true);
    const res = await updateRemoteConfig(session.token, updated, activeSite.id);
    setIsSaving(false);

    if (res.success && res.updatedConfig) {
      setSavedBaseline(updated);
      setSites((prev) =>
        prev.map((s) =>
          s.id === activeSite.id
            ? { ...s, config: res.updatedConfig!, updatedAt: new Date().toISOString() }
            : s
        )
      );
      showToast(
        updated.maintenance.enabled
          ? `🚨 Maintenance Mode Activated for "${activeSite.name}" (${activeSite.url})`
          : `✅ Maintenance Mode Deactivated for "${activeSite.name}" (${activeSite.url})`
      );
    }
  };

  // Toggle maintenance from a site card
  const handleToggleSiteMaintenanceFromCard = async (targetSite: ManagedSite) => {
    const isNowEnabled = !targetSite.config.maintenance.enabled;
    const updatedConfig: SiteConfig = {
      ...targetSite.config,
      maintenance: {
        ...targetSite.config.maintenance,
        enabled: isNowEnabled,
      },
    };

    const res = await updateRemoteConfig(session.token, updatedConfig, targetSite.id);
    if (res.success && res.updatedConfig) {
      setSites((prev) =>
        prev.map((s) =>
          s.id === targetSite.id
            ? { ...s, config: res.updatedConfig!, updatedAt: new Date().toISOString() }
            : s
        )
      );
      if (activeSite.id === targetSite.id) {
        setCurrentConfig(updatedConfig);
        setSavedBaseline(updatedConfig);
      }
      showToast(
        isNowEnabled
          ? `🚨 ${targetSite.name} put into Maintenance Mode`
          : `✅ ${targetSite.name} brought Online`
      );
    }
  };

  // Toggle broadcast for active site
  const handleToggleBroadcast = () => {
    setCurrentConfig({
      ...currentConfig,
      broadcast: {
        ...currentConfig.broadcast,
        enabled: !currentConfig.broadcast.enabled,
      },
    });
  };

  // If not authenticated, render Login Screen
  if (!session.isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  // Active site bundle object with current in-flight edits
  const activeSiteWithEdits: ManagedSite = {
    ...activeSite,
    config: currentConfig,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans selection:bg-rose-600 selection:text-white">
      {/* Toast Notification */}
      {saveToast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border backdrop-blur-md transition-all ${
            saveToast.type === 'success'
              ? 'bg-neutral-900/95 border-emerald-500 text-emerald-200 shadow-emerald-950/40'
              : 'bg-neutral-900/95 border-rose-500 text-rose-200 shadow-rose-950/40'
          }`}
        >
          {saveToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Add New Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingSites={sites}
        onAddSite={handleAddNewSite}
      />

      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        maintenance={currentConfig.maintenance}
        onLogout={handleLogout}
        sites={sites}
        activeSite={activeSiteWithEdits}
        onSelectSite={(id) => {
          setActiveSiteId(id);
          setActiveTab('overview');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          activeSite={activeSiteWithEdits}
          sites={sites}
          onSelectSite={(id) => setActiveSiteId(id)}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSaveConfig}
          maintenanceEnabled={currentConfig.maintenance.enabled}
          onToggleMaintenance={handleToggleMaintenance}
        />

        {/* Tab Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {/* 1. Multi-Site Fleet Manager */}
          {activeTab === 'sites' && (
            <SitesManagerTab
              sites={sites.map((s) => (s.id === activeSite.id ? activeSiteWithEdits : s))}
              activeSiteId={activeSiteId}
              onSelectSite={(id) => {
                setActiveSiteId(id);
                setActiveTab('overview');
              }}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onToggleSiteMaintenance={handleToggleSiteMaintenanceFromCard}
              onDeleteSite={handleDeleteSite}
              onUpdateSiteMetadata={handleUpdateSiteMetadata}
            />
          )}

          {/* 2. Site Overview */}
          {activeTab === 'overview' && (
            <OverviewTab
              activeSite={activeSiteWithEdits}
              onNavigateTab={setActiveTab}
              onToggleMaintenance={handleToggleMaintenance}
              onToggleBroadcast={handleToggleBroadcast}
            />
          )}

          {/* 3. Maintenance Controls */}
          {activeTab === 'maintenance' && (
            <MaintenanceTab
              maintenance={currentConfig.maintenance}
              siteName={activeSite.name}
              onChange={(updated) =>
                setCurrentConfig({ ...currentConfig, maintenance: updated })
              }
            />
          )}

          {/* 4. Broadcast Ticker */}
          {activeTab === 'broadcast' && (
            <BroadcastTab
              broadcast={currentConfig.broadcast}
              onChange={(updated) =>
                setCurrentConfig({ ...currentConfig, broadcast: updated })
              }
            />
          )}

          {/* 5. SEO, Branding & OpenGraph Meta */}
          {activeTab === 'seo' && (
            <SeoTab
              seo={currentConfig.seo || DEFAULT_CONFIG.seo!}
              siteName={activeSite.name}
              siteUrl={activeSite.url}
              category={currentConfig.category || 'general'}
              onSeoChange={(updatedSeo) =>
                setCurrentConfig({ ...currentConfig, seo: updatedSeo })
              }
              onCategoryChange={(newCategory) =>
                setCurrentConfig({ ...currentConfig, category: newCategory })
              }
            />
          )}

          {/* 6. Analytics & Custom Scripts */}
          {activeTab === 'analytics' && (
            <AnalyticsTab
              analytics={currentConfig.analytics || DEFAULT_CONFIG.analytics!}
              onChange={(updatedAnalytics) =>
                setCurrentConfig({ ...currentConfig, analytics: updatedAnalytics })
              }
            />
          )}

          {/* 7. Feature Flags & Remote Variables */}
          {activeTab === 'flags' && (
            <FeatureFlagsTab
              flags={currentConfig.featureFlags || DEFAULT_CONFIG.featureFlags!}
              onChange={(updatedFlags) =>
                setCurrentConfig({ ...currentConfig, featureFlags: updatedFlags })
              }
            />
          )}

          {/* 8. Monetization & Ads */}
          {activeTab === 'ads' && (
            <AdsTab
              ads={currentConfig.ads}
              onChange={(updated) =>
                setCurrentConfig({ ...currentConfig, ads: updated })
              }
            />
          )}

          {/* 9. TMDB API Settings (For Movie sites) */}
          {activeTab === 'tmdb' && (
            <TmdbTab
              tmdb={currentConfig.tmdb || DEFAULT_CONFIG.tmdb!}
              onChange={(updated) =>
                setCurrentConfig({ ...currentConfig, tmdb: updated })
              }
            />
          )}

          {/* 10. Live Client Simulator */}
          {activeTab === 'preview' && <LivePreviewTab activeSite={activeSiteWithEdits} />}

          {/* 11. REST API & Integration */}
          {activeTab === 'deploy' && <ApiDeployTab activeSite={activeSiteWithEdits} />}

          {/* 12. Audit Logs */}
          {activeTab === 'logs' && <AuditLogsTab token={session.token} />}
        </main>
      </div>
    </div>
  );
}
