import { Movie, CastMember, VideoTrailer, StreamServer } from '../types/movie';
import { getCurrentConfig } from './configService';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const TMDB_POSTER_URL = (path: string | null, size: 'w342' | 'w500' | 'original' = 'w500') =>
  path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '';

export const TMDB_BACKDROP_URL = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original') =>
  path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '';

// Built-in curated backup catalog for instant zero-latency loading and offline resilience
export const FALLBACK_MOVIES: Movie[] = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520fr.jpg',
    release_date: '2024-02-27',
    vote_average: 8.2,
    vote_count: 5410,
    popularity: 980.5,
    media_type: 'movie',
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    runtime: 166,
    tagline: 'Long live the fighters.',
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, examining the scientific breakthroughs and profound moral dilemmas.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 8900,
    popularity: 640.2,
    media_type: 'movie',
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    runtime: 180,
    tagline: 'The world forever changes.',
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    release_date: '2023-05-31',
    vote_average: 8.4,
    vote_count: 6700,
    popularity: 512.4,
    media_type: 'movie',
    genres: [{ id: 16, name: 'Animation' }, { id: 28, name: 'Action' }],
    runtime: 140,
    tagline: 'It’s how you wear the mask that matters.',
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 35000,
    popularity: 420.1,
    media_type: 'movie',
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 169,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
  },
  {
    id: 414906,
    title: 'The Batman',
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop_path: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    release_date: '2022-03-01',
    vote_average: 7.7,
    vote_count: 9800,
    popularity: 380.0,
    media_type: 'movie',
    genres: [{ id: 80, name: 'Crime' }, { id: 9648, name: 'Mystery' }, { id: 28, name: 'Action' }],
    runtime: 176,
    tagline: 'Unmask the truth.',
  },
  {
    id: 93405,
    title: 'Squid Game',
    name: 'Squid Game',
    overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
    poster_path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    backdrop_path: '/2meX1nMdScFOoV4370rqHWFDxZ6.jpg',
    first_air_date: '2021-09-17',
    vote_average: 7.8,
    vote_count: 14200,
    popularity: 490.8,
    media_type: 'tv',
    genres: [{ id: 10759, name: 'Action & Adventure' }, { id: 9648, name: 'Mystery' }, { id: 18, name: 'Drama' }],
    tagline: '45.6 Billion is Child\'s Play.',
  },
  {
    id: 60059,
    title: 'Better Call Saul',
    name: 'Better Call Saul',
    overview: 'Six years before he begins to represent Walter White, ambitious small-time lawyer Jimmy McGill hustles to build a legitimate career while facing severe moral conflicts.',
    poster_path: '/fC2HDm5t0kHsf7YGoE7vD0z1N8.jpg',
    backdrop_path: '/hPea3Qy5Gd6z4GGoR4qOBVp8v0w.jpg',
    first_air_date: '2015-02-08',
    vote_average: 8.7,
    vote_count: 5300,
    popularity: 310.4,
    media_type: 'tv',
    genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    tagline: 'Jimmy McGill is a lawyer you can trust.',
  },
  {
    id: 119051,
    title: 'Wednesday',
    name: 'Wednesday',
    overview: 'A sleuthing, supernaturally infused mystery charting Wednesday Addams\' years as a student at Nevermore Academy.',
    poster_path: '/9PFonQ9cc0HQda72CU40R8x0afn.jpg',
    backdrop_path: '/iHSwvFe7FdFFRmEN09y979WKWur.jpg',
    first_air_date: '2022-11-23',
    vote_average: 8.5,
    vote_count: 8400,
    popularity: 430.7,
    media_type: 'tv',
    genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 9648, name: 'Mystery' }],
    tagline: 'Smart, sarcastic and a little dead inside.',
  },
];

// Verified high-speed streaming embed sources
export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'server-vip',
    name: 'Server 1: VIP HD Direct',
    badge: 'Ultra Fast',
    quality: '1080p / 4K',
    getUrl: (id: number, type = 'movie', season = 1, episode = 1) =>
      type === 'tv'
        ? `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.cc/v2/embed/movie/${id}`,
  },
  {
    id: 'server-mirror',
    name: 'Server 2: MultiEmbed Cloud',
    badge: 'Reliable Mirror',
    quality: 'HD 1080p',
    getUrl: (id: number, type = 'movie', season = 1, episode = 1) =>
      type === 'tv'
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
  {
    id: 'server-vidsrc-xyz',
    name: 'Server 3: Fast CDN Stream',
    badge: 'Zero Buffer',
    quality: 'Auto / 1080p',
    getUrl: (id: number, type = 'movie', season = 1, episode = 1) =>
      type === 'tv'
        ? `https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}`
        : `https://vidsrc.xyz/embed/movie/${id}`,
  },
];

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const config = getCurrentConfig();
  const apiKey = config.tmdb.apiKey || '9a846efff59a26bc6ebb68286af2aeb8';

  const query = new URLSearchParams({
    api_key: apiKey,
    ...params,
  }).toString();

  const url = `https://api.themoviedb.org/3${endpoint}?${query}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok) {
    throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  try {
    const data = await tmdbFetch('/trending/movie/week');
    if (data && data.results && data.results.length > 0) {
      return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
    }
  } catch (err) {
    console.warn('TMDB trending movies error, using curated backup:', err);
  }
  return FALLBACK_MOVIES.filter((m) => m.media_type === 'movie');
}

export async function fetchPopularSeries(): Promise<Movie[]> {
  try {
    const data = await tmdbFetch('/tv/popular');
    if (data && data.results && data.results.length > 0) {
      return data.results.map((tv: any) => ({
        ...tv,
        title: tv.name,
        media_type: 'tv',
      }));
    }
  } catch (err) {
    console.warn('TMDB series error, using curated backup:', err);
  }
  return FALLBACK_MOVIES.filter((m) => m.media_type === 'tv');
}

export async function fetchTopRatedMovies(): Promise<Movie[]> {
  try {
    const data = await tmdbFetch('/movie/top_rated');
    if (data && data.results && data.results.length > 0) {
      return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
    }
  } catch (err) {
    console.warn('TMDB top rated error, using curated backup:', err);
  }
  return FALLBACK_MOVIES;
}

export async function fetchActionMovies(): Promise<Movie[]> {
  try {
    const data = await tmdbFetch('/discover/movie', {
      with_genres: '28',
      sort_by: 'popularity.desc',
    });
    if (data && data.results && data.results.length > 0) {
      return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
    }
  } catch (err) {
    console.warn('TMDB action movies fetch error:', err);
  }
  return FALLBACK_MOVIES.filter((m) => m.id === 569094 || m.id === 414906 || m.id === 693134);
}

export async function fetchSciFiMovies(): Promise<Movie[]> {
  try {
    const data = await tmdbFetch('/discover/movie', {
      with_genres: '878',
      sort_by: 'popularity.desc',
    });
    if (data && data.results && data.results.length > 0) {
      return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
    }
  } catch (err) {
    console.warn('TMDB sci-fi movies fetch error:', err);
  }
  return FALLBACK_MOVIES.filter((m) => m.id === 693134 || m.id === 157336);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  try {
    const data = await tmdbFetch('/search/multi', {
      query: query.trim(),
      include_adult: 'false',
    });
    if (data && data.results) {
      return data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => ({
          ...item,
          title: item.title || item.name,
        }));
    }
  } catch (err) {
    console.warn('TMDB search error:', err);
  }
  // Client-side fallback search
  const q = query.toLowerCase();
  return FALLBACK_MOVIES.filter((m) => (m.title || m.name || '').toLowerCase().includes(q));
}

export async function fetchMovieDetails(id: number, type: 'movie' | 'tv' = 'movie'): Promise<{
  movie: Movie;
  cast: CastMember[];
  trailer: VideoTrailer | null;
  similar: Movie[];
}> {
  try {
    const endpoint = type === 'tv' ? `/tv/${id}` : `/movie/${id}`;
    const data = await tmdbFetch(endpoint, {
      append_to_response: 'credits,videos,similar',
    });

    const movie: Movie = {
      ...data,
      title: data.title || data.name,
      media_type: type,
    };

    const cast: CastMember[] = (data.credits?.cast || []).slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    }));

    const videos: any[] = data.videos?.results || [];
    const ytTrailer = videos.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || videos[0];

    const trailer: VideoTrailer | null = ytTrailer
      ? {
          id: ytTrailer.id,
          key: ytTrailer.key,
          name: ytTrailer.name,
          site: ytTrailer.site,
          type: ytTrailer.type,
        }
      : null;

    const similar: Movie[] = (data.similar?.results || []).slice(0, 8).map((m: any) => ({
      ...m,
      title: m.title || m.name,
      media_type: type,
    }));

    return { movie, cast, trailer, similar };
  } catch (err) {
    console.warn(`TMDB details error for id ${id}:`, err);
    const found = FALLBACK_MOVIES.find((m) => m.id === id) || FALLBACK_MOVIES[0];
    return {
      movie: found,
      cast: [
        { id: 1, name: 'Lead Performer', character: 'Protagonist', profile_path: null },
        { id: 2, name: 'Co-Star', character: 'Antagonist', profile_path: null },
      ],
      trailer: null,
      similar: FALLBACK_MOVIES.filter((m) => m.id !== id).slice(0, 6),
    };
  }
}
