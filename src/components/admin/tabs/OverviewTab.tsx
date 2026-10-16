import React, { useState } from 'react';
import {
  Server,
  AlertOctagon,
  Radio,
  Film,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { ManagedSite } from '../../../types/admin';

interface OverviewTabProps {
  activeSite: ManagedSite;
  onNavigateTab: (tab: string) => void;
  onToggleMaintenance: () => void;
  onToggleBroadcast: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  activeSite,
  onNavigateTab,
  onToggleMaintenance,
  onToggleBroadcast,
}) => {
  const [copied, setCopied] = useState(false);
  const config = activeSite.config;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Target Status Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${config.maintenance.enabled ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
              <span className={`text-xs uppercase font-bold tracking-wider ${config.maintenance.enabled ? 'text-rose-400' : 'text-emerald-400'}`}>
                {config.maintenance.enabled ? 'Site Locked in Maintenance' : 'Remote Link Active & Broadcasting'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Managing {activeSite.name}
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              Target static website <span className="font-mono text-neutral-200">{activeSite.url}</span> synchronizes from this admin panel every 30 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={activeSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700/80 text-xs font-semibold transition-colors"
            >
              <span>Visit {activeSite.url.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => onNavigateTab('preview')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-md shadow-rose-950/40"
            >
              <span>Live Client Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Feature Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Maintenance Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  config.maintenance.enabled
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                }`}
              >
                {config.maintenance.enabled ? 'ACTIVE (BLOCKING)' : 'OFF (ONLINE)'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Maintenance Mode</h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {config.maintenance.enabled
                ? 'Website is displaying the maintenance screen to all visitors.'
                : 'Streaming platform is active and accessible to all users.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              onClick={onToggleMaintenance}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              {config.maintenance.enabled ? 'Turn OFF Maintenance' : 'Turn ON Maintenance'}
            </button>
            <button
              onClick={() => onNavigateTab('maintenance')}
              className="text-neutral-500 hover:text-neutral-300 text-xs"
            >
              Edit Message →
            </button>
          </div>
        </div>

        {/* Broadcast Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Radio className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  config.broadcast.enabled
                    ? 'bg-amber-600 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {config.broadcast.enabled ? 'BROADCASTING' : 'DISABLED'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Broadcast Ticker</h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {config.broadcast.enabled
                ? config.broadcast.message || 'Announcement active on top banner.'
                : 'No ticker message active currently.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              onClick={onToggleBroadcast}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              {config.broadcast.enabled ? 'Disable Banner' : 'Enable Banner'}
            </button>
            <button
              onClick={() => onNavigateTab('broadcast')}
              className="text-neutral-500 hover:text-neutral-300 text-xs"
            >
              Edit Ticker →
            </button>
          </div>
        </div>

        {/* TMDB API Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-sky-950/60 text-sky-400 border border-sky-800/40">
                CONFIGURED
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">TMDB API Key</h3>
            <p className="text-xs font-mono text-neutral-400 mt-1 truncate">
              {config.tmdb?.apiKey ? `${config.tmdb.apiKey.slice(0, 10)}...${config.tmdb.apiKey.slice(-4)}` : 'No key set'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Movie Catalog Sync</span>
            <button
              onClick={() => onNavigateTab('tmdb')}
              className="text-sky-400 hover:text-sky-300 text-xs font-medium"
            >
              Test Key →
            </button>
          </div>
        </div>

        {/* Ads & Monetization Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                6 AD SLOTS
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Monetization Units</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Banner, Player Top/Bottom, Sidebar, In-Feed, and Direct Download link.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Sanitized
            </span>
            <button
              onClick={() => onNavigateTab('ads')}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
            >
              Manage Ads →
            </button>
          </div>
        </div>
      </div>

      {/* Live Endpoints and JSON Output */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-500" />
              Live JSON Configuration Output for {activeSite.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Endpoint: <code className="text-rose-400 font-mono">GET /api/config/{activeSite.id}</code> (or <code className="text-neutral-300 font-mono">/api/config</code> when matching domain)
            </p>
          </div>

          <button
            onClick={copyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-xs font-medium transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 font-mono text-xs text-neutral-300 overflow-x-auto max-h-72 leading-relaxed custom-scrollbar">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
};
