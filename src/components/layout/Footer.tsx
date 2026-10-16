import React from 'react';
import { Film, ShieldCheck, Server, RefreshCw } from 'lucide-react';
import { SyncDiagnostics, SiteConfig } from '../../types/config';

interface FooterProps {
  config: SiteConfig;
  diagnostics: SyncDiagnostics;
  onOpenArchitecture: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, diagnostics, onOpenArchitecture }) => {
  return (
    <footer className="mt-20 border-t border-neutral-900 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
                <Film className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">
                {config.siteName || 'Legit Movies'}
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-md">
              High-speed cinematic discovery and multi-mirror streaming aggregator. Built with zero-reconnaissance protection, automatic remote configuration failover, and strict anti-tamper security.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
            </div>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-2">
            <h4 className="text-neutral-200 font-semibold text-xs uppercase tracking-wider">
              Compliance & Security
            </h4>
            <ul className="space-y-1.5 text-neutral-400 text-xs">
              <li>DMCA Copyright Disclaimer</li>
              <li>Terms of Service</li>
              <li>Privacy & Cookie Hardening</li>
              <li>Anti-Tamper Input Validation</li>
            </ul>
          </div>

          {/* Remote Architecture Connection Status */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-200 font-semibold text-xs uppercase tracking-wider">
              Remote Connection
            </h4>
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">Endpoint:</span>
                <span className="text-[11px] font-mono text-neutral-200 truncate max-w-[120px]" title={diagnostics.activeEndpoint}>
                  {diagnostics.source === 'local-fallback' ? 'Local Fallback' : 'legitpannel.onrender.com'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">Status:</span>
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                  diagnostics.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {diagnostics.status === 'connected' ? 'Synced & Locked' : 'Failover Active'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">Sync Cycle:</span>
                <span className="text-[11px] font-mono text-neutral-300 tabular-nums">
                  Every 30s ({diagnostics.nextSyncSeconds}s left)
                </span>
              </div>

              <button
                onClick={onOpenArchitecture}
                className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white rounded-lg border border-neutral-700/60 text-[11px] font-medium transition-colors"
              >
                <Server className="w-3 h-3 text-rose-400" />
                <span>Architecture & Server Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} {config.siteName || 'Legit Movies'}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenArchitecture}
              className="text-neutral-400 hover:text-rose-400 transition-colors"
            >
              Remote Admin Guide & Setup
            </button>
            <span>·</span>
            <span>Zero Hidden Routes Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
