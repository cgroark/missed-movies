import { createContext, useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../utils/utils';
import type { category } from '../types/types';

interface CategoryContextType {
  categories: category[];
  isLoading: boolean;
  categoryError: string | null;
  setCategoryError: (categoryError: string | null) => void;
  getCategories: (force?: boolean) => Promise<void>;
  saveCategory: (
    category: Partial<category>
  ) => Promise<{ success: boolean; category?: category; error?: string }>;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

const BASE_URL = import.meta.env.VITE_API_URL || '';


export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<category[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const { token } = useAuth();


  const getCategories = async (force = false) => {
    if (!force && categories.length > 0) return;
    setLoading(true);
    setCategoryError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) await handleApiError(res, 'load categories');

      const result = await res.json();
      const data: category[] = result.data;
      setCategories(data);
    } catch (err: any) {
      setCategoryError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (category: Partial<category>) => {
    setLoading(true);
    setCategoryError(null);
    let isEditing = !!category.id;
    try {
      const url = new URL(`${BASE_URL}/api/categories`);
      if (isEditing) url.pathname += `/${category.id}`;

      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) await handleApiError(res, 'save category');

      const data = await res.json();
      return { success: true, category: data };
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setCategoryError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        categoryError,
        setCategoryError,
        getCategories,
        saveCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoryProvider');
  return ctx;
};
