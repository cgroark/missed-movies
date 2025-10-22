import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FilmStripIcon } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from "../context/MoviesContext";
import type { movie, category } from "../types/types";
import MovieList from "./MovieList";
import Modal from "./Modal";
import Loader from "./Loader";
import '../index.css';

const CategoryList = styled.ul`
  padding: 0 20px;
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

const StyledLink = styled(Link)`
  background-color: var(--teal);
  display: flex;
  margin: 25px auto 10px;
  gap: 5px;
  align-items: center;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.4em 1.4em;
  font-size: 1em;
  font-weight: 500;
  color: var(--offWhite);
  width: fit-content;
  transition: all 0.3s ease;

  &:hover {
     background-color: var(--darkTeal);
     color: var(--offWhite);
  }
`

function MyMovies() {
  const { movies, isLoading, error, getMovies } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  const [categoryLoading, setLoading] = useState<boolean>(false);

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
     getMovies(activeCategory);
  }, [activeCategory]);

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
    await getMovies(1);
    setOpen(false);
  };

  return (
    <>
      {!categoryLoading && categories.length && (
        <div>
          <CategoryList>
            {categories.map((each: category) =>
                <li key={each.id}>
                <CategoryButton
                  onClick={() => setActiveCategory(each.id)}
                  className={ activeCategory === each.id ? 'active' : ''}
                >
                  {each.name}
                </CategoryButton>
              </li>
            )}
          </CategoryList>
        </div>
      )}
      {isLoading && <Loader size='large' /> }
      {!isLoading && (
        movies.length ?
        <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit}/> :
        <>
        <p>No movies in this category yet</p>
        <StyledLink to='/search'>
          Find movies
          <FilmStripIcon size={24} />
        </StyledLink>
        </>
      )}
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

export default MyMovies;