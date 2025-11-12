import { useState, useEffect } from "react";
import styled from "styled-components";
import { FloppyDiskIcon, PlusIcon, XCircleIcon } from '@phosphor-icons/react';
import { useCategories,  } from "../context/CategoriesContext";
import { useToast } from '../context/ToastContext';
import type { category } from "../types/types";
import Loader from "./Loader";

interface CategoryFormProps {
  onClose: () =>  void;
}

const CategoryList = styled.ul`
  padding: 0 20px;
  list-style: none;
  margin-bottom: 40px;
`

const CategoryItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
  border-bottom: 2px solid black;
  padding: 4px 0;
`

function CategoryForm({onClose}: CategoryFormProps) {
  const { isLoading, categories, getCategories, saveCategory, categoryError, setCategoryError } = useCategories();
  const { showToast } = useToast();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setAdding] = useState<boolean>(false);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const [currentlyEditing, setCurrentlyEditing] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  useEffect(() => {
    getCategories();
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCategoryError(null);
    setSaving(true);
    if((!isEditing && !name) || (isEditing && !editingValue)) {
      setError('Category name is required');
      setSaving(false);
      return;
    }
    const newCategory: Partial<category> =
    isEditing ? {name: editingValue, id: currentlyEditing} : {name}
    const { success, error: saveError } = await saveCategory(newCategory)

    if(!success) {
      setError(saveError ?? 'unknown error');
      setSaving(false);
      showToast(
        saveError
        ? saveError
        : "Category could not be saved.",
        false
      );
      return;
    }
    showToast(
      isEditing
      ? 'Category updated successfully'
      : 'Category added successfully',
      true
    );
    setSaving(false);
    await onClose();
    getCategories(true);
  }

  const handleEdit = (id: number , name: string) => {
    setEditing(true);
    setCurrentlyEditing(id);
    setEditingValue(name);
  }

  return (
    <>
      {isLoading && !isSaving ? <Loader size='large' /> : (
        <>
          <CategoryList>
            {categories.map((each) =>
              <CategoryItem key={each.id}>
                {isEditing && currentlyEditing === each.id ?
                    <>
                      <label htmlFor="editName">Edit Name</label>
                      <input style={{margin: '0'}}className="light" id="editName" type="text" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
                    </>
                 :each.name}

                {each.id !== 1 && (
                  isEditing && currentlyEditing === each.id ?
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%'}}>
                    <button className='slimmer teal' type="button"
                      onClick={() => {
                        setEditing(false);
                        setError(null);
                        setCategoryError(null);
                      }
                      }>
                      Cancel <XCircleIcon size={24} /></button>
                    <button className='slimmer' type='submit' onClick={handleSave} >
                      {isSaving ? 'Saving' : 'Save'}
                      {isSaving ?
                        <Loader size='small' />
                        :
                        <FloppyDiskIcon size={24} />
                        }
                    </button>
                  </div>
                  :
                  <button className='slimmer' type="button" onClick={() => handleEdit(each.id, each.name)}>Edit</button>
                )
                }

              </CategoryItem>
            )}
            {(categoryError || error) && !isAdding &&  (
              <p style={{color: 'red', textAlign: 'center'}}>{categoryError ? categoryError : error}</p>
            )}
          </CategoryList>
          {!isAdding && !isEditing &&
            <button style={{margin: 'auto'}} className='slimmer teal'
              onClick={() => {
                setAdding(true);
                setError(null);
                setCategoryError(null);
                setEditing(false);

              }
            }>
              Add Category
              <PlusIcon size={24} />
            </button>
          }
          {isAdding && !isEditing &&
          <form style={{padding: '0 20px'}} onSubmit={handleSave}>
            <label htmlFor="name">Category Name</label>
            <input className="light" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%'}}>
              <button className='slimmer teal' type="button"
                onClick={() => {
                  setAdding(false);
                  setError(null);
                  setCategoryError(null);
                  setName('');
                }
                }>
                  Cancel <XCircleIcon size={24} />
                </button>
              <button className='slimmer' type='submit'>
                {isSaving ? 'Saving' : 'Save'}
                {isSaving ?
                  <Loader size='small' />
                  :
                  <FloppyDiskIcon size={24} />
                }
              </button>
            </div>
            {categoryError || error && (
              <p style={{color: 'red', textAlign: 'center'}}>{categoryError ? categoryError : error}</p>
            )}
          </form>
          }
        </>
      )
      }
    </>
  )
}

export default CategoryForm;