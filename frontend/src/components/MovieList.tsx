import type { movie} from "../types/types";
import styled from "styled-components";
import Movie from "./Movie";

const MovieItems = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
`
function MovieList({data}: {data: movie[]}) {
  return (
    <>
      <h3>Results</h3>
      <MovieItems>
        {data.map((movie) =>
          movie.poster_path &&
          <li key={movie.id}>
            <Movie movie={movie}/>
          </li>
        )}

      </MovieItems>
    </>
  )
}

export default MovieList;