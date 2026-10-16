export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  name?: string; // For TV series
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  media_type?: 'movie' | 'tv';
  tagline?: string;
  status?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface StreamServer {
  id: string;
  name: string;
  badge: string;
  quality: string;
  getUrl: (id: number, type?: 'movie' | 'tv', season?: number, episode?: number) => string;
}
