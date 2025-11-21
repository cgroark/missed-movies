import { useState, useEffect } from 'react';
import type { movie, category } from '../types/types';
import { FloppyDiskIcon, FileVideoIcon, FilmSlateIcon, TrashIcon } from '@phosphor-icons/react';
import { useMovies } from '../context/MoviesContext';
import { useCategories } from '../context/CategoriesContext';
import { useToast } from '../context/ToastContext';
import '../index.css';
import Loader from './Loader';

interface FormProps {
  currentMovie: movie | null;
  action: 'add' | 'edit';
  onClose: () => void;
}

function MovieForm({ currentMovie, action, onClose }: FormProps) {
  const {
    isLoading,
    error,
    setError,
    getMovies,
    saveMovie,
    deleteMovie,
    activeCategory,
    status,
    sortBy,
  } = useMovies();
  const { categories, getCategories } = useCategories();
  const { showToast } = useToast();
  const [category, setCategory] = useState<number | ''>('');
  const [movieStatus, setMovieStatus] = useState<number | ''>('');
  const [feError, setFeError] = useState<string | null>(null);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setError(null);
    if (currentMovie?.status) {
      setMovieStatus(currentMovie.status);
      setCategory(currentMovie.category);
    }
  }, [currentMovie]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeError(null);
    setError(null);
    if (!currentMovie) return;
    if (!category || !movieStatus) {
      setFeError('Status and Category are required');
      return;
    }
    const movieItem: Partial<movie> =
      action === 'edit'
        ? {
            id: currentMovie.id,
            category,
            status: movieStatus,
          }
        : {
            movie_id: currentMovie.id,
            title: currentMovie.title,
            release_date: currentMovie.release_date,
            poster_path: currentMovie.poster_path,
            overview: currentMovie.overview,
            genre_ids: currentMovie.genre_ids,
            status: movieStatus,
            category,
          };
    const { success, error: saveError } = await saveMovie(movieItem);

    if (!success) {
      setFeError(saveError ? `${currentMovie?.title} ${saveError}` : 'unknown error');
      showToast(
        saveError
          ? `${currentMovie?.title} ${saveError}`
          : `${currentMovie?.title} could not be saved.`,
        false
      );
      return;
    }

    showToast(
      action === 'edit'
        ? `${currentMovie?.title} updated successfully`
        : `${currentMovie?.title} added to your movies`,
      true
    );
    await onClose();
    getMovies(activeCategory ?? undefined, sortBy, status);
  };

  const handleDelete = async () => {
    if (!currentMovie?.id) return;

    const { success, error: deleteError } = await deleteMovie(currentMovie.id);

    if (!success) {
      setFeError(deleteError ?? 'unknown error');
      return;
    }
    showToast(`${currentMovie?.title} has been deleted`, true);
    await onClose();
    getMovies(activeCategory ?? undefined, sortBy, status);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="category">
              <FileVideoIcon size={24} />
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(Number(e.target.value))}
            >
              <option disabled value="">
                Select Category
              </option>
              {categories
                .filter(each => each.id !== null)
                .map((each: category) => (
                  <option key={each.id} value={each.id!}>
                    {each.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="status">
              <FilmSlateIcon size={24} />
              Status
            </label>
            <select
              id="status"
              value={movieStatus}
              onChange={e => setMovieStatus(Number(e.target.value))}
            >
              <option disabled value="">
                Select Status
              </option>
              <option value="1">Want to watch</option>
              <option value="2">Already watched</option>
            </select>
          </div>
          {(feError || error) && <p className="error">{feError || error}</p>}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {action === 'edit' && (
              <button className="teal slimmer" type="button" onClick={handleDelete}>
                {isLoading ? 'Deleting' : 'Delete'}
                <TrashIcon size={24} />
              </button>
            )}
            <button className="slimmer" type="submit">
              {isLoading ? 'Saving' : 'Save'}
              {isLoading ? <Loader size="small" /> : <FloppyDiskIcon size={24} />}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MovieForm;
