import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import styled from "styled-components";
import { FloppyDiskIcon, PlusIcon, XCircleIcon } from '@phosphor-icons/react';

import { useCategories } from "../context/CategoriesContext";
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
  const { isLoading, categories, getCategories, saveCategory } = useCategories();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isAdding, setAdding] = useState<boolean>(false);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  useEffect(() => {
    getCategories();
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const newCategory: Partial<category> | category =
    isEditing ? {name: editingValue, id: currentlyEditing} : {name, user_id: userId}
    const { success, error: saveError } = await saveCategory(newCategory)

    if(!success) {
      setError(saveError ?? 'unknown error');
      return;
    }
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
      {isLoading ? <Loader size='large' /> : (
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
                    <button className='slimmer teal' type="button" onClick={() => setEditing(false)}>Cancel <XCircleIcon size={24} /></button>
                    <button className='slimmer' type='submit' onClick={handleSave}>Save <FloppyDiskIcon size={24} /></button>
                  </div>
                  :
                  <button className='slimmer' type="button" onClick={() => handleEdit(each.id, each.name)}>Edit</button>
                )
                }
              </CategoryItem>
            )}
          </CategoryList>
          {!isAdding &&
            <button style={{margin: 'auto'}} className='slimmer teal' onClick={() => setAdding(true)}><PlusIcon size={24} /> Add Category</button>
          }
          {isAdding &&
          <form onSubmit={handleSave}>
            <label htmlFor="name">Category Name</label>
            <input className="light" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%'}}>
              <button className='slimmer teal' type="button" onClick={() => setAdding(false)}>Cancel <XCircleIcon size={24} /></button>
              <button className='slimmer' type="submit">Save <FloppyDiskIcon size={24} /></button>
            </div>
          </form>
          }
        </>
      )
      }
    </>
  )
}

export default CategoryForm;