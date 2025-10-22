import { useLocation } from "react-router-dom";
import type { movie } from "../types/types";
import { CheckFatIcon } from '@phosphor-icons/react';
import Modal from "./Modal";
import styled from "styled-components";
import '../index.css';
import AccordionSection from "./Accordion";

const MovieWrapper = styled.div`
  max-width: 180px;

  @media (max-width: 768px) {
    max-width: 110px;
  }
`
const MovieItem = styled.div`
  img {
    width: 100%;
  }

  .watched {
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(100, 100, 100, 0.6);
    }
  }
`

const CheckIcon = styled(CheckFatIcon)`
  background-color: var(--teal);
  border-radius: 50%;
  padding-top: .25rem;
  margin: -8px 0 0 -100px;
  width: 43px;
  height: 38px;
  z-index: 1;
  border: solid 2px #050505;
  position: absolute;
  transition: 200ms cubic-bezier(0.25, 0.1, 0.25, 1);

  @media (max-width: 768px) {
      margin: -8px 0 0 -70px;
  }
`

function Movie ({movie}: {movie: movie}) {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const overview = `${movie.release_date.split('-')[0]} - ${movie.overview}`
  return (
    <>
    <MovieWrapper>
      {movie.status === 2 && <CheckIcon />}
      <MovieItem>
        <div className={movie.status === 2 ? 'watched' : ''}>
          <img alt={`movie poster for ${movie.title}`} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}.jpg`}/>
        </div>
      </MovieItem>
      <Modal
        action={isSearchPage ? 'add' : 'edit'}
        movie={movie}
      />
      <AccordionSection title="Details" content={overview} />
    </MovieWrapper>
    </>
  )
}

export default Movie;