import { Router } from "express";
import { supabase } from "../services/supabaseClient";
import type { category } from "../../../frontend/src/types/types";


const categoryRouter = Router();

categoryRouter.get('/', async (_req, res) => {
  try {
    const authHeader = _req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { data, error } = await supabase.rpc('get_user_categories', { uid: user.id });
    if (error) throw error;
      res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
})

categoryRouter.post("/", async (_req, res) => {
  try {
     const authHeader = _req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { name } = _req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const { data: newCategory, error: insertError } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();

    if (insertError || !newCategory) {
      throw insertError || new Error("Failed to insert new category");
    }

    const { error: updateError } = await supabase.rpc("append_category_to_profile", {
      uid: user.id,
      new_category_id: newCategory.id,
    });

    if (updateError) {
      throw updateError;
    }

    res.status(201).json({
      message: "Category created and added to profile",
      category: newCategory,
    });
  } catch (err: any) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: err.message || "Unexpected error" });
  }
});

categoryRouter.patch('/:id', async (req, res ) => {
  try {
    const { id } = req.params;
    const categoryItem: Partial<category> = req.body;

    if (!id) {
      return res.status(400).json({
        code: 'MISSING_ID',
        error: 'ID is required',
      });
    }

    const { data, error } = await supabase
      .from('categories')
      .update([categoryItem])
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        error: 'Movie not found',
      });
    }
    res.status(201).json(data[0]);

  } catch (err: any) {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      error: err.message || 'Error saving this category.',
    });
  }
});


export default categoryRouter;