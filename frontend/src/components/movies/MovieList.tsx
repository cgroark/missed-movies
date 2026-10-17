import type { movie } from '../../types/types';
import styled from 'styled-components';
import Movie from './Movie';

interface MoveListProps {
  movies: movie[];
  onAdd: (movie: movie) => void;
  onEdit: (movie: movie) => void;
}

export const MovieItems = styled.ul`
  list-style: none;
  padding: 10px 0;
  width: calc(100% - 40px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  align-items: start;
  gap: 25px;
  max-width: 1205px;
  margin: 10px auto 50px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 20px;
  }
`;
function MovieList({ movies, onAdd, onEdit }: MoveListProps) {
  if (!Array.isArray(movies)) return null;
  return (
    <>
      <MovieItems>
        {movies.map(
          (movie: movie) =>
            movie.poster_path && (
              <li key={movie.id}>
                <Movie movie={movie} onAdd={() => onAdd(movie)} onEdit={() => onEdit(movie)} />
              </li>
            )
        )}
      </MovieItems>
    </>
  );
}

export default MovieList;
