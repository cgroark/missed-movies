import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { movie } from '../../types/types';
import { CheckFatIcon, PencilIcon, PlusIcon } from '@phosphor-icons/react';
import styled from 'styled-components';
import AccordionSection from '../ui/Accordion';
import MovieDetails from './MovieDetails';

interface MovieProps {
  movie: movie;
  onEdit: () => void;
  onAdd: () => void;
}

const PosterWrapper = styled.div<{ $loaded: boolean }>`
  position: relative;
  background: #303038;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  min-height: 270px;

  @media (max-width: 768px) {
    min-height: 170px;
  }
  img {
    display: block;
    width: 100%;
    opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
    filter: ${({ $loaded }) => ($loaded ? 'blur(0)' : 'blur(10px)')};
    transform: scale(${({ $loaded }) => ($loaded ? 1 : 1.05)});
    transition:
      opacity 0.4s ease,
      filter 0.6s ease,
      transform 0.6s ease;
  }
`;

const MovieWrapper = styled.div`
  position: relative;
  min-width: 180px;
  max-width: 180px;

  @media (max-width: 768px) {
    min-width: 150px;
    max-width: 150px;
  }
`;
const MovieItem = styled.div`
  position: relative;
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
`;
const CheckIcon = styled(CheckFatIcon)`
  background-color: var(--teal);
  color: #173b34;
  border-radius: 50%;
  padding: 7px;
  width: 22px;
  height: 22px;
  z-index: 1;
  border: solid 2px #242424;
  position: absolute;
  top: -8px;
  left: -8px;
`;

const OpenButton = styled.button`
  && {
    background-color: var(--purple);
    border-radius: 50%;
    padding: 0;
    width: 44px;
    height: 44px;
    min-height: 44px;
    border: solid 2px #242424;
    position: absolute;
    right: -8px;
    bottom: -10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition:
      background-color 160ms ease,
      transform 160ms ease;

    @media (hover: hover) {
      &:hover {
        background-color: var(--darkPurple);
        transform: translateY(-2px);
      }
    }
  }
`;

function Movie({ movie, onEdit, onAdd }: MovieProps) {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  return (
    <>
      <MovieWrapper>
        {movie.status === 2 && <CheckIcon />}
        <MovieItem>
          <PosterWrapper $loaded={loaded}>
            <div className={movie.status === 2 ? 'watched' : ''}>
              <img
                loading="lazy"
                alt={`movie poster for ${movie.title}`}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}.jpg`}
                onLoad={() => setLoaded(true)}
              />
            </div>
          </PosterWrapper>
          {isSearchPage ? (
            <OpenButton type="button" aria-label={`Add ${movie.title}`} onClick={onAdd}>
              <PlusIcon size={24} />
            </OpenButton>
          ) : (
            <OpenButton type="button" aria-label={`Edit ${movie.title}`} onClick={onEdit}>
              <PencilIcon size={24} />
            </OpenButton>
          )}
        </MovieItem>
        <AccordionSection
          title="Details"
          content={
            <MovieDetails
              movieId={movie.movie_id ?? (isSearchPage ? movie.id : undefined)}
              releaseDate={movie.release_date}
              overview={movie.overview}
            />
          }
        />
      </MovieWrapper>
    </>
  );
}

export default Movie;
