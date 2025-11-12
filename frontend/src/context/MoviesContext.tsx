import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
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
  setError: (error: string | null) => void;
  setActiveCategory: (id: number) => void;
  setStatus: (status: number) => void;
  setSortBy: (sort: SortOption) => void;
  setRangeFrom: Dispatch<SetStateAction<number>>;
  setRangeTo: Dispatch<SetStateAction<number>>;
  getMovies: (from: number, to: number, category?: number, sortBy?: SortOption, status?: number) => Promise<{ success: boolean; data: movie[] }>,
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

      const result = await res.json();
      const moviesData: movie[] = result.data || [];
      console.log('result context', result, moviesData)
      setMovies((prev) => from === 0 ? moviesData : [...prev, ...moviesData]);
      return { success: true, data: moviesData };
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
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

      const data: movie = await res.json();
      return {success: true, movie: data}
    } catch (err: any) {
      let errorMessage: string;
      switch (err.code) {
        case "DUPLICATE_MOVIE":
          errorMessage = "is already in your list.";
          break;
        case "MISSING_TITLE":
          errorMessage = "Title is required.";
          break;
        case "MISSING_ID":
          errorMessage = "ID is required.";
          break;
        case "NOT_FOUND":
          errorMessage = "Movie not found.";
          break;
        case "INTERNAL_ERROR":
          errorMessage = "Something went wrong while saving the movie.";
          break;
        default:
          errorMessage = err.message || "Unknown error saving movie.";
      }
      setError(errorMessage);
      return {success: false, error: errorMessage}
    } finally {
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

      if (!res.ok) await handleApiError(res, "delete movie");

      const data: movie = await res.json();
      return {success: true, movie: data}
    } catch (err: any) {
      let errorMessage: string;
      switch (err.code) {
        case "MISSING_ID":
          errorMessage = "ID is required.";
          break;
        case "INTERNAL_ERROR":
          errorMessage = "Unable to delete movie at this time.";
          break;
        default:
          errorMessage = err.message || "Unknown error deleting movie.";
      }
      setError(errorMessage);
      return {success: false, error: errorMessage}
    } finally {
      setLoading(false);
    }
  }

  return (
    <MoviesContext.Provider value={{movies, isLoading, error, activeCategory, status, sortBy, rangeFrom, rangeTo, setError, setActiveCategory, setStatus, setSortBy, setRangeFrom, setRangeTo, getMovies, saveMovie, deleteMovie }}>
      {children}
    </MoviesContext.Provider>
  )
}

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("Movie provider error");
  return ctx;
}