import { useState, useEffect } from "react";
import styled from "styled-components";
import { PlusIcon} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import type { category } from "../types/types";
import Loader from "./Loader";

const CategoryList = styled.ul`
  padding: 0 20px;
  list-style: none;
  margin-bottom: 40px;
`

const CategoryItem = styled.li`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
`

const Button = styled.button`
  background-color: var(--purple);
  font-size: 1rem;

  &.add {
    margin: auto;
    background-color: var(--teal);

    &:hover {
     background-color: var(--darkTeal);
    }
  }

  &:hover {
     background-color: var(--darkPurple);
  }
`

function CategoryForm() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<category[]>([]);
  const [name, setName] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isAdding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const getCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

          },
        });
        if(!res.ok) throw new Error('Category error');
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
          console.log('err', err);
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.target);
    const newCategory: Partial<category> = {name}
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory)
      });
      if(!res.ok) throw new Error('Category error');
      const data = await res.json();
      console.log("DATA back", data)
    } catch (err: any) {
        console.log('err', err);
    } finally {
      // setLoading(false);
    }

  }




  return (
    <>
      {isLoading ? <Loader size='large' /> : (
        <>
          <CategoryList>
            {categories.map((each) =>
              <CategoryItem key={each.id}>
                {each.name}
                {each.id !== 1 && <Button className='slimmer'>Edit</Button>}
              </CategoryItem>
            )}
          </CategoryList>
          <Button className='slimmer add' onClick={() => setAdding(true)}><PlusIcon size={24} /> Add Category</Button>
          {isAdding &&
          <form onSubmit={handleSave}>
            <label htmlFor="name">Category Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
            <button type="submit">Save</button>
          </form>
          }
        </>
      )
      }
    </>
  )
}

export default CategoryForm;