import { createContext, useContext, useState } from "react";
import { handleApiError } from "../utils/utils";
import type { movie, SortOption } from "../types/types";
import { useAuth } from "./AuthContext";

interface MoviesContextType {
  movies: movie[],
  isLoading: boolean,
  error: string | null,
  activeCategory: number | null,
  status: number,
  sortBy: SortOption,
  rangeFrom: number,
  rangeTo: number,
  setActiveCategory: (id: number) => void;
  setStatus: (status: number) => void;
  setSortBy: (sort: SortOption) => void;
  setRangeFrom: (rangeFrom: number) => void;
  setRangeTo: (rangeTo: number) => void;
  getMovies: (from: number, to: number, category?: number, sortBy?: SortOption, status?: number) => Promise<movie[]>,
  saveMovie: (movie: movie | Partial<movie>, action: string) => Promise<{success: boolean, movie?: movie, error?: string | null}>,
  deleteMovie: (id: number) => Promise<{success: boolean, movie?: movie, error?: string}>;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export const MovieProvider = ({children}: {children: React.ReactNode}) => {
  const [movies, setMovies] = useState<movie[]>([]);
  const { token } = useAuth();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  const [status, setStatus] = useState<number>(1);
  const [rangeFrom, setRangeFrom] = useState<number>(0);
  const [rangeTo, setRangeTo] = useState<number>(11);
  const [sortBy, setSortBy] = useState<SortOption>({
    key: 'title',
    value: 1,
    label: 'Title A–Z',
    ascending: true,
  });

  const getMovies = async (from = rangeFrom, to = rangeTo, category = activeCategory, sortOption = sortBy, movieStatus = status) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL (`${import.meta.env.VITE_API_URL}/api/movies?from=${String(from)}&to=${String(to)}`);
      if (category) url.searchParams.append('category', String(category));
      if (sortOption) {
        url.searchParams.append('sortBy', sortOption.key);
        url.searchParams.append('asc', String(sortOption.ascending));
      }
      if (movieStatus) url.searchParams.append('status', String(movieStatus));

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) await handleApiError(res, "load movies");

      const data: movie[] = await res.json();
      setMovies((prev) => from === 0 ? data : [...prev, ...data]);
      return data;
    }
    catch (err: any) {
      setError(err instanceof Error ? err.message : String(err))
    }
    finally {
      setLoading(false);
    }
  }

  const saveMovie = async(movie: movie | Partial<movie>, action: string): Promise<{ success: boolean; movie?: movie, error?:string}> => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/movies`);
      if (action === 'edit') url.pathname += `/${movie.id}`;

      const res = await fetch(url, {
        method: action === 'add' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(movie)
      });

      if (!res.ok) await handleApiError(res, "save movie");

      const data = await res.json();
      return {success: true, movie: data}
    } catch (err: any) {
      console.error('ERR context', err);

      let errorMessage: string;
      switch (err.code) {
        case "DUPLICATE_MOVIE":
          errorMessage = "That movie is already in your list.";
          break;
        case "INTERNAL_ERROR":
          errorMessage = "Something went wrong while saving the movie.";
          break;
        default:
          errorMessage = err.message || "Unknown error saving movie.";
      }
      setError(errorMessage);
      return {success: false, error: errorMessage}
    }
    finally {
      setLoading(false);
    }
  }

  const deleteMovie = async (id: number): Promise<{ success: boolean; movie?: movie, error?: string | null }> => {
    setLoading(true);
    setError(null);
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

      if (!res.ok) await handleApiError(res, "delete movie");
      return {success: true, movie: data}
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return {success: false, error: message}
    } finally {
        setLoading(false);
    }
  }

  return (
    <MoviesContext.Provider value={{movies, isLoading, error, activeCategory, status, sortBy, rangeFrom, rangeTo, setActiveCategory, setStatus, setSortBy, setRangeFrom, setRangeTo, getMovies, saveMovie, deleteMovie }}>
      {children}
    </MoviesContext.Provider>
  )
}

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("Movie provider error");
  return ctx;
}