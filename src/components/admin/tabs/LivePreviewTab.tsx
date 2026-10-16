import React, { useState } from 'react';
import {
  MonitorPlay,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Radio,
  Wrench,
  Film,
  Play,
  Download,
} from 'lucide-react';
import { ManagedSite } from '../../../types/admin';

interface LivePreviewTabProps {
  activeSite: ManagedSite;
}

export const LivePreviewTab: React.FC<LivePreviewTabProps> = ({ activeSite }) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const config = activeSite.config;

  return (
    <div className="space-y-6">
      {/* Viewport Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MonitorPlay className="w-4 h-4 text-rose-500" />
            Live Client Render Simulator — {activeSite.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time visual reflection of how <span className="font-mono text-neutral-200">{activeSite.url}</span> renders with your current configuration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewport === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewport === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <a
            href={activeSite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors"
          >
            <span>Open Real URL</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Screen Frame */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl flex flex-col ${
            viewport === 'desktop' ? 'w-full max-w-5xl h-[680px]' : 'w-[375px] h-[680px]'
          }`}
        >
          {/* Simulated Browser Bar */}
          <div className="h-9 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2 text-xs text-neutral-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="mx-auto px-4 py-0.5 rounded-md bg-neutral-950 border border-neutral-800/80 text-[11px] font-mono text-neutral-300 truncate max-w-xs">
              {activeSite.url}
            </div>
          </div>

          {/* Browser Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950 text-white text-xs">
            {/* Condition 1: Maintenance Mode Screen */}
            {config.maintenance.enabled ? (
              <div className="min-h-full flex flex-col items-center justify-center p-8 text-center bg-neutral-950">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 mb-4">
                  <Wrench className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-2">
                  {activeSite.name} · Scheduled Maintenance
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Streaming Infrastructure Upgrade
                </h3>
                <div className="max-w-md bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 text-neutral-300 text-xs mb-4">
                  {config.maintenance.message}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Auto-checking status in <span className="font-mono text-white font-bold">14s</span>
                </div>
              </div>
            ) : (
              /* Condition 2: Active Streaming Platform */
              <div>
                {/* Broadcast Announcement Bar */}
                {config.broadcast.enabled && (
                  <div className="bg-gradient-to-r from-rose-950 via-neutral-900 to-rose-950 border-b border-rose-900/40 text-neutral-200 px-4 py-2 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                    <span className="font-bold text-rose-300 uppercase text-[10px] shrink-0">
                      Announcement:
                    </span>
                    <span className="truncate text-white text-xs">{config.broadcast.message}</span>
                  </div>
                )}

                {/* Simulated Header */}
                <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                      <Film className="w-4 h-4" />
                    </div>
                    <span>{activeSite.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-1 rounded bg-rose-600 text-white font-bold">
                      Direct Stream
                    </span>
                  </div>
                </div>

                {/* Simulated Hero Section */}
                <div className="relative h-64 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 flex flex-col justify-end">
                  <div className="text-[11px] text-rose-400 font-bold uppercase mb-1">
                    Featured Premiere · 4K Ultra HD
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Dune: Part Two</h2>
                  <p className="text-neutral-400 text-[11px] line-clamp-2 max-w-md mb-3">
                    Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs">
                      <Play className="w-3 h-3 fill-white" /> Stream Now
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs">
                      <Download className="w-3 h-3 text-emerald-400" /> Direct Mirror
                    </div>
                  </div>
                </div>

                {/* Simulated Header Banner Ad Slot */}
                {config.ads.headerBannerId && (
                  <div className="m-4 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <span className="text-[11px] font-semibold text-neutral-300">
                        Top Header Banner AD · Unit {config.ads.headerBannerId.slice(0, 8)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">Verified Fast Mirror</span>
                  </div>
                )}

                {/* Movie Grid Preview */}
                <div className="p-4 space-y-4">
                  <div className="font-bold text-sm text-white">Trending Movies on {activeSite.name}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Dune 2', 'Oppenheimer', 'Spider-Man'].map((t, idx) => (
                      <div key={idx} className="aspect-[2/3] rounded-lg bg-neutral-900 border border-neutral-800 p-2 flex flex-col justify-end">
                        <span className="font-bold text-white text-[11px] truncate">{t}</span>
                        <span className="text-[9px] text-neutral-500">★ 8.4 · 2024</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
