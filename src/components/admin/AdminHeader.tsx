import React from 'react';
import { Save, AlertOctagon, CheckCircle2, RefreshCw, Globe, ChevronDown } from 'lucide-react';
import { ManagedSite } from '../../types/admin';

interface AdminHeaderProps {
  activeTab: string;
  activeSite: ManagedSite;
  sites: ManagedSite[];
  onSelectSite: (siteId: string) => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  maintenanceEnabled: boolean;
  onToggleMaintenance: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  activeSite,
  sites,
  onSelectSite,
  hasUnsavedChanges,
  isSaving,
  onSave,
  maintenanceEnabled,
  onToggleMaintenance,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'sites':
        return 'Multi-Site Fleet Manager';
      case 'overview':
        return 'Dashboard & Live Status';
      case 'maintenance':
        return 'Maintenance Mode & Emergency Killswitch';
      case 'broadcast':
        return 'Live Broadcast Announcement';
      case 'seo':
        return 'SEO, Branding & OpenGraph Meta';
      case 'analytics':
        return 'Analytics, Tracking & Custom Scripts';
      case 'flags':
        return 'Remote Feature Flags & Dynamic Variables';
      case 'tmdb':
        return 'TMDB API & Content Settings';
      case 'ads':
        return 'Monetization & Ad Units Configuration';
      case 'preview':
        return 'Live Client Simulator';
      case 'deploy':
        return 'REST API & Render Deployment Hub';
      case 'logs':
        return 'Remote Access Audit Trail';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1 & 2: Breadcrumbs & Site Pill */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        {/* Site Switcher Pill */}
        <div className="relative shrink-0">
          <select
            value={activeSite.id}
            onChange={(e) => onSelectSite(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg py-1 pl-2.5 pr-7 text-xs font-bold text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer max-w-[140px] sm:max-w-[180px] truncate"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <span className="text-neutral-600">/</span>

        <h1 className="text-xs sm:text-sm font-bold text-neutral-200 truncate">
          {getTabTitle()}
        </h1>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Emergency Maintenance Toggle for active site */}
        <button
          onClick={onToggleMaintenance}
          title={maintenanceEnabled ? 'Deactivate Maintenance (Bring site online)' : 'Activate Maintenance (Emergency killswitch)'}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            maintenanceEnabled
              ? 'bg-rose-950/60 border-rose-600 text-rose-400 hover:bg-rose-900/80'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-neutral-700'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{maintenanceEnabled ? 'Site: LOCKED' : 'Site: ONLINE'}</span>
        </button>

        {/* Save & Broadcast Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all whitespace-nowrap shrink-0 ${
            hasUnsavedChanges
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60 animate-pulse'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700/60'
          }`}
        >
          {isSaving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : hasUnsavedChanges ? (
            <Save className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{isSaving ? 'Broadcasting...' : hasUnsavedChanges ? `Save "${activeSite.name}"` : 'All Saved'}</span>
        </button>
      </div>
    </header>
  );
};
