import React, { useState } from 'react';
import { Play, Star, Film } from 'lucide-react';
import { Movie } from '../../types/movie';
import { TMDB_POSTER_URL } from '../../services/tmdbService';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const posterUrl = TMDB_POSTER_URL(movie.poster_path, 'w500');
  const releaseYear = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const isTV = movie.media_type === 'tv' || Boolean(movie.first_air_date && !movie.release_date);

  return (
    <div
      onClick={() => onSelect(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(movie)}
      className="group relative flex flex-col rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
    >
      {/* Poster Media Box with 2:3 aspect ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 group-hover:border-neutral-700 transition-colors">
        {!imgError && posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title || movie.name || 'Movie poster'}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Zero-broken-image CSS fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-400">
            <Film className="w-10 h-10 mb-2 opacity-40 text-rose-500" />
            <span className="text-xs font-medium text-center line-clamp-2 text-neutral-300">
              {movie.title || movie.name}
            </span>
          </div>
        )}

        {/* Hover overlay with quick play icon */}
        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-950/80 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content - Clean Unboxed Metadata (Zero-Pill discipline) */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-semibold text-neutral-200 group-hover:text-rose-400 transition-colors line-clamp-1">
          {movie.title || movie.name}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <span>{releaseYear || 'HD'}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{isTV ? 'TV Series' : 'Movie'}</span>
          {rating && (
            <>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium tabular-nums">
                <Star className="w-3 h-3 fill-amber-400" /> {rating}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
