import React, { useState } from 'react';
import { Film, Search, X, Zap } from 'lucide-react';
import { getCurrentConfig } from '../../services/configService';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenArchitecture,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const config = getCurrentConfig();

  const handleDirectStream = () => {
    const url = config.ads.directLinkUrl;
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 border-b border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectTab('featured');
            onSearchChange('');
          }}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
            {config.siteName || 'Legit Movies'}
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectTab('featured')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'featured' ? 'text-white font-semibold' : ''
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => onSelectTab('movies')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'movies' ? 'text-white font-semibold' : ''
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => onSelectTab('series')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'series' ? 'text-white font-semibold' : ''
            }`}
          >
            TV Series
          </button>
          <button
            onClick={() => onSelectTab('top_rated')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'top_rated' ? 'text-white font-semibold' : ''
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => onSelectTab('action')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'action' ? 'text-white font-semibold' : ''
            }`}
          >
            Action & Sci-Fi
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Integrated search toggle / input */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search movies & TV..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-48 sm:w-64 pl-9 pr-8 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="absolute right-2 text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="w-9 h-9 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleDirectStream}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-500 active:bg-rose-700 shadow-md shadow-rose-950/40 transition-colors whitespace-nowrap shrink-0"
            title="Fast direct stream server mirror"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Direct Stream</span>
            <span className="sm:hidden">Stream</span>
          </button>
        </div>
      </div>
    </header>
  );
};
