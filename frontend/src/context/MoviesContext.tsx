import { createContext, useContext, useState, useEffect } from "react";
import type { movie } from "../types/types";
import { useAuth } from "./AuthContext";

interface MoviesContextType {
  movies: movie[],
  isLoading: boolean,
  error: string,
  getMovies: (category: number | null) => Promise<void>,
  saveMovie: (movie: movie | Partial<movie>, action: string) => Promise<void>,
  deleteMovie: (id: number) => Promise<void>;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export const MovieProvider = ({children}: {children: React.ReactNode}) => {
  const [movies, setMovies] = useState<movie[]>([]);
  const { token } = useAuth();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

    const getMovies = async (category: number | null) => {
      setLoading(true);
      setError('');
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
        setMovies(data);
      }
      catch (err: any) {
        setError(err instanceof Error ? err.message : String(err) )
      }
      finally {
        setLoading(false);
      }
    }

    const deleteMovie = async (id: number) => {
      setLoading(true);
      setError('');
      try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/api/movies/${id}`);
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
        })
        if(!res.ok) throw new Error('Delete failed');
        const data = await res.json();
        console.log('data', data)

      } catch (err) {
        console.log('err', err);
        setError(err instanceof Error ? err.message : String(err) )
      } finally {
          setLoading(false);
      }
    }

    const saveMovie = async(movie: movie | Partial<movie>, action: string) => {
      setLoading(true);
      setError('');
      try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/api/movies`);
        if (action === 'edit') url.pathname += `/${movie.id}`;

        const res = await fetch(url, {
          method: action === 'add' ? 'POST' : 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(movie)
        });

        if(!res.ok) throw new Error('Failed to save movie');
        const data = await res.json();
    }
    catch (err: any) {
      console.log('err', err);
      setError(err instanceof Error ? err.message : String(err) )
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <MoviesContext.Provider value={{movies, isLoading, error, getMovies, saveMovie, deleteMovie }}>
      {children}
    </MoviesContext.Provider>
  )
}

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("Movie provider error");
  return ctx;
}