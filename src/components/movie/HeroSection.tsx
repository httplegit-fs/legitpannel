import React from 'react';
import { Play, Download, Star, Info } from 'lucide-react';
import { Movie } from '../../types/movie';
import { TMDB_BACKDROP_URL } from '../../services/tmdbService';
import { getCurrentConfig } from '../../services/configService';

interface HeroSectionProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movie, onPlay, onMoreInfo }) => {
  const config = getCurrentConfig();
  const backdropUrl = TMDB_BACKDROP_URL(movie.backdrop_path, 'w1280');
  const releaseYear = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '8.2';

  const handleDirectDownload = () => {
    const directLink = config.ads.directLinkUrl;
    if (directLink && (directLink.startsWith('https://') || directLink.startsWith('http://'))) {
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] md:h-[620px] overflow-hidden select-none bg-neutral-950">
      {/* Background Image with Fallback and Measured Gradient Scrim */}
      <div className="absolute inset-0">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover object-top opacity-60 sm:opacity-75 transition-opacity"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 opacity-80" />
        )}

        {/* 3-directional scrim to guarantee WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-2xl">
          {/* Metadata Bar - Zero Pill Rule */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 mb-2 font-medium">
            <span className="text-rose-400 font-semibold tracking-wide uppercase text-xs">
              {movie.media_type === 'tv' ? 'Featured Series' : 'Trending Premiere'}
            </span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{releaseYear || '2024'}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating}
            </span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span className="text-neutral-300">4K Ultra HD</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white text-balance drop-shadow-md">
            {movie.title || movie.name}
          </h1>

          {/* Tagline / Overview */}
          {movie.tagline && (
            <p className="text-xs sm:text-sm text-rose-300/90 font-medium italic mt-2">
              "{movie.tagline}"
            </p>
          )}

          <p className="mt-3 text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed drop-shadow">
            {movie.overview}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-500 active:bg-rose-700 shadow-xl shadow-rose-950/60 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Stream in HD</span>
            </button>

            <button
              onClick={handleDirectDownload}
              className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-200 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl hover:text-white transition-all hover:scale-[1.02]"
              title="Fast verified direct mirror"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Direct Link Mirror</span>
            </button>

            <button
              onClick={() => onMoreInfo(movie)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-xl transition-all"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
