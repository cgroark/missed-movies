
export interface movieSummary {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  category: number | '';
  status: number | '';
}

export interface movie extends movieSummary {
  overview: string;
  genre_ids: number[];
  user_id: string | undefined;
}
export interface JSONSearchResults {
  page: number;
  results: movie[];
  total_pages: number;
  total_results: number;
}

export interface category {
  id: number;
  name: string;
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