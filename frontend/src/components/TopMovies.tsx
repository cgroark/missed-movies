import {useEffect, useState} from 'react';
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
`

const CategoryButton = styled.button`
  background-color: var(--darkGray);
  box-shadow: 3px 3px 3px var(--teal) ;

  &.active, &:hover {
    background-color: var(--teal);
    color: var(--lightBlack);
    box-shadow: 3px 3px 3px var(--offWhite) ;
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
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState<boolean>(false);
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
      <div style={{minHeight: '1000px'}}>
        {!isLoading && !error && (
          movies.length ?

            <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit}/>

          : <p>No results available</p>
        )
        }
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
  )
}

export default TopMovies;