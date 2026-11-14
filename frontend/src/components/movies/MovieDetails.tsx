import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Skeleton from '../ui/Skeleton';
import { getMovieDirector } from '../../utils/movieCredits';
import type { MediaType } from '../../types/types';

const Metadata = styled.p`
  margin: 0 0 10px;
  color: #d5c0ee;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.5;
`;

const Description = styled.p`
  margin: 0;
`;

interface MovieDetailsProps {
  movieId?: number;
  releaseDate: string;
  mediaType: MediaType;
  overview: string;
}

export default function MovieDetails({ movieId, releaseDate, mediaType, overview }: MovieDetailsProps) {
  const [isLoadingDirector, setLoadingDirector] = useState(Boolean(movieId) && mediaType === 'movie');
  const [director, setDirector] = useState('');

  useEffect(() => {
    let ignore = false;
    setDirector('');
    const shouldLoadDirector = Boolean(movieId) && mediaType === 'movie';
    setLoadingDirector(shouldLoadDirector);
    if (shouldLoadDirector && movieId) {
      getMovieDirector(movieId)
        .then(name => {
          if (!ignore) setDirector(name);
        })
        .catch(() => {
          /* The year and overview remain available without credits. */
        })
        .finally(() => {
          if (!ignore) setLoadingDirector(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [movieId, mediaType]);

  const metadata = [releaseDate?.split('-')[0], director && `Directed by ${director}`]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      {(metadata || isLoadingDirector) && (
        <Metadata aria-busy={isLoadingDirector}>
          {metadata}
          {isLoadingDirector && (
            <span role="status" aria-label="Loading director">
              {metadata && ' · '}
              <Skeleton
                as="span"
                $width="100px"
                $height="12px"
                style={{ display: 'inline-block', verticalAlign: 'middle', maxWidth: '100%' }}
              />
            </span>
          )}
        </Metadata>
      )}
      <Description>{overview}</Description>
    </>
  );
}
