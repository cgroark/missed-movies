import {useEffect, useState} from 'react';
import type { movie, JSONSearchResults } from '../types/types';
import MovieList from './MovieList';
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
`

const CategoryButton = styled.button`
  background-color: var(--lightBlack);
  display: flex;
  margin: auto;
  gap: 5px;
  align-items: center;
  border: solid 2px var(--offWhite);
  transition: all 0.3s ease;

  &.active, &:hover {
    background-color: var(--pink);
    color: var(--lightBlack);
  }
`

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
  const [category, setCategory] = useState<string>('top_rated')
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const options = {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OMDB_ACCESS_TOKEN}`,
      }
    }
    console.log('header', options)
    const findMovies = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${category}`, options);
        if(!res.ok) throw new Error('error fetching');
        const data: JSONSearchResults = await res.json();
        console.log('data cat', category, data)
        setMovies(data.results);
      }
      catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
      finally {
        setLoading(false);
      }
    }
    findMovies();

  }, [category]);

  return (
    <>
      <div>
        <CategoryList>
          {categories.map((each) =>
            <li key={each.slug}>
              <CategoryButton
                onClick={() => setCategory(each.slug)}
                className={ category === each.slug ? 'active' : ''}
              >
                {each.text}
              </CategoryButton>
            </li>
          )}
        </CategoryList>
      </div>

      {isLoading && <Loader size='large' />}

      {!isLoading && !error && (
        movies.length ? <MovieList data={movies}/> : <p>No results available</p>
      )
      }
    </>
  )
}

export default TopMovies;