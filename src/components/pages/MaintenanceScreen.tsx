import React, { useEffect, useState } from 'react';
import { Wrench, RefreshCw, Clock } from 'lucide-react';
import { MaintenanceConfig } from '../../types/config';
import { syncRemoteConfig } from '../../services/configService';

interface MaintenanceScreenProps {
  maintenance: MaintenanceConfig;
  siteName: string;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ maintenance, siteName }) => {
  const [recheckCountdown, setRecheckCountdown] = useState(15);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRecheckCountdown((prev) => {
        if (prev <= 1) {
          handleManualRecheck();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRecheck = async () => {
    setIsChecking(true);
    try {
      await syncRemoteConfig();
    } finally {
      setIsChecking(false);
      setRecheckCountdown(15);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-xl shadow-rose-950/30">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3">
          <span>{siteName || 'Legit Movies'}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>System Maintenance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 text-balance">
          Upgrading Streaming Infrastructure
        </h1>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 mb-6 text-sm text-neutral-300 leading-relaxed shadow-lg">
          {maintenance.message ||
            'We are currently performing scheduled maintenance and server upgrades. We will be back online shortly!'}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>
              Auto-checking remote status in <span className="text-white font-mono font-bold tabular-nums">{recheckCountdown}s</span>
            </span>
          </div>

          <button
            onClick={handleManualRecheck}
            disabled={isChecking}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Status Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
