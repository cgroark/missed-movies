import { useState, useEffect } from "react";
import type { movie } from "../types/types";
import MovieList from "./MovieList";

function MyMovies() {
  const [myMovies, setMyMovies] = useState<movie[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(!res.ok) throw new Error('Failed to get your movies');
        const data: movie[] = await res.json();
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
  }, [])



  return (
    <>
      <h2>My Movies</h2>
      {isLoading && <p>'Loading...'</p>}
      {!isLoading && (
        myMovies.length ? <MovieList data={myMovies}/> : <p>No results for your search</p>
      )
      }
    </>
  )
}

export default MyMovies;