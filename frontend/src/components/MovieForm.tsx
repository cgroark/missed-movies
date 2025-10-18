import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { movie, category } from "../types/types";
import { FloppyDiskIcon, FileVideoIcon, FilmSlateIcon, FilmStripIcon } from '@phosphor-icons/react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import '../index.css';
import Loader from "./Loader";

interface formProps {
  currentMovie: movie | undefined,
  action: 'add' | 'edit',
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
  color: var(--lightBlack)
  min-height: 30px;
  padding: 5px;
`

const Button = styled.button`
  background-color: var(--purple);
  display: flex;
  margin: auto;
  gap: 5px;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
     background-color: var(--darkPurple);
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

function MovieForm({currentMovie}: formProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaved, setSaved] = useState<boolean>(false)
  const [category, setCategory] = useState<number | ''>('');
  const [categories, setCategories] = useState<category[]>([]);
  const [status, setStatus] = useState<number | ''>('');

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

  const saveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if(currentMovie) {
      const movieItem: movie = {
        id: currentMovie.id,
        title: currentMovie.title,
        release_date: currentMovie.release_date,
        poster_path: currentMovie.poster_path,
        overview: currentMovie.overview,
        genre_ids: currentMovie.genre_ids,
        user_id: userId,
        status: status,
        category: category,
      }

          console.log('movie', movieItem);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(movieItem)
      });

      if(!res.ok) throw new Error('Failed to save movie');
      const data = await res.json();
      setSaved(true);
      console.log('saved', data);
    }
    catch (err: any) {
      console.log('err', err)
    }
    finally {
      setLoading(false);
    }
    }



  }
  return (
    <>
      <div>
        {!isSaved ? (
        <form onSubmit={saveMovie}>
          <div>
            <Label htmlFor='category'>
              <FileVideoIcon size={24} />
              Category
            </Label>
            <Select id='category' value={category} onChange={(e) => setCategory(Number(e.target.value))} >
              <option disabled value=''>Select Category</option>
              {categories.map((each: category) =>
                <option value={each.id}>{each.name}</option>
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
          <Button type='submit'>
            {isLoading ? 'Saving' : 'Save'}
            {isLoading ?
              <Loader size='small' />
              :
              <FloppyDiskIcon size={24} />
            }
          </Button>
        </form>
        ) :
        <div style={{textAlign: 'center'}}>
          <p>Saved
            <strong><em> {currentMovie?.title} </em></strong>
            Successfully!</p>
          <StyledLink to="/">
            View all movies
            <FilmStripIcon size={24} />
          </StyledLink>
        </div>
        }
      </div>
    </>
  )
}

export default MovieForm;