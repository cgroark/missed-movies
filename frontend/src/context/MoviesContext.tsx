import { createContext, useContext, useState } from "react";
import type { movie, SortOption } from "../types/types";
import { useAuth } from "./AuthContext";

interface MoviesContextType {
  movies: movie[],
  isLoading: boolean,
  error: string,
  getMovies: (category: number | null, sortBy?: SortOption) => Promise<void>,
  saveMovie: (movie: movie | Partial<movie>, action: string) => Promise<{success: boolean, error?: string}>,
  deleteMovie: (id: number) => Promise<{success: boolean, error?: string}>;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export const MovieProvider = ({children}: {children: React.ReactNode}) => {
  const [movies, setMovies] = useState<movie[]>([]);
  const { token } = useAuth();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getMovies = async (category: number | null, sortBy?: SortOption | null) => {
    setLoading(true);
    setError('');
    try {
      const url = new URL (`${import.meta.env.VITE_API_URL}/api/movies`);
      if (category) url.searchParams.append('category', String(category));
      if (sortBy) {
        console.log(sortBy);
        url.searchParams.append('sortBy', sortBy.key);
        url.searchParams.append('asc', String(sortBy.ascending));
      }
      console.log('URL', url)
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('RES get', res)
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

  const deleteMovie = async (id: number): Promise<{ success: boolean; error?: string }> => {
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

      const data = await res.json().catch(() => ({}));
      if(!res.ok) {
        const backendError = data?.error || res.statusText || 'Unknown error';
        const backendCode = data?.code;

        if (backendCode === 'INTERNAL_ERROR') {
          throw new Error('That movie is already in your list.');
        } else if (backendCode === 'MISSING_ID') {
          throw new Error('Movie is missing ID');
        } else {
          throw new Error(backendError);
        }
      };
      return {success: true}
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return {success: false, error: message}
    } finally {
        setLoading(false);
    }
  }

  const saveMovie = async(movie: movie | Partial<movie>, action: string): Promise<{ success: boolean; error?:string}> => {
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

      const data = await res.json().catch(() => ({}));

      if(!res.ok) {
        const backendError = data?.error || res.statusText || 'Unknown error';
        const backendCode = data?.code;

        if (backendCode === 'DUPLICATE_MOVIE') {
          throw new Error('That movie is already in your list.');
        } else if (backendCode === 'MISSING_TITLE') {
          throw new Error('A title is required before saving.');
        } else if (backendCode === 'MISSING_ID') {
          throw new Error('Movie is missing ID');
        } else if (backendCode === 'NOT FOUND') {
          throw new Error('Movie not found.');
        }
        else {
          throw new Error(backendError);
        }
      };
      return {success: true}
    }
    catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return {success: false, error: message}
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