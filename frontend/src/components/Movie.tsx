import styled from "styled-components";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

import type { movie } from "../types/types";


const MovieItem = styled.div`
  max-width: 150px;

  img {
    width: 100%;
  }
`

function Movie ({movie}: {movie: movie}) {
  const [isLoading, setLoading] = useState<boolean>(false)

  const saveMovie = async (movie: movie) => {
    setLoading(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const movieItem: movie = {
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      overview: movie.overview,
      genre_ids: movie.genre_ids,
      user_id: userId,
    }

    console.log('movie', movieItem);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`, {
        method: 'POST',
        headers: {
          // 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(movieItem)
      });

      if(!res.ok) throw new Error('Failed to save movie');
      const data = await res.json();
      console.log('saved', data);
    }
    catch (err: any) {
      console.log('err', err)
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <MovieItem onClick={() => saveMovie(movie)}>
      <img alt={`movie poster for ${movie.title}`} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}.jpg`}/>
    </MovieItem>
  )
}

export default Movie;