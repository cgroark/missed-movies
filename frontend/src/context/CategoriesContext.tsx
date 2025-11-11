import { createContext, useContext, useState } from "react";
import { useAuth } from '../context/AuthContext';
import type { category } from "../types/types";

interface CategoryContextType {
  categories: category[];
  isLoading: boolean;
  error: string | null;
  getCategories: (force?: boolean) => Promise<void>;
  saveCategory: (category: Partial<category>) => Promise<{success: boolean, error?: string}>
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<category[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getCategories = async (force = false) => {
    if (!force && categories.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load categories");
      const data: category[] = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (category: Partial<category>) => {
    setLoading(true);
    setError(null);
    console.log("FE CAT", category)
    let isEditing = category.id;
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (isEditing) url.pathname += `/${category.id}`;

      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category)
      });

      if(!res.ok) throw new Error('Category error');
      const data = await res.json().catch(() => ({}));
      if(!res.ok) {
        const backendError = data?.error || res.statusText || 'Unknown error';
        // const backendCode = data?.code;
        throw new Error(backendError);
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
    <CategoryContext.Provider value={{ categories, isLoading, error, getCategories, saveCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be used within a CategoryProvider");
  return ctx;
};
