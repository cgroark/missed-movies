import {useEffect, useState} from 'react';
import type { movie, JSONSearchResults } from '../types/types';
import MovieList from './MovieList';
import styled from 'styled-components';
import Loader from './Loader';

const Input = styled.input`
  text-align: left;
  min-width: 300px;
  border-radius: 4px;
  border: 1px solid var(--offWhite);
  padding: 5px;
  margin-bottom: 50px;
`

const Label = styled.label`
  display: block;
  margin: 50px 0 20px 0;
  font-size: 24px;
`

function Search() {
  const [search, setSearch] = useState<string>('');
  const [debounceSearch, setDebounce] = useState<string>('');
  const [movies, setMovies] = useState<movie[]>([]);
  const [data, setData] = useState<JSONSearchResults>()
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => setDebounce(search),300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const options = {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OMDB_ACCESS_TOKEN}`,
      }
    }
    console.log('header', options)
    const searchMovies = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?&query=${debounceSearch}`, options);
        if(!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        setMovies(data.results.slice(0,5));
        setData(data);
        console.log(movies);
      }
      catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
      finally {
        setLoading(false);
      }
    }
    if(debounceSearch) searchMovies();

  }, [debounceSearch]);



  return (
    <>
      <div>
        <Label htmlFor="search">Find a movie</Label>
        <Input placeholder="search for movies..." value={search} id="search" onChange={(e) => setSearch(e.target.value)} ></Input>
      </div>
      {isLoading && search && <Loader size='large' />}

      {search != '' && !isLoading && !error && (
        movies.length ? <MovieList data={movies}/> : <p>No results for your search</p>
      )
      }
    </>
  )
}

export default Search;