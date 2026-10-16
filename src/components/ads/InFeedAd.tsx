import React from 'react';
import { Sparkles, DownloadCloud, ExternalLink } from 'lucide-react';
import { getCurrentConfig } from '../../services/configService';

interface InFeedAdProps {
  adId: string;
}

export const InFeedAd: React.FC<InFeedAdProps> = ({ adId }) => {
  const config = getCurrentConfig();
  const directLink = config.ads.directLinkUrl;

  const handleClick = () => {
    if (directLink && (directLink.startsWith('https://') || directLink.startsWith('http://'))) {
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer min-w-[200px] w-full aspect-[2/3]"
    >
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Sponsored</span>
        <span className="font-mono text-[10px] text-neutral-500">{adId ? adId.slice(0, 6) : 'FEED'}</span>
      </div>

      <div className="my-auto flex flex-col items-center text-center px-2">
        <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-105 transition-transform">
          <DownloadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white line-clamp-2">
          Ultra Fast Direct Cloud Download
        </h4>
        <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
          High-bandwidth mirror server with zero wait time and unlimited parallel chunks.
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
        <span className="text-neutral-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> 4K Stream
        </span>
        <span className="text-rose-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Direct Link <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
