import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { movie } from '../types/types';
import { CheckFatIcon, PencilIcon, PlusIcon } from '@phosphor-icons/react';
import styled from 'styled-components';
import '../index.css';
import AccordionSection from './Accordion';

interface MovieProps {
  movie: movie;
  onEdit: () => void;
  onAdd: () => void;
}

const PosterWrapper = styled.div<{ $loaded: boolean }>`
  position: relative;
  background: var(--gray-800);
  overflow: hidden;
  border-radius: 4px;
  min-height: 270px;

  @media (max-width: 768px) {
    min-height: 170px;
  }
x
  img {
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
  min-width: 180px;
  max-width: 180px;

  @media (max-width: 768px) {
    min-width: 150px;
    max-width: 150px;
  }
`;
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
`;
const CheckIcon = styled(CheckFatIcon)`
  background-color: var(--teal);
  border-radius: 50%;
  padding-top: 0.25rem;
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
`;

const OpenButton = styled.div`
  background-color: var(--purple);
  border-radius: 50%;
  padding-top: 0.25rem;
  margin: -30px 0 0 150px;
  width: 35px;
  height: 30px;
  border: solid 2px #050505;
  position: absolute;
  cursor: pointer;
  transition: 200ms cubic-bezier(0.25, 0.1, 0.25, 1);

  @media (max-width: 768px) {
    margin: -30px 0 0 120px;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

function Movie({ movie, onEdit, onAdd }: MovieProps) {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const overview = `${movie.release_date.split('-')[0]} - ${movie.overview}`;
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
            <OpenButton onClick={onAdd}>
              <PlusIcon size={24} />
            </OpenButton>
          ) : (
            <OpenButton onClick={onEdit}>
              <PencilIcon size={24} />
            </OpenButton>
          )}
        </MovieItem>
        <AccordionSection title="Details" content={overview} />
      </MovieWrapper>
    </>
  );
}

export default Movie;
