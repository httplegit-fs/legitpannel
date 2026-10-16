import React, { useState } from 'react';
import { DollarSign, ShieldCheck, ExternalLink, AlertCircle, CheckCircle2, Code2 } from 'lucide-react';
import { AdsConfig } from '../../../types/admin';

interface AdsTabProps {
  ads: AdsConfig;
  onChange: (updated: AdsConfig) => void;
}

export const AdsTab: React.FC<AdsTabProps> = ({ ads, onChange }) => {
  const [activeCategory, setActiveCategory] = useState<'banners' | 'player' | 'direct_script'>('banners');

  const isHexValid = (id: string) => /^[a-fA-F0-9]{16,64}$/.test(id.trim());
  const isUrlValid = (url: string) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url.trim());

  const handleTestDirectLink = () => {
    if (ads.directLinkUrl && isUrlValid(ads.directLinkUrl)) {
      window.open(ads.directLinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Advertising & Monetization Network Configuration
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl mt-1">
              Configure banner tags, player slots, native in-feed units, direct download mirrors, and sandboxed ad scripts. All inputs undergo strict alphanumeric hex validation and HTML/script injection sanitization.
            </p>
          </div>
        </div>
      </div>

      {/* Subcategory Navigation */}
      <div className="flex border-b border-neutral-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveCategory('banners')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeCategory === 'banners'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Display Banners & Feed Units
        </button>
        <button
          onClick={() => setActiveCategory('player')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeCategory === 'player'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Video Player Ad Units
        </button>
        <button
          onClick={() => setActiveCategory('direct_script')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeCategory === 'direct_script'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Direct Links & Sandboxed Scripts
        </button>
      </div>

      {/* Section 1: Display Banners & Feed Units */}
      {activeCategory === 'banners' && (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Header Top Banner Ad ID</label>
              <span className={`text-[10px] font-mono font-bold ${isHexValid(ads.headerBannerId) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHexValid(ads.headerBannerId) ? 'Valid Hex Code' : 'Invalid Format'}
              </span>
            </div>
            <input
              type="text"
              value={ads.headerBannerId}
              onChange={(e) => onChange({ ...ads, headerBannerId: e.target.value.trim() })}
              placeholder="e.g. c9cf205fea000976d8c500911e2b0221"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500">
              Displayed prominently below the hero section on the main movie catalog.
            </p>
          </div>

          {/* Footer Banner */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Footer Banner Ad ID</label>
              <span className={`text-[10px] font-mono font-bold ${isHexValid(ads.footerBannerId) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHexValid(ads.footerBannerId) ? 'Valid Hex Code' : 'Invalid Format'}
              </span>
            </div>
            <input
              type="text"
              value={ads.footerBannerId}
              onChange={(e) => onChange({ ...ads, footerBannerId: e.target.value.trim() })}
              placeholder="e.g. c9cf205fea000976d8c500911e2b0221"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500">
              Placed directly above the global footer links.
            </p>
          </div>

          {/* Native In-Feed Ad */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Native In-Feed Ad ID</label>
              <span className={`text-[10px] font-mono font-bold ${isHexValid(ads.nativeInFeedAdId) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHexValid(ads.nativeInFeedAdId) ? 'Valid Hex Code' : 'Invalid Format'}
              </span>
            </div>
            <input
              type="text"
              value={ads.nativeInFeedAdId}
              onChange={(e) => onChange({ ...ads, nativeInFeedAdId: e.target.value.trim() })}
              placeholder="e.g. ff02012e1215699d9ae3de05f90398ec"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500">
              Interspersed naturally as promotional cards between movie titles in carousels.
            </p>
          </div>

          {/* Sidebar Ad */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Sidebar / Mid-Feed Ad ID</label>
              <span className={`text-[10px] font-mono font-bold ${isHexValid(ads.sidebarAdId) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHexValid(ads.sidebarAdId) ? 'Valid Hex Code' : 'Invalid Format'}
              </span>
            </div>
            <input
              type="text"
              value={ads.sidebarAdId}
              onChange={(e) => onChange({ ...ads, sidebarAdId: e.target.value.trim() })}
              placeholder="e.g. e497f90baf5dc8f1b9bd0fdc0c5b9613"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Section 2: Player Ad Units */}
      {activeCategory === 'player' && (
        <div className="space-y-4">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Player Top Ad ID</label>
              <span className={`text-[10px] font-mono font-bold ${isHexValid(ads.playerTopAdId) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHexValid(ads.playerTopAdId) ? 'Valid Hex Code' : 'Invalid Format'}
              </span>
            </div>
            <input
              type="text"
              value={ads.playerTopAdId}
              onChange={(e) => onChange({ ...ads, playerTopAdId: e.target.value.trim() })}
              placeholder="e.g. 14c52f7b9071dd9a9b839917e51bdcb1"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500">
              Appears directly above the embedded video player iframe during playback.
            </p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Player Bottom Ad ID</label>
              <span className={`text-[10px] font-mono font-bold ${isHexValid(ads.playerBottomAdId) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHexValid(ads.playerBottomAdId) ? 'Valid Hex Code' : 'Invalid Format'}
              </span>
            </div>
            <input
              type="text"
              value={ads.playerBottomAdId}
              onChange={(e) => onChange({ ...ads, playerBottomAdId: e.target.value.trim() })}
              placeholder="e.g. a93371a702be78576721f5adc2c2309a"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500">
              Appears right below the video player before server mirror buttons.
            </p>
          </div>
        </div>
      )}

      {/* Section 3: Direct Link & Sandboxed Scripts */}
      {activeCategory === 'direct_script' && (
        <div className="space-y-4">
          {/* Direct Link URL */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Direct Link URL (Fast Mirror)</label>
              <span className={`text-[10px] font-mono font-bold ${isUrlValid(ads.directLinkUrl) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUrlValid(ads.directLinkUrl) ? 'Valid HTTPS URL' : 'Invalid URL'}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={ads.directLinkUrl}
                onChange={(e) => onChange({ ...ads, directLinkUrl: e.target.value.trim() })}
                placeholder="https://directyp.org/4/..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 pr-24 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleTestDirectLink}
                disabled={!isUrlValid(ads.directLinkUrl)}
                className="absolute inset-y-1.5 right-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Strictly verified to begin with https:// or http://. Dangerous schemes (javascript:, data:) are blocked.
            </p>
          </div>

          {/* Social Bar Script */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Social Bar Script Tag
              </label>
              <span className="text-[10px] text-neutral-400">Sandboxed Execution</span>
            </div>
            <textarea
              rows={2}
              value={ads.socialBarScript}
              onChange={(e) => onChange({ ...ads, socialBarScript: e.target.value })}
              placeholder='<script data-cfasync="false" src="https://..."></script>'
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
            <p className="text-[11px] text-neutral-500">
              Only authorized external https:// scripts are injected. Inline JavaScript execution is stripped.
            </p>
          </div>

          {/* Popunder Script */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Popunder Script Tag
              </label>
              <span className="text-[10px] text-neutral-400">Sandboxed Execution</span>
            </div>
            <textarea
              rows={2}
              value={ads.popunderScript}
              onChange={(e) => onChange({ ...ads, popunderScript: e.target.value })}
              placeholder='<script data-cfasync="false" src="https://..."></script>'
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
