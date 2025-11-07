import type { movie} from "../types/types";
import styled from "styled-components";
import Movie from "./Movie";

interface MoveListProps {
  movies: movie[];
  onAdd: (movie: movie) => void;
  onEdit: (movie: movie) =>void;
}

const MovieItems = styled.ul`
  list-style: none;
  padding: 10px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 25px;
  max-width: 1280px;
  margin: 10px auto 50px;
`
function MovieList({movies, onAdd, onEdit}: MoveListProps) {
  if (!Array.isArray(movies)) return null;
  return (
    <>
      <MovieItems>
        {movies.map((movie: movie) =>
          movie.poster_path &&
          <li key={movie.id}>
            <Movie
              movie={movie}
              onAdd={() => onAdd(movie)}
              onEdit={() => onEdit(movie)}
            />
          </li>
        )}
      </MovieItems>
    </>
  )
}

export default MovieList;