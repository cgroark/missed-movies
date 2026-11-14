export type MediaType = 'movie' | 'tv';

export interface movie {
  id?: number;
  movie_id: number;
  title: string;
  name?: string | null;
  media_type?: MediaType;
  release_date: string;
  first_air_date?: string | null;
  poster_path: string;
  category: number | '';
  status: number | '';
  overview: string;
  genre_ids: number[];
  user_id: string | undefined;
  rating?: number | null;
}

export interface JSONSearchResults {
  page: number;
  results: movie[];
  total_pages: number;
  total_results: number;
}

export interface category {
  id: number | null;
  name: string;
  user_id: string | undefined;
}

export interface SortOption {
  key: string;
  value: number;
  label: string;
  ascending: boolean;
}

export interface StatusOption {
  value: number;
  label: string;
}
