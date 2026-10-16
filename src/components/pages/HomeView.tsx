import React, { useEffect, useState } from 'react';
import { Movie } from '../../types/movie';
import {
  fetchTrendingMovies,
  fetchPopularSeries,
  fetchTopRatedMovies,
  fetchActionMovies,
  fetchSciFiMovies,
  searchMovies,
  FALLBACK_MOVIES,
} from '../../services/tmdbService';
import { HeroSection } from '../movie/HeroSection';
import { MovieRow } from '../movie/MovieRow';
import { MovieCard } from '../movie/MovieCard';
import { BannerAd } from '../ads/BannerAd';
import { SiteConfig } from '../../types/config';
import { Film } from 'lucide-react';

interface HomeViewProps {
  config: SiteConfig;
  activeTab: string;
  searchQuery: string;
  onPlayMovie: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  config,
  activeTab,
  searchQuery,
  onPlayMovie,
  onMoreInfo,
}) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<Movie>(FALLBACK_MOVIES[0]);

  // Load catalogs on mount or when TMDB key updates
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchTrendingMovies(),
      fetchPopularSeries(),
      fetchTopRatedMovies(),
      fetchActionMovies(),
      fetchSciFiMovies(),
    ]).then(([trend, ser, top, act, sci]) => {
      if (!isMounted) return;
      if (trend.length > 0) {
        setTrending(trend);
        setFeaturedMovie(trend[0]);
      }
      if (ser.length > 0) setSeries(ser);
      if (top.length > 0) setTopRated(top);
      if (act.length > 0) setActionMovies(act);
      if (sci.length > 0) setSciFiMovies(sci);
    });

    return () => {
      isMounted = false;
    };
  }, [config.tmdb.apiKey]);

  // Handle live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchMovies(searchQuery)
        .then((res) => {
          setSearchResults(res);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, config.tmdb.apiKey]);

  // If user searched for something, show search grid
  if (searchQuery.trim()) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-neutral-900">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Search Results for <span className="text-rose-400">"{searchQuery}"</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Found {searchResults.length} matching movies and series
            </p>
          </div>
        </div>

        {isSearching ? (
          <div className="py-20 text-center text-sm text-neutral-500 flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            Searching cinematic database...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((m) => (
              <MovieCard key={m.id} movie={m} onSelect={onPlayMovie} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-400" />
            <p className="text-sm">No titles matched your search.</p>
            <p className="text-xs text-neutral-600 mt-1">Try another movie title, actor, or genre.</p>
          </div>
        )}
      </main>
    );
  }

  // Filter based on activeTab
  if (activeTab === 'movies') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">All Movies Catalog</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...trending, ...topRated, ...actionMovies]
            .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
            .map((m) => (
              <MovieCard key={m.id} movie={m} onSelect={onPlayMovie} />
            ))}
        </div>
      </main>
    );
  }

  if (activeTab === 'series') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Popular TV Shows & Series</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {series.map((m) => (
            <MovieCard key={m.id} movie={m} onSelect={onPlayMovie} />
          ))}
        </div>
      </main>
    );
  }

  if (activeTab === 'top_rated') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Top Rated Masterpieces</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {topRated.map((m) => (
            <MovieCard key={m.id} movie={m} onSelect={onPlayMovie} />
          ))}
        </div>
      </main>
    );
  }

  if (activeTab === 'action') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Action & Sci-Fi Universe</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...actionMovies, ...sciFiMovies]
            .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
            .map((m) => (
              <MovieCard key={m.id} movie={m} onSelect={onPlayMovie} />
            ))}
        </div>
      </main>
    );
  }

  // Default Featured Home Feed
  return (
    <main>
      {/* 1. Dominant Visual Anchor: Hero Section */}
      <HeroSection
        movie={featuredMovie}
        onPlay={onPlayMovie}
        onMoreInfo={onMoreInfo}
      />

      {/* 2. Header Banner Ad Slot */}
      {config.ads.headerBannerId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
          <BannerAd placement="header" adId={config.ads.headerBannerId} />
        </div>
      )}

      {/* 3. Movie Rows with In-Feed Ads */}
      <div className="max-w-7xl mx-auto">
        <MovieRow
          title="Trending This Week"
          subtitle="Most watched blockbusters across all verified servers"
          movies={trending}
          onSelectMovie={onPlayMovie}
          showAd={true}
          adId={config.ads.nativeInFeedAdId}
        />

        <MovieRow
          title="Binge-Worthy TV Series"
          subtitle="Top trending multi-season productions"
          movies={series}
          onSelectMovie={onPlayMovie}
        />

        {/* Mid-feed sponsor banner */}
        {config.ads.sidebarAdId && (
          <div className="px-4 sm:px-6 my-6">
            <BannerAd placement="footer" adId={config.ads.sidebarAdId} />
          </div>
        )}

        <MovieRow
          title="Top Rated Classics & Hits"
          subtitle="Critically acclaimed cinema rated 8.0+"
          movies={topRated}
          onSelectMovie={onPlayMovie}
          showAd={true}
          adId={config.ads.nativeInFeedAdId}
        />

        <MovieRow
          title="Sci-Fi & Cyberpunk Worlds"
          subtitle="Dystopian futures, interstellar exploration, and technological thrills"
          movies={sciFiMovies}
          onSelectMovie={onPlayMovie}
        />

        <MovieRow
          title="High-Octane Action & Adventure"
          subtitle="Explosive stunts, pulse-pounding missions, and superhero epics"
          movies={actionMovies}
          onSelectMovie={onPlayMovie}
        />
      </div>

      {/* 4. Footer Banner Ad Slot */}
      {config.ads.footerBannerId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
          <BannerAd placement="footer" adId={config.ads.footerBannerId} />
        </div>
      )}
    </main>
  );
};
