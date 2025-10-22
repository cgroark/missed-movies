import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { movie, category } from "../types/types";
import { FloppyDiskIcon, FileVideoIcon, FilmSlateIcon, TrashIcon } from '@phosphor-icons/react';
import styled from "styled-components";
import { useMovies } from "../context/MoviesContext";
import { useToast } from '../context/ToastContext';
import '../index.css';
import Loader from "./Loader";

interface FormProps {
  currentMovie: movie | undefined;
  action: 'add' | 'edit';
  onClose: () =>  void;
}

const Label = styled.label`
  display: flex;
  text-align: left;
  gap: 5px;
  align-items: center;
`

const Select = styled.select`
  display: block;
  text-align: left;
  width: 100%;
  margin: 5px 0 20px 0;
  border-radius: 4px;
  border: 1px solid var(--lightBlack);
  background-color: white;
  color: var(--lightBlack);
  min-height: 30px;
  padding: 5px;
`

const Button = styled.button`
  background-color: var(--purple);
  display: flex;
  gap: 5px;
  align-items: center;
  transition: all 0.3s ease;

  &.delete {
    background-color: var(--darkTeal);

    &:hover {
     background-color: var(--teal);
    }
  }

  &:hover {
     background-color: var(--darkPurple);
  }
`

function MovieForm({currentMovie, action, onClose}: FormProps) {
  const { isLoading, error, saveMovie, getMovies, deleteMovie } = useMovies();
  const { showToast } = useToast();
  const [category, setCategory] = useState<number | ''>('');
  const [categories, setCategories] = useState<category[]>([]);
  const [status, setStatus] = useState<number | ''>('');

  useEffect(() => {
      const getCategories = async () => {
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
        }
      }
      getCategories();
    }, [])

  useEffect(() => {
    if (currentMovie?.status) {
      setStatus(currentMovie.status);
      setCategory(currentMovie.category);
    }
  }, [currentMovie])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMovie) return;

    const userId = (await supabase.auth.getUser()).data.user?.id;
    const movieItem: movie | Partial<movie> = action === 'edit' ?
    {
      id: currentMovie.id,category, status
    }
    :
    {
      id: currentMovie.id,
      title: currentMovie.title,
      release_date: currentMovie.release_date,
      poster_path: currentMovie.poster_path,
      overview: currentMovie.overview,
      genre_ids: currentMovie.genre_ids,
      user_id: userId,
      status,
      category,
    }

    await saveMovie(movieItem, action);
    showToast(
      action === 'edit'
        ? `${currentMovie?.title} updated successfully`
        : `${currentMovie?.title} added to your movies`
    );
    await onClose();
    getMovies(1);
  }

  const handleDelete = async () => {
    if (!currentMovie) return;

    await deleteMovie(currentMovie.id);
    showToast(`${currentMovie?.title} has been deleted`);
    onClose();
    getMovies(1);
  }

  return (
    <>
      <div>
        <form onSubmit={handleSave}>
          <div>
            <Label htmlFor='category'>
              <FileVideoIcon size={24} />
              Category
            </Label>
            <Select id='category' value={category} onChange={(e) => setCategory(Number(e.target.value))} >
              <option disabled value=''>Select Category</option>
              {categories.map((each: category) =>
                <option key={each.id} value={each.id}>{each.name}</option>
              )}
            </Select>
          </div>
          <div>
            <Label htmlFor='status'>
              <FilmSlateIcon size={24} />
              Status
            </Label>
            <Select id='status' value={status} onChange={(e) => setStatus(Number(e.target.value))} >
              <option disabled value=''>Select Status</option>
              <option value='1'>Want to watch</option>
              <option value='2'>Already watched</option>
            </Select>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'  }}>
            <Button type='submit'>
              {isLoading ? 'Saving' : 'Save'}
              {isLoading ?
                <Loader size='small' />
                :
                <FloppyDiskIcon size={24} />
              }
            </Button>
            {action === 'edit' && (
              <Button className='delete' type='button' onClick={handleDelete}>
                {isLoading ? 'Deleting' : 'Delete'}
                <TrashIcon size={24} />
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}

export default MovieForm;