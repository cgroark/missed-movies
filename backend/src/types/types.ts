export interface movie {
  id?: number;
  movie_id: number;
  title: string;
  release_date: string;
  poster_path: string;
  category: number | '';
  status: number | '';
  overview: string;
  genre_ids: number[];
  user_id: string | undefined;
}

export interface category {
  id: number | null;
  name: string;
  user_id: string | undefined;
}
