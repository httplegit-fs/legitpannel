import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { InFeedAd } from '../ads/InFeedAd';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  adId?: string;
  showAd?: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  movies,
  onSelectMovie,
  adId,
  showAd = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - offset : scrollLeft + offset,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative my-8">
      {/* Row Header */}
      <div className="flex items-end justify-between mb-3 px-4 sm:px-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Movie Carousel Container */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 overflow-x-auto px-4 sm:px-6 pb-2 no-scrollbar scroll-smooth"
      >
        {movies.map((movie, index) => (
          <React.Fragment key={`${movie.id}-${index}`}>
            <div className="w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
              <MovieCard movie={movie} onSelect={onSelectMovie} />
            </div>

            {/* Seamless in-feed native ad inserted after 3rd item */}
            {showAd && adId && index === 2 && (
              <div className="w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                <InFeedAd adId={adId} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
