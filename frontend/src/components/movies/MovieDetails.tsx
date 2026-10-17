import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Skeleton from '../ui/Skeleton';
import { getMovieDirector } from '../../utils/movieCredits';

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
  overview: string;
}

export default function MovieDetails({ movieId, releaseDate, overview }: MovieDetailsProps) {
  const [isLoadingDirector, setLoadingDirector] = useState(Boolean(movieId));
  const [director, setDirector] = useState('');

  useEffect(() => {
    let ignore = false;
    setDirector('');
    setLoadingDirector(Boolean(movieId));
    if (movieId) {
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
  }, [movieId]);

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
