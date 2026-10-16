import React from 'react';
import {
  Globe,
  LayoutDashboard,
  AlertOctagon,
  Radio,
  Search,
  BarChart3,
  Sliders,
  Film,
  DollarSign,
  MonitorPlay,
  Terminal,
  Activity,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { MaintenanceConfig, ManagedSite } from '../../types/admin';

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  maintenance: MaintenanceConfig;
  onLogout: () => void;
  sites: ManagedSite[];
  activeSite: ManagedSite;
  onSelectSite: (siteId: string) => void;
  onOpenAddModal: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  maintenance,
  onLogout,
  sites,
  activeSite,
  onSelectSite,
  onOpenAddModal,
}) => {
  const isMovieSite = activeSite.category === 'movie' || activeSite.id === 'legitmovies';

  const navItems = [
    {
      id: 'sites',
      label: 'Manage All Sites',
      icon: Globe,
      badge: `${sites.length} Sites`,
      badgeColor: 'bg-rose-950/70 text-rose-300 border border-rose-800/60',
    },
    {
      id: 'overview',
      label: 'Site Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'maintenance',
      label: 'Maintenance & Killswitch',
      icon: AlertOctagon,
      badge: maintenance.enabled ? 'ACTIVE' : null,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'broadcast',
      label: 'Broadcast Ticker',
      icon: Radio,
      badge: null,
    },
    {
      id: 'seo',
      label: 'SEO, Branding & OG',
      icon: Search,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics & Tracking',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'flags',
      label: 'Feature Flags & Vars',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'ads',
      label: 'Monetization & Ads',
      icon: DollarSign,
      badge: null,
    },
    ...(isMovieSite
      ? [
          {
            id: 'tmdb',
            label: 'TMDB API Settings',
            icon: Film,
            badge: 'Movie',
            badgeColor: 'bg-sky-950/60 text-sky-400 border border-sky-800/40',
          },
        ]
      : []),
    {
      id: 'preview',
      label: 'Live Client Preview',
      icon: MonitorPlay,
      badge: 'Sim',
      badgeColor: 'bg-neutral-800 text-neutral-300',
    },
    {
      id: 'deploy',
      label: 'API & Integration',
      icon: Terminal,
      badge: null,
    },
    {
      id: 'logs',
      label: 'Audit & Access Logs',
      icon: Activity,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 sm:w-68 shrink-0 bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 select-none">
      <div>
        {/* Top Brand Header */}
        <div className="p-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-950/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-none">
                Legit Admin
              </h2>
              <span className="text-[10px] text-neutral-400 font-mono">
                Multi-Site Fleet Hub
              </span>
            </div>
          </div>

          {/* Active Site Selector */}
          <div className="mt-3 p-2 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              <span>Active Site:</span>
              <button
                onClick={onOpenAddModal}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                title="Add new website"
              >
                <Plus className="w-3 h-3" />
                <span>Add Site</span>
              </button>
            </div>

            <div className="relative">
              <select
                value={activeSite.id}
                onChange={(e) => onSelectSite(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 pl-2.5 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer truncate"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.config.maintenance.enabled ? 'Maint' : 'Online'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Target URL indicator */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    activeSite.config.maintenance.enabled ? 'bg-rose-500' : 'bg-emerald-400'
                  }`}
                />
                <span className="font-mono text-neutral-300 truncate max-w-[130px]" title={activeSite.url}>
                  {activeSite.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
              <a
                href={activeSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white p-0.5"
                title="Visit site URL"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      item.badgeColor || 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account / Logout */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400 text-xs font-bold shrink-0 font-mono">
              P
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">prime</p>
              <p className="text-[10px] text-emerald-400 font-mono">Authenticated</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out of Admin Panel"
            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
