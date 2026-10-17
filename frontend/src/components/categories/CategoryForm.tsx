import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FloppyDiskIcon, PlusIcon, XCircleIcon } from '@phosphor-icons/react';
import { useCategories } from '../../context/CategoriesContext';
import { useToast } from '../../context/ToastContext';
import type { category } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';
import { FormActions, FormError, FormHint, SecondaryButton } from '../ui/FormStyles';

interface CategoryFormProps {
  onClose: () => void;
  addOnly?: boolean;
}

const CategoryList = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0 0 24px;
  max-height: 40dvh;
  overflow-y: auto;
`;

const CategoryItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  border: 1px solid rgba(123, 94, 166, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  padding: 12px;
  overflow-wrap: anywhere;
`;

function CategoryForm({ onClose, addOnly = false }: CategoryFormProps) {
  const { isLoading, categories, getCategories, saveCategory, categoryError, setCategoryError } =
    useCategories();
  const { showToast } = useToast();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setAdding] = useState<boolean>(addOnly);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCategoryError(null);
    if (isSaving) return;
    setSaving(true);
    if ((!isEditing && !name.trim()) || (isEditing && !editingValue.trim())) {
      setError('Category name is required');
      setSaving(false);
      return;
    }
    const newCategory: Partial<category> = isEditing
      ? { name: editingValue.trim(), id: currentlyEditing }
      : { name: name.trim() };
    const { success, error: saveError } = await saveCategory(newCategory);

    if (!success) {
      setError(saveError ?? 'unknown error');
      setSaving(false);
      showToast(saveError || 'Category could not be saved.', false);
      if (saveError?.includes('session has expired')) {
        navigate('/login');
      }
      return;
    }
    showToast(isEditing ? 'Category updated successfully' : 'Category added successfully', true);
    await getCategories(true);
    setSaving(false);
    onClose();
  };

  const handleEdit = (id: number, name: string) => {
    setEditing(true);
    setCurrentlyEditing(id);
    setEditingValue(name);
  };

  return (
    <>
      {isLoading && !isSaving ? (
        <Loader size="large" />
      ) : (
        <>
          {!addOnly && (
            <CategoryList>
              {categories.map(each => (
                <CategoryItem key={each.id}>
                  {isEditing && currentlyEditing === each.id ? (
                    <>
                      <label htmlFor="editName">Edit Name</label>
                      <input
                        style={{ margin: '0' }}
                        className="light"
                        id="editName"
                        type="text"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                      />
                    </>
                  ) : (
                    each.name
                  )}

                  {each.id !== 1 &&
                    (isEditing && currentlyEditing === each.id ? (
                      <FormActions>
                        <SecondaryButton
                          disabled={isSaving}
                          className="slimmer"
                          type="button"
                          onClick={() => {
                            setEditing(false);
                            setError(null);
                            setCategoryError(null);
                          }}
                        >
                          Cancel <XCircleIcon size={20} />
                        </SecondaryButton>
                        <button
                          disabled={isSaving}
                          className="slimmer"
                          type="submit"
                          onClick={handleSave}
                        >
                          {isSaving ? 'Saving' : 'Save'}
                          {isSaving ? <Loader size="small" /> : <FloppyDiskIcon size={24} />}
                        </button>
                      </FormActions>
                    ) : (
                      <button
                        className="slimmer"
                        type="button"
                        onClick={() => each.id != null && handleEdit(each.id, each.name)}
                      >
                        Edit
                      </button>
                    ))}
                </CategoryItem>
              ))}
            </CategoryList>
          )}
          {(categoryError || error) && !isAdding && <FormError>{categoryError || error}</FormError>}
          {!isAdding && !isEditing && (
            <button
              style={{ margin: 'auto' }}
              className="slimmer teal"
              onClick={() => {
                setAdding(true);
                setError(null);
                setCategoryError(null);
                setEditing(false);
              }}
            >
              Add Category
              <PlusIcon size={24} />
            </button>
          )}
          {isAdding && !isEditing && (
            <form onSubmit={handleSave} aria-busy={isSaving}>
              <FormHint>Give your category a name that’s easy to find later.</FormHint>
              <label htmlFor="name">Category Name</label>
              <input
                className="light"
                placeholder="e.g. Weekend watchlist"
                autoComplete="off"
                required
                name="categoryName"
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <FormActions>
                <SecondaryButton
                  disabled={isSaving}
                  className="slimmer"
                  type="button"
                  onClick={() => {
                    if (addOnly) {
                      onClose();
                      return;
                    }
                    setAdding(false);
                    setError(null);
                    setCategoryError(null);
                    setName('');
                  }}
                >
                  Cancel <XCircleIcon size={20} />
                </SecondaryButton>
                <button disabled={isSaving} className="slimmer" type="submit">
                  {isSaving ? 'Saving' : 'Save'}
                  {isSaving ? <Loader size="small" /> : <FloppyDiskIcon size={24} />}
                </button>
              </FormActions>
              {(categoryError || error) && (
                <FormError>{categoryError ? categoryError : error}</FormError>
              )}
            </form>
          )}
        </>
      )}
    </>
  );
}

export default CategoryForm;
