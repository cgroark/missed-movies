import { useEffect, useState } from 'react';

import type { movie, JSONSearchResults } from '../../types/types';
import MovieList from './MovieList';
import styled from 'styled-components';
import MovieListSkeleton from './MovieListSkeleton';
import Modal from '../ui/Modal';

const SearchWrapper = styled.div`
  max-width: 400px;
  margin: auto;
  @media (max-width: 576px) {
    max-width: 340px;
  }
`;

function Search() {
  const [search, setSearch] = useState<string>('');
  const [debounceSearch, setDebounce] = useState<string>('');
  const [movies, setMovies] = useState<movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebounce(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (!debounceSearch.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    setError(null);
    const options = {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OMDB_ACCESS_TOKEN}`,
      },
    };
    const searchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(debounceSearch)}`,
          options
        );
        if (!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        if (!ignore) {
          setMovies(
            data.results
              .filter(result => {
                const resultType = result.media_type as string;
                return resultType === 'movie' || resultType === 'tv';
              })
              .slice(0, 12)
              .map(normalizeResult)
          );
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    searchMovies();
    return () => {
      ignore = true;
    };
  }, [debounceSearch]);

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
      <SearchWrapper>
        <input
          aria-label="Search movies and TV shows"
          placeholder="Search movies and TV shows..."
          value={search}
          id="search"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchWrapper>
      {isLoading && search && <MovieListSkeleton />}

      {search != '' &&
        !isLoading &&
        !error &&
        (movies.length ? (
          <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit} />
        ) : (
          <p>No results for your search</p>
        ))}
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

export default Search;

function normalizeResult(result: movie): movie {
  if (result.media_type === 'tv') {
    const name = result.name || result.title;
    const firstAirDate = result.first_air_date || result.release_date || '';
    return {
      ...result,
      title: name,
      name,
      media_type: 'tv',
      release_date: firstAirDate,
      first_air_date: firstAirDate,
    };
  }
  return { ...result, media_type: 'movie' };
}
