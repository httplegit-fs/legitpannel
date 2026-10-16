import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { getCurrentConfig } from '../../services/configService';

interface BannerAdProps {
  placement: 'header' | 'footer' | 'sidebar' | 'player-top' | 'player-bottom';
  adId: string;
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ placement, adId, className = '' }) => {
  const config = getCurrentConfig();
  const directLink = config.ads.directLinkUrl;

  const handleClick = () => {
    if (directLink && (directLink.startsWith('https://') || directLink.startsWith('http://'))) {
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getDimensions = () => {
    switch (placement) {
      case 'header':
      case 'footer':
        return 'w-full max-w-5xl h-20 md:h-24';
      case 'player-top':
      case 'player-bottom':
        return 'w-full h-16 md:h-20';
      case 'sidebar':
        return 'w-full h-64';
    }
  };

  const getLabel = () => {
    switch (placement) {
      case 'header':
        return 'Sponsored Banner — High Speed Stream Mirror';
      case 'footer':
        return 'Partner Network Promotion';
      case 'player-top':
        return 'Ultra 4K Stream Booster Ad';
      case 'player-bottom':
        return 'Recommended Fast Download Host';
      case 'sidebar':
        return 'Featured Sponsor';
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`relative mx-auto rounded-xl overflow-hidden cursor-pointer border border-neutral-800/80 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 hover:border-neutral-700 transition-all group ${getDimensions()} ${className}`}
      title="Click to visit verified sponsor"
    >
      <div className="absolute inset-0 bg-radial from-rose-500/5 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="relative h-full flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center text-rose-400 group-hover:text-rose-300 transition-colors shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">
                AD · Unit {adId ? adId.slice(0, 8) : 'ACTIVE'}
              </span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-emerald-400 font-medium">Verified Fast CDN</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors line-clamp-1">
              {getLabel()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 bg-neutral-800/70 border border-neutral-700/40 rounded-lg px-3 py-1.5 group-hover:bg-rose-950/40 group-hover:border-rose-700/50 group-hover:text-rose-200 transition-all shrink-0">
          <span className="hidden sm:inline">Access Mirror</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
