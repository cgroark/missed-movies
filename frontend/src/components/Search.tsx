import {useEffect, useState} from 'react';
import type { movie, JSONSearchResults } from '../types/types';
import MovieList from './MovieList';


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
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${debounceSearch}`, options);
        if(!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        setMovies(data.results);
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
      {isLoading && search && <p>'Loading...'</p>}
      <label htmlFor="search">Find a movie</label>
      <input value={search} id="search" onChange={(e) => setSearch(e.target.value)} />
      {search != '' && !isLoading && !error && (
        movies.length ? <MovieList data={movies}/> : <p>No results for your search</p>
      )
      }
    </>
  )
}

export default Search;