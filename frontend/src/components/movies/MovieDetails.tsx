import { useEffect, useState } from 'react';
import styled from 'styled-components';
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
  const [director, setDirector] = useState('');

  useEffect(() => {
    let ignore = false;
    setDirector('');
    if (movieId) {
      getMovieDirector(movieId)
        .then(name => {
          if (!ignore) setDirector(name);
        })
        .catch(() => {
          /* The year and overview remain available without credits. */
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
      {metadata && <Metadata>{metadata}</Metadata>}
      <Description>{overview}</Description>
    </>
  );
}
