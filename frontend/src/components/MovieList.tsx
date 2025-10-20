import type { movie} from "../types/types";
import styled from "styled-components";
import Movie from "./Movie";

const MovieItems = styled.ul`
  list-style: none;
  padding: 10px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 25px;
  max-width: 1280px;
  margin: auto;
`
function MovieList({data}: {data: movie[]}) {
  return (
    <>
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