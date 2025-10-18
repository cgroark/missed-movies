import { useState, useEffect, act } from "react";
import styled from "styled-components";
import { useAuth } from '../context/AuthContext';
import type { movie, category } from "../types/types";
import MovieList from "./MovieList";
import Loader from "./Loader";
import '../index.css';

const CategoryList = styled.ul`
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
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

function MyMovies() {
  const [myMovies, setMyMovies] = useState<movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<movie[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if(!res.ok) throw new Error('Category error');
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
          console.log('err', err);
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, [])

  useEffect(() => {
    const getMovies = async (category?: number) => {
      setLoading(true);
      try {
        const url = new URL (`${import.meta.env.VITE_API_URL}/api/movies`);
        if (category) url.searchParams.append('category', String(category));
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if(!res.ok) throw new Error('Failed to get your movies');
        const data: movie[] = await res.json();
        setActiveCategory(data[0].category);
        setMyMovies(data);
      }
      catch (err: any) {
        console.log('err', err);
      }
      finally {
        setLoading(false);
      }
    }
    getMovies();
  }, []);

  useEffect(() => {
    if(activeCategory !== null) {
      const filtered = myMovies.filter((each) => each.category === activeCategory);
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(myMovies);
    }
  }, [myMovies, activeCategory])

  const updateCategory = (id: number) => {
    console.log(id);
    setActiveCategory(id);
  };

  return (
    <>
      <h2>My Movies</h2>
      {isLoading && <Loader size='large' /> }
      {!isLoading && (
        myMovies.length ?
        <>
          {categories.length && (
            <div>
              <CategoryList>
                {categories.map((each: category) =>
                   myMovies.find((movie: movie) => movie.category === each.id) &&
                   <li key={each.id}>
                    <CategoryButton
                      onClick={() => updateCategory(each.id)}
                      className={ activeCategory === each.id ? 'active' : ''}
                    >
                      {each.name}
                    </CategoryButton>
                  </li>
                )}
              </CategoryList>
            </div>
          )}
        <MovieList data={filteredMovies}/>
        </>
        : <p>You haven't added any movies yet</p>
      )
      }
    </>
  )
}

export default MyMovies;