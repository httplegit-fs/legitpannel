import React, { useState } from 'react';
import { Radio, X } from 'lucide-react';
import { BroadcastConfig } from '../../types/config';

interface BroadcastBannerProps {
  broadcast: BroadcastConfig;
}

export const BroadcastBanner: React.FC<BroadcastBannerProps> = ({ broadcast }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!broadcast.enabled || !broadcast.message || dismissed) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-rose-950/90 via-neutral-900 to-rose-950/90 border-b border-rose-900/40 text-neutral-200 px-4 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center justify-center w-5 h-5 rounded-md bg-rose-600/30 text-rose-400 shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <span className="font-semibold text-rose-300 uppercase tracking-wider text-[11px] shrink-0">
            Announcement:
          </span>
          <p className="truncate text-neutral-100 font-medium">
            {broadcast.message}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-neutral-400 hover:text-white p-1 shrink-0 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
