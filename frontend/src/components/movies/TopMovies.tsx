import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FilmStripIcon } from '@phosphor-icons/react';
import type { movie, JSONSearchResults } from '../../types/types';
import MovieList from './MovieList';
import Modal from '../ui/Modal';
import styled from 'styled-components';
import { tealFloatingActionStyles } from '../ui/FloatingActionStyles';
import {
  CategoryToolbar,
  CategoryControls,
  CategoryList,
  CategoryButton,
  MediaTypeSwitch,
  MediaTypeButton,
} from '../ui/CategoryTabs';
import MovieListSkeleton from './MovieListSkeleton';
import type { MediaType } from '../../types/types';

const StyledLink = styled(Link)`
  background-color: var(--pink);
  text-decoration: none;
  display: flex;
  margin: 25px auto 10px;
  gap: 8px;
  align-items: center;
  border-radius: var(--control-radius);
  box-sizing: border-box;
  min-height: 38.8px;
  justify-content: center;
  border: 1px solid transparent;
  padding: 0.4em 1.4em;
  font-size: 1em;
  font-weight: 500;
  color: var(--lightBlack);
  width: fit-content;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--darkPink);
    color: var(--offWhite);
  }

  &.floater {
    z-index: 200;
    right: 10px;
    bottom: 15px;
    position: fixed;
    margin: 0;

    @media (max-width: 576px) {
      display: none;
    }
  }
  &.floater {
    ${tealFloatingActionStyles}
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

const tvCategories = [
  { slug: 'trending', text: 'Trending' },
  { slug: 'popular', text: 'Popular' },
  { slug: 'top_rated', text: 'Top Rated' },
  { slug: 'airing_today', text: 'Airing Today' },
  { slug: 'on_the_air', text: 'On the Air' },
];

function TopMovies() {
  const [movies, setMovies] = useState<movie[]>([]);
  const [category, setCategory] = useState<string>('top_rated');
  const [mediaType, setMediaType] = useState<MediaType>('movie');
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
          `https://api.themoviedb.org/3/${category === 'trending' ? `trending/${mediaType}/day` : `${mediaType}/${category}`}?page=${String(page)}`,
          options
        );
        if (!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        if (!ignore) {
          const normalized = data.results.map(result =>
            mediaType === 'tv'
              ? {
                  ...result,
                  title: result.name || result.title,
                  name: result.name || result.title,
                  media_type: 'tv' as const,
                  release_date: result.first_air_date || result.release_date || '',
                  first_air_date: result.first_air_date || result.release_date || '',
                }
              : { ...result, media_type: 'movie' as const }
          );
          setMovies(prev => [...prev, ...normalized]);
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
  }, [category, mediaType, page]);

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
  }, [category, mediaType]);

  const selectMediaType = (nextType: MediaType) => {
    setMediaType(nextType);
    setCategory(nextType === 'tv' ? 'trending' : 'top_rated');
  };

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
      <MediaTypeSwitch role="group" aria-label="Browse movies or TV shows">
        {([{ value: 'movie', label: 'Movies' }, { value: 'tv', label: 'TV Shows' }] as const).map(tab => (
          <MediaTypeButton
            key={tab.value}
            type="button"
            aria-pressed={mediaType === tab.value}
            onClick={() => selectMediaType(tab.value)}
          >
            {tab.label}
          </MediaTypeButton>
        ))}
      </MediaTypeSwitch>
      <CategoryToolbar aria-label={`Browse ${mediaType === 'movie' ? 'movies' : 'TV shows'}`}>
        <CategoryControls>
          <CategoryList>
            {(mediaType === 'tv' ? tvCategories : categories).map(each => (
              <li key={each.slug}>
                <CategoryButton
                  aria-pressed={category === each.slug}
                  onClick={() => setCategory(each.slug)}
                  className={category === each.slug ? 'active' : ''}
                >
                  {each.text}
                </CategoryButton>
              </li>
            ))}
          </CategoryList>
        </CategoryControls>
      </CategoryToolbar>

      <div style={{ minHeight: '1000px' }}>
        {!error &&
          (movies.length ? (
            <>
              <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit} />
              <div ref={loaderRef} style={{ height: '40px' }} />
              {isLoading && <MovieListSkeleton count={6} />}
              <StyledLink className="floater" to="/">
                My Collection
                <FilmStripIcon size={24} />
              </StyledLink>
            </>
          ) : isLoading ? (
            <MovieListSkeleton />
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
