import { useLocation } from "react-router-dom";
import type { movie } from "../types/types";
import Modal from "./Modal";
import styled from "styled-components";
import '../index.css';
import AccordionSection from "./Accordion";

const MovieItem = styled.div`
  img {
    width: 100%;
  }
`

function Movie ({movie}: {movie: movie}) {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const overview = `${movie.release_date.split('-')[0]} - ${movie.overview}`
  return (
    <>
    <div style={{maxWidth: '180px'}}>
      <MovieItem>
        <img alt={`movie poster for ${movie.title}`} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}.jpg`}/>
      </MovieItem>
      <Modal
        action={isSearchPage ? 'add' : 'edit'} movie={movie}
      />
      <AccordionSection title="Details" content={overview} />
    </div>

    </>
  )
}

export default Movie;