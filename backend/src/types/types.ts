export interface movie {
  id?: number;
  movie_id: number;
  title: string;
  name?: string | null;
  media_type?: 'movie' | 'tv';
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

export interface category {
  id: number | null;
  name: string;
  user_id: string | undefined;
}
