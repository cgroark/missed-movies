import { useEffect, useState, useRef } from 'react';
import type { movie, JSONSearchResults } from '../types/types';
import MovieList from './MovieList';
import Modal from './Modal';
import styled from 'styled-components';
import Loader from './Loader';

const CategoryList = styled.ul`
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;

  @media (max-width: 576px) {
    margin-bottom: 20px;
    gap: 10px;
  }
`;

const CategoryButton = styled.button`
  position: relative;
  border-radius: 8px;
  background-color: transparent;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 2px;
    background: linear-gradient(255deg, var(--purple) 5%, var(--teal));
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
  }

  &.active,
  &:hover {
    background: linear-gradient(255deg, var(--purple) 5%, var(--teal));
    color: black;
  }
`;

const categories = [
  {
    slug: 'top_rated',
    text: 'Top Rated',
  },
  {
    slug: 'now_playing',
    text: 'Playing Now',
  },
  {
    slug: 'popular',
    text: 'Popular',
  },
  {
    slug: 'upcoming',
    text: 'Upcoming',
  },
];

function TopMovies() {
  const [movies, setMovies] = useState<movie[]>([]);
  const [category, setCategory] = useState<string>('top_rated');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(Infinity);
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    const options = {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OMDB_ACCESS_TOKEN}`,
      },
    };
    const findMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?page=${String(page)}`,
          options
        );
        if (!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        if (!ignore) {
          setMovies(prev => [...prev, ...data.results]);
          setTotalPages(data.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    findMovies();
    return () => {
      ignore = true;
    };
  }, [category, page]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPage(prev => (prev < totalPages ? prev + 1 : prev));
        }
      },
      { threshold: 0.5 }
    );

    const currentLoader = loaderRef.current;
    const currentObserver = observerRef.current;

    if (currentLoader && currentObserver) {
      currentObserver.observe(currentLoader);
    }

    return () => {
      if (currentLoader && currentObserver) {
        currentObserver.unobserve(currentLoader);
      }
    };
  }, [movies, totalPages]);

  useEffect(() => {
    setMovies([]);
    setTotalPages(Infinity);
    setPage(1);
  }, [category]);

  const handleAdd = (movie: movie) => {
    setModalAction('add');
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleEdit = (movie: movie) => {
    setModalAction('edit');
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleAfterSave = async () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <CategoryList>
          {categories.map(each => (
            <li key={each.slug}>
              <CategoryButton
                onClick={() => setCategory(each.slug)}
                className={category === each.slug ? 'active' : ''}
              >
                {each.text}
              </CategoryButton>
            </li>
          ))}
        </CategoryList>
      </div>

      {isLoading && <Loader size="large" />}
      <div style={{ minHeight: '1000px' }}>
        {!error &&
          (movies.length ? (
            <>
              <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit} />
              <div ref={loaderRef} style={{ height: '40px' }} />
              {isLoading && <Loader size="small" />}
            </>
          ) : (
            <p>No results available</p>
          ))}
      </div>
      {open && (
        <Modal
          open={open}
          movie={selectedMovie || ({} as movie)}
          action={modalAction}
          onOpenChange={setOpen}
          onAfterSave={handleAfterSave}
        />
      )}
    </>
  );
}

export default TopMovies;
