import React from 'react';
import { Radio, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { BroadcastConfig } from '../../../types/admin';

interface BroadcastTabProps {
  broadcast: BroadcastConfig;
  onChange: (updated: BroadcastConfig) => void;
}

export const BroadcastTab: React.FC<BroadcastTabProps> = ({ broadcast, onChange }) => {
  const presets = [
    '🔥 Welcome to Legit Movies! High-speed streaming is active.',
    '⚡ New 4K mirrors and zero-buffer direct download servers added!',
    '🍿 Binge Alert: Top trending blockbusters available in Dolby 5.1 & Ultra HD.',
    '🚀 Server bandwidth upgraded! Enjoy lightning-fast streaming without popups.',
  ];

  return (
    <div className="space-y-6">
      {/* Toggle Banner Box */}
      <div className={`p-6 rounded-2xl border transition-all ${
        broadcast.enabled
          ? 'bg-amber-950/30 border-amber-500/60 shadow-xl shadow-amber-950/30'
          : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              broadcast.enabled
                ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-950/60 font-bold'
                : 'bg-neutral-800 text-neutral-400'
            }`}>
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Live Broadcast Announcement Marquee
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  broadcast.enabled ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {broadcast.enabled ? 'Broadcasting Live' : 'Banner Inactive'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                When active, a prominent top notification ribbon appears across all pages of <span className="font-mono text-neutral-200">legitmovies.onrender.com</span>. Visitors can read and optionally dismiss it.
              </p>
            </div>
          </div>

          <button
            onClick={() => onChange({ ...broadcast, enabled: !broadcast.enabled })}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 ${
              broadcast.enabled
                ? 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-950/60'
            }`}
          >
            {broadcast.enabled ? 'Disable Broadcast' : 'Enable Broadcast'}
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            Announcement Message
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Keep it clear and actionable. Plain text will be sanitized automatically.
          </p>
        </div>

        <input
          type="text"
          value={broadcast.message}
          onChange={(e) => onChange({ ...broadcast, message: e.target.value })}
          placeholder="e.g. 🔥 Welcome to Legit Movies! High-speed streaming is active."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> HTML tags stripped for XSS protection
          </span>
          <span className="font-mono tabular-nums">{broadcast.message.length} chars</span>
        </div>

        {/* Quick Presets */}
        <div className="pt-3 border-t border-neutral-800/80">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Preset Templates:
          </span>
          <div className="space-y-2">
            {presets.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange({ ...broadcast, message: msg })}
                className="w-full text-left p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 text-xs text-neutral-300 hover:text-white transition-colors flex items-center justify-between group"
              >
                <span>{msg}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview on Site */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Live Client Banner Preview
        </h4>

        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
          <div className="bg-gradient-to-r from-rose-950/90 via-neutral-900 to-rose-950/90 border-b border-rose-900/40 text-neutral-200 px-4 py-2.5 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-rose-600/30 text-rose-400 shrink-0">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="font-semibold text-rose-300 uppercase tracking-wider text-[11px] shrink-0">
                Announcement:
              </span>
              <p className="truncate text-neutral-100 font-medium">
                {broadcast.message || 'No message provided'}
              </p>
            </div>
            <span className="text-neutral-400 p-1 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="p-4 text-center text-xs text-neutral-600 font-mono">
            [ Legit Movies Webpage Content Area ]
          </div>
        </div>
      </div>
    </div>
  );
};
