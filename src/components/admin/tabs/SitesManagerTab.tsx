import React, { useState } from 'react';
import {
  Globe,
  Plus,
  ExternalLink,
  AlertOctagon,
  Radio,
  Film,
  DollarSign,
  Copy,
  Check,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { ManagedSite } from '../../../types/admin';

interface SitesManagerTabProps {
  sites: ManagedSite[];
  activeSiteId: string;
  onSelectSite: (siteId: string) => void;
  onOpenAddModal: () => void;
  onToggleSiteMaintenance: (site: ManagedSite) => void;
  onDeleteSite: (siteId: string) => void;
  onUpdateSiteMetadata: (siteId: string, name: string, url: string) => void;
}

export const SitesManagerTab: React.FC<SitesManagerTabProps> = ({
  sites,
  activeSiteId,
  onSelectSite,
  onOpenAddModal,
  onToggleSiteMaintenance,
  onDeleteSite,
  onUpdateSiteMetadata,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const handleCopyEndpoint = (siteId: string) => {
    const origin = window.location.origin;
    const endpoint = `${origin}/api/config/${siteId}`;
    navigator.clipboard.writeText(endpoint);
    setCopiedId(siteId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (site: ManagedSite) => {
    setEditingSiteId(site.id);
    setEditName(site.name);
    setEditUrl(site.url);
  };

  const saveEdit = (siteId: string) => {
    if (editName.trim() && editUrl.trim()) {
      onUpdateSiteMetadata(siteId, editName.trim(), editUrl.trim());
      setEditingSiteId(null);
    }
  };

  const onlineCount = sites.filter((s) => !s.config.maintenance.enabled).length;
  const maintenanceCount = sites.filter((s) => s.config.maintenance.enabled).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Summary Stats */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Multi-Site Fleet Controller
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Manage All Your Streaming Websites
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              Add multiple frontend movie platforms, configure independent ad networks, toggle emergency maintenance individually, and distribute locked config endpoints.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-xs shadow-lg shadow-rose-950/60 transition-all shrink-0 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Website</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[11px] text-neutral-400">Total Sites</span>
            <div className="text-lg font-bold text-white font-mono tabular-nums">{sites.length}</div>
          </div>
          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[11px] text-neutral-400">Online & Streaming</span>
            <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">{onlineCount}</div>
          </div>
          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[11px] text-neutral-400">In Maintenance</span>
            <div className="text-lg font-bold text-rose-400 font-mono tabular-nums">{maintenanceCount}</div>
          </div>
          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3">
            <span className="text-[11px] text-neutral-400">Sync Interval</span>
            <div className="text-lg font-bold text-neutral-300 font-mono tabular-nums">30s Locked</div>
          </div>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
            Registered Websites ({sites.length})
          </h3>
          <span className="text-xs text-neutral-400">
            Click "Manage" on any site to edit its ads, TMDB key, or broadcast
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sites.map((site) => {
            const isCurrent = site.id === activeSiteId;
            const isMaint = site.config.maintenance.enabled;
            const isEditing = editingSiteId === site.id;

            return (
              <div
                key={site.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                  isCurrent
                    ? 'bg-neutral-900 border-rose-500/80 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/50'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Top Bar on Card */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-rose-400 shrink-0 font-bold">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-white w-full"
                          />
                        ) : (
                          <h4 className="text-sm font-bold text-white truncate flex items-center gap-2">
                            <span>{site.name}</span>
                            {site.isDefault && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
                                Default
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-rose-600 text-white">
                                Active in Panel
                              </span>
                            )}
                          </h4>
                        )}
                        <p className="text-[11px] font-mono text-neutral-400">ID: {site.id}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isMaint
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      }`}
                    >
                      {isMaint ? 'Maintenance' : 'Online'}
                    </span>
                  </div>

                  {/* URL */}
                  <div className="my-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white w-full font-mono"
                      />
                    ) : (
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[11px] text-neutral-500 font-semibold uppercase">URL:</span>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-neutral-300 hover:text-white truncate flex items-center gap-1"
                          title={site.url}
                        >
                          <span>{site.url}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500 shrink-0" />
                        </a>
                      </div>
                    )}

                    {isEditing ? (
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => saveEdit(site.id)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSiteId(null)}
                          className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(site)}
                        className="text-neutral-500 hover:text-neutral-300 p-1"
                        title="Edit website URL"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Quick Feature Badges on Card */}
                  <div className="grid grid-cols-3 gap-2 my-3 text-[11px]">
                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60 text-center">
                      <span className="text-neutral-500 block text-[10px]">TMDB Key</span>
                      <span className="font-mono text-neutral-300 font-medium">
                        {site.config.tmdb?.apiKey ? 'Configured' : 'Missing'}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60 text-center">
                      <span className="text-neutral-500 block text-[10px]">Broadcast</span>
                      <span className={site.config.broadcast?.enabled ? 'text-amber-400 font-medium' : 'text-neutral-400'}>
                        {site.config.broadcast?.enabled ? 'Active' : 'Off'}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60 text-center">
                      <span className="text-neutral-500 block text-[10px]">Direct Link</span>
                      <span className="text-emerald-400 font-medium truncate block">
                        {site.config.ads?.directLinkUrl ? 'Active' : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Switch to Manage */}
                    <button
                      onClick={() => onSelectSite(site.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        isCurrent
                          ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40 cursor-default'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                      }`}
                    >
                      {isCurrent ? 'Currently Managing' : 'Manage This Site'}
                    </button>

                    {/* Quick Maintenance Toggle */}
                    <button
                      onClick={() => onToggleSiteMaintenance(site)}
                      title={isMaint ? 'Bring site online' : 'Put site in maintenance mode'}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                        isMaint
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800 hover:bg-rose-900/60'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {isMaint ? 'Turn Online' : 'Killswitch'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Copy Endpoint */}
                    <button
                      onClick={() => handleCopyEndpoint(site.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px] transition-colors"
                      title="Copy locked API endpoint for this site"
                    >
                      {copiedId === site.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>API Link</span>
                        </>
                      )}
                    </button>

                    {/* Delete site (only if not default and more than 1 site) */}
                    {!site.isDefault && sites.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${site.name}"?`)) {
                            onDeleteSite(site.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-950 transition-colors"
                        title="Delete site"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
