import { useState, useEffect } from 'react';
import type { movie, category } from '../../types/types';
import {
  FloppyDiskIcon,
  FileVideoIcon,
  FilmSlateIcon,
  TrashIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import { useMovies } from '../../context/MoviesContext';
import { useCategories } from '../../context/CategoriesContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';
import styled from 'styled-components';
import useFieldValidation from '../../hooks/useFieldValidation';
import ConfirmDelete from '../ui/ConfirmDelete';
import ActionButton from '../ui/ActionButton';
import { FormActions, FormError, FormHint, DangerButton, FieldError } from '../ui/FormStyles';

const AddCategoryButton = styled.button`
  &&&& {
    font-size: 0.8rem;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    color: black;
    text-decoration: none;
    margin: -12px 0 20px auto;

    &:hover {
      background: transparent;
    }

    width: fit-content;
  }
`;

interface FormProps {
  currentMovie: movie | null;
  action: 'add' | 'edit';
  onClose: () => void;
  onConfirmationChange: (open: boolean) => void;
  onAddCategory: () => void;
}

function MovieForm({
  currentMovie,
  action,
  onClose,
  onAddCategory,
  onConfirmationChange,
}: FormProps) {
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
  const { fieldErrors, clearField, validate } = useFieldValidation();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [category, setCategory] = useState<number | ''>('');
  const [movieStatus, setMovieStatus] = useState<number | ''>('');
  const [pendingAction, setPendingAction] = useState<'save' | 'delete' | null>(null);
  const [feError, setFeError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    if (isLoading) return;
    setFeError(null);
    setError(null);
    if (!currentMovie) return;
    if (
      !validate([
        { id: 'category', label: 'Category', value: category },
        { id: 'status', label: 'Status', value: movieStatus },
      ])
    )
      return;
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
    setPendingAction('save');
    const { success, error: saveError } = await saveMovie(movieItem);
    setPendingAction(null);

    if (!success) {
      setFeError(saveError ? `${currentMovie?.title} ${saveError}` : 'unknown error');
      showToast(
        saveError
          ? `${currentMovie?.title} ${saveError}`
          : `${currentMovie?.title} could not be saved.`,
        false
      );
      if (saveError?.includes('session has expired')) {
        navigate('/login');
      }
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

  const changeDeleteConfirmation = (open: boolean) => {
    setConfirmDelete(open);
    onConfirmationChange(open);
  };

  const handleDelete = async () => {
    if (!currentMovie?.id || isLoading)
      return { success: false, error: 'Unable to delete this movie right now.' };

    setPendingAction('delete');
    const { success, error: deleteError } = await deleteMovie(currentMovie.id);
    setPendingAction(null);

    if (!success) {
      setFeError(deleteError ?? 'unknown error');
      if (deleteError?.includes('session has expired')) {
        navigate('/login');
      }
      return { success: false, error: deleteError };
    }
    showToast(`${currentMovie?.title} has been deleted`, true);
    await onClose();
    getMovies(activeCategory ?? undefined, sortBy, status);
    return { success: true };
  };

  return (
    <>
      <div>
        <form noValidate onSubmit={handleSave} aria-busy={pendingAction !== null}>
          <FormHint>Choose a category and watch status for your collection.</FormHint>
          <div>
            <label htmlFor="category">
              <FileVideoIcon size={24} />
              Category
            </label>
            <select
              required
              name="category"
              id="category"
              value={category}
              aria-invalid={Boolean(fieldErrors.category)}
              aria-describedby={fieldErrors.category ? 'category-error' : undefined}
              onFocus={() => clearField('category')}
              onChange={e => {
                setCategory(Number(e.target.value));
                clearField('category');
                setFeError(null);
                setError(null);
              }}
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
            {fieldErrors.category && (
              <FieldError id="category-error">{fieldErrors.category}</FieldError>
            )}
            <AddCategoryButton className="no-hover" type="button" onClick={onAddCategory}>
              Add category
              <PlusIcon size={16} />
            </AddCategoryButton>
          </div>
          <div>
            <label htmlFor="status">
              <FilmSlateIcon size={24} />
              Status
            </label>
            <select
              required
              name="status"
              id="status"
              value={movieStatus}
              aria-invalid={Boolean(fieldErrors.status)}
              aria-describedby={fieldErrors.status ? 'status-error' : undefined}
              onFocus={() => clearField('status')}
              onChange={e => {
                setMovieStatus(Number(e.target.value));
                clearField('status');
                setFeError(null);
                setError(null);
              }}
            >
              <option disabled value="">
                Select Status
              </option>
              <option value="1">Want to watch</option>
              <option value="2">Already watched</option>
            </select>
          </div>
          {fieldErrors.status && <FieldError id="status-error">{fieldErrors.status}</FieldError>}
          {(feError || error) && <FormError>{feError || error}</FormError>}
          <FormActions>
            {action === 'edit' && (
              <DangerButton
                disabled={isLoading}
                className="slimmer"
                type="button"
                onClick={() => changeDeleteConfirmation(true)}
              >
                {pendingAction === 'delete' ? 'Deleting' : 'Delete'}
                <TrashIcon size={20} />
              </DangerButton>
            )}
            <ActionButton $surface="light" disabled={isLoading} type="submit">
              {pendingAction === 'save'
                ? 'Saving'
                : action === 'add'
                  ? 'Add movie'
                  : 'Save'}
              {pendingAction === 'save' ? <Loader size="small" /> : <FloppyDiskIcon size={24} />}
            </ActionButton>
          </FormActions>
        </form>
      </div>
      <ConfirmDelete
        open={confirmDelete}
        onOpenChange={changeDeleteConfirmation}
        title="Delete movie?"
        description={`Are you sure you want to delete “${currentMovie?.title}” from your movies? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default MovieForm;
