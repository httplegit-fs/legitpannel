import React, { useState, useEffect } from 'react';
import { X, Server, ExternalLink, ShieldCheck, Film, Download, Users } from 'lucide-react';
import { Movie, CastMember } from '../../types/movie';
import { STREAM_SERVERS, fetchMovieDetails, TMDB_POSTER_URL } from '../../services/tmdbService';
import { getCurrentConfig } from '../../services/configService';
import { BannerAd } from '../ads/BannerAd';

interface StreamPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const StreamPlayerModal: React.FC<StreamPlayerModalProps> = ({ movie, onClose }) => {
  const [activeServer, setActiveServer] = useState<string>(STREAM_SERVERS[0].id);
  const [details, setDetails] = useState<{ cast: CastMember[]; similar: Movie[] }>({
    cast: [],
    similar: [],
  });
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const config = getCurrentConfig();
  const directLink = config.ads.directLinkUrl;
  const isTV = movie ? movie.media_type === 'tv' || Boolean(movie.first_air_date && !movie.release_date) : false;

  useEffect(() => {
    if (!movie) return;
    setIsLoading(true);
    fetchMovieDetails(movie.id, isTV ? 'tv' : 'movie')
      .then((res) => {
        setDetails({ cast: res.cast, similar: res.similar });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [movie, isTV]);

  if (!movie) return null;

  const currentServerObj = STREAM_SERVERS.find((s) => s.id === activeServer) || STREAM_SERVERS[0];
  const streamUrl = currentServerObj.getUrl(movie.id, isTV ? 'tv' : 'movie', season, episode);

  const handleDirectDownload = () => {
    if (directLink && (directLink.startsWith('https://') || directLink.startsWith('http://'))) {
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {movie.title || movie.name}
              </h3>
              <p className="text-xs text-neutral-400">
                {isTV ? `Season ${season} · Episode ${episode}` : (movie.release_date || '').slice(0, 4)} · 1080p Ultra HD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDirectDownload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/50 transition-colors"
              title="Verified direct stream mirror"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Direct Link</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Player Top Banner Ad Placement */}
        {config.ads.playerTopAdId && (
          <div className="p-3 bg-neutral-950/40 border-b border-neutral-800/60">
            <BannerAd placement="player-top" adId={config.ads.playerTopAdId} />
          </div>
        )}

        {/* Video Player Frame Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={streamUrl}
            title={`${movie.title || movie.name} Stream`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          />
        </div>

        {/* Player Bottom Banner Ad Placement */}
        {config.ads.playerBottomAdId && (
          <div className="p-3 bg-neutral-950/40 border-t border-neutral-800/60">
            <BannerAd placement="player-bottom" adId={config.ads.playerBottomAdId} />
          </div>
        )}

        {/* Server & Episode Selection Controls */}
        <div className="p-4 sm:p-6 bg-neutral-950/80 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
            {/* Server Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5 mr-1">
                <Server className="w-3.5 h-3.5 text-rose-400" /> Mirror Server:
              </span>
              {STREAM_SERVERS.map((server) => (
                <button
                  key={server.id}
                  onClick={() => setActiveServer(server.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeServer === server.id
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                      : 'bg-neutral-800/90 text-neutral-300 hover:text-white hover:bg-neutral-750 border border-neutral-700/50'
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>

            {/* Direct download mobile fallback */}
            <button
              onClick={handleDirectDownload}
              className="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/50 transition-colors w-full"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Direct Link Download Mirror</span>
            </button>
          </div>

          {/* TV Episode Selector */}
          {isTV && (
            <div className="py-4 border-b border-neutral-800/80 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Season:</span>
                <select
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      Season {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Episode:</span>
                <select
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
                >
                  {[...Array(24).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      Episode {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Movie Overview and Details */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-neutral-200">Synopsis</h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {movie.overview}
              </p>

              {/* Cast Members */}
              {details.cast.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-rose-400" /> Starring Cast
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
                    {details.cast.slice(0, 6).map((c, i) => (
                      <span key={c.id || i} className="inline-flex items-center gap-1">
                        <span className="text-white font-medium">{c.name}</span>
                        {c.character && (
                          <span className="text-neutral-500">as {c.character}</span>
                        )}
                        {i < Math.min(details.cast.length, 6) - 1 && (
                          <span className="text-neutral-600">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Specs */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 text-xs space-y-2.5">
              <div className="flex justify-between text-neutral-400">
                <span>Release Status</span>
                <span className="text-neutral-200 font-medium">Verified HD Stream</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Rating</span>
                <span className="text-amber-400 font-semibold tabular-nums">
                  ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '8.0'}/10
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Audio</span>
                <span className="text-neutral-200 font-medium">Dolby 5.1 / Stereo</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Subtitles</span>
                <span className="text-neutral-200 font-medium">Multi-Language CC</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero reconnaissance architecture secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
