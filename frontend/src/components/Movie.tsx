import { useLocation } from "react-router-dom";
import type { movie } from "../types/types";
import Modal from "./Modal";
import styled from "styled-components";
import '../index.css';

const MovieItem = styled.div`
  max-width: 150px;

  img {
    width: 100%;

  }
`

function Movie ({movie}: {movie: movie}) {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  return (
    <>
      <MovieItem>
        <img alt={`movie poster for ${movie.title}`} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}.jpg`}/>
      </MovieItem>
      <Modal
        action={isSearchPage ? 'add' : 'edit'} movie={movie}
      />
    </>
  )
}

export default Movie;