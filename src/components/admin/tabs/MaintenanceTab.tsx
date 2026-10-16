import React from 'react';
import { AlertOctagon, Wrench, Clock, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { MaintenanceConfig } from '../../../types/admin';

interface MaintenanceTabProps {
  maintenance: MaintenanceConfig;
  siteName: string;
  onChange: (updated: MaintenanceConfig) => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  maintenance,
  siteName,
  onChange,
}) => {
  const presets = [
    {
      title: 'Scheduled Upgrade',
      text: 'We are currently performing scheduled maintenance and server upgrades. We will be back online shortly!',
    },
    {
      title: 'Database Scaling',
      text: 'Upgrading database storage clusters and bandwidth mirrors for faster 4K movie streaming. Check back in 15 minutes!',
    },
    {
      title: 'Security Maintenance',
      text: 'Routine security hardening and zero-reconnaissance verification in progress. All streaming services will resume soon.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Toggle Hero Box */}
      <div className={`p-6 rounded-2xl border transition-all ${
        maintenance.enabled
          ? 'bg-rose-950/40 border-rose-600/80 shadow-xl shadow-rose-950/40'
          : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              maintenance.enabled
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/80'
                : 'bg-neutral-800 text-neutral-400'
            }`}>
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Maintenance Mode (Emergency Killswitch)
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  maintenance.enabled ? 'bg-rose-600 text-white' : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                }`}>
                  {maintenance.enabled ? 'Active · Site Blocked' : 'Normal · Site Online'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                When enabled, <span className="font-mono text-neutral-200">legitmovies.onrender.com</span> immediately locks access and displays the full-screen maintenance notice. Client browsers automatically re-check every 15 seconds to resume streaming the instant you toggle this off.
              </p>
            </div>
          </div>

          <button
            onClick={() => onChange({ ...maintenance, enabled: !maintenance.enabled })}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 ${
              maintenance.enabled
                ? 'bg-neutral-100 hover:bg-white text-rose-900'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60'
            }`}
          >
            {maintenance.enabled ? 'Turn OFF Maintenance' : 'Activate Maintenance'}
          </button>
        </div>
      </div>

      {/* Message Customizer */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-rose-400" />
            Maintenance Screen Message
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            This plain-text message is displayed prominently to all visitors. Any HTML tags will be automatically stripped for anti-tamper security.
          </p>
        </div>

        <textarea
          rows={3}
          value={maintenance.message}
          onChange={(e) => onChange({ ...maintenance, message: e.target.value })}
          placeholder="Enter message for visitors..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Anti-tamper plain text sanitation enforced</span>
          <span className="font-mono tabular-nums">{maintenance.message.length} characters</span>
        </div>

        {/* Presets */}
        <div className="pt-3 border-t border-neutral-800/80">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Quick Template Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange({ ...maintenance, message: preset.text })}
                className="text-left p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition-colors group"
              >
                <div className="font-semibold text-xs text-neutral-300 group-hover:text-rose-400 flex items-center justify-between">
                  <span>{preset.title}</span>
                  <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                  {preset.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Mockup of Visitor Screen */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Live Visitor Display Preview
        </h4>

        <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-8 text-center overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 mx-auto mb-4">
            <Wrench className="w-6 h-6" />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
            <span>{siteName || 'Legit Movies'}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>System Maintenance</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Upgrading Streaming Infrastructure
          </h3>

          <div className="max-w-md mx-auto bg-neutral-900/60 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-300 mb-4">
            {maintenance.message || 'We will be back shortly.'}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>Auto-checking status in <span className="text-white font-mono font-bold">14s</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
