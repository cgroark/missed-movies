import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import type { movie, JSONSearchResults } from '../types/types';
import MovieList from './MovieList';
import styled from 'styled-components';
import Loader from './Loader';
import Modal from './Modal';

const Label = styled.label`
  justify-content: center;
  margin: 50px 0 10px 0;
  font-size: 24px;

  @media (max-width: 576px) {
    margin: 10px 0;
  }
`;

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
          `https://api.themoviedb.org/3/search/movie?&query=${debounceSearch}`,
          options
        );
        if (!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        setMovies(data.results.slice(0, 12));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    if (debounceSearch) searchMovies();
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
        <Label htmlFor="search">
          Find a movie
          <MagnifyingGlassIcon size={24} />
        </Label>
        <input
          placeholder="search for movies..."
          value={search}
          id="search"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchWrapper>
      {isLoading && search && <Loader size="large" />}

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
