import styled from 'styled-components';
import Skeleton from '../ui/Skeleton';
import { MovieItems } from './MovieList';

const Card = styled.li`
  width: 100%;
  min-width: 0;
`;

const Poster = styled(Skeleton)`
  height: auto;
  aspect-ratio: 2 / 3;
  margin-bottom: 8px;
`;

function MovieListSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading movies">
      <MovieItems aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <Card key={index}>
            <Poster />
            <Skeleton $width="55%" $height="20px" />
          </Card>
        ))}
      </MovieItems>
    </div>
  );
}

export default MovieListSkeleton;
