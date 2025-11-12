import { useState, useEffect } from "react";
import type { movie, category } from "../types/types";
import { FloppyDiskIcon, FileVideoIcon, FilmSlateIcon, TrashIcon } from '@phosphor-icons/react';
import styled from "styled-components";
import { useMovies } from "../context/MoviesContext";
import { useCategories } from '../context/CategoriesContext';
import { useToast } from '../context/ToastContext';
import '../index.css';
import Loader from "./Loader";

interface FormProps {
  currentMovie: movie | null;
  action: 'add' | 'edit';
  onClose: () =>  void;
}

const ErrorField = styled.div`
  background-color: var(--teal);
  border-radius: 10px;
  width: 75%;
  margin: 15px auto;
  padding: 10px;
  color: var(--offWhite);
  text-align: center;

  p {
    margin: 0;
  }
`

function MovieForm({currentMovie, action, onClose}: FormProps) {
  const { isLoading, error, getMovies, saveMovie, deleteMovie, activeCategory, status, sortBy } = useMovies();
  const { categories, getCategories } = useCategories();
  const { showToast } = useToast();
  const [category, setCategory] = useState<number | ''>('');
  const [movieStatus, setMovieStatus] = useState<number | ''>('');
  const [feError, setError] = useState<string>('');

  useEffect(() => {
    getCategories();
  }, [])

  useEffect(() => {
    if (currentMovie?.status) {
      setMovieStatus(currentMovie.status);
      setCategory(currentMovie.category);
    }
  }, [currentMovie])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!currentMovie) return;
    if(!category || !movieStatus) {
      setError('Status and Category are required');
      return;
    }
    const movieItem: Partial<movie> = action === 'edit' ?
    {
      id: currentMovie.id,
      category,
      status: movieStatus
    }
    :
    {
      movie_id: currentMovie.id,
      title: currentMovie.title,
      release_date: currentMovie.release_date,
      poster_path: currentMovie.poster_path,
      overview: currentMovie.overview,
      genre_ids: currentMovie.genre_ids,
      status: movieStatus,
      category,
    }
    console.log("MOVIE Item and ID check", movieItem, currentMovie)

    const { success, error: saveError } = await saveMovie(movieItem, action);

    if(!success) {
      setError(saveError ?? 'unknown error');
      return;
    }

    showToast(
    action === 'edit'
      ? `${currentMovie?.title} updated successfully`
      : `${currentMovie?.title} added to your movies`
    );
    await onClose();
    getMovies(0, 5, activeCategory, sortBy, status);
  }

  const handleDelete = async () => {
    if (!currentMovie) return;

    const { success, error: deleteError } = await deleteMovie(currentMovie.id);

    if(!success) {
      setError(deleteError ?? 'unknown error');
      return;
    }
    showToast(`${currentMovie?.title} has been deleted`);
    await onClose();
    getMovies(0, 5, activeCategory, sortBy, status);
  }

  return (
    <>
      <div>
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor='category'>
              <FileVideoIcon size={24} />
              Category
            </label>
            <select id='category' value={category} onChange={(e) => setCategory(Number(e.target.value))} >
              <option disabled value=''>Select Category</option>
              {categories.map((each: category) =>
                <option key={each.id} value={each.id}>{each.name}</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor='status'>
              <FilmSlateIcon size={24} />
              Status
            </label>
            <select id='status' value={movieStatus} onChange={(e) => setMovieStatus(Number(e.target.value))} >
              <option disabled value=''>Select Status</option>
              <option value='1'>Want to watch</option>
              <option value='2'>Already watched</option>
            </select>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'  }}>
            {action === 'edit' && (
              <button className='teal slimmer' type='button' onClick={handleDelete}>
                {isLoading ? 'Deleting' : 'Delete'}
                <TrashIcon size={24} />
              </button>
            )}
            <button className='slimmer' type='submit'>
              {isLoading ? 'Saving' : 'Save'}
              {isLoading ?
                <Loader size='small' />
                :
                <FloppyDiskIcon size={24} />
              }
            </button>
          </div>
          {(feError || error ) && (
            <ErrorField>
                <p>{feError || error }</p>
            </ErrorField>
          )}
        </form>
      </div>
    </>
  )
}

export default MovieForm;