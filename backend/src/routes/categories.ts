import { Router } from "express";
import { supabase } from "../services/supabaseClient";
import type { category } from "../../../frontend/src/types/types";


const categoryRouter = Router();

categoryRouter.get('/', async (_req, res) => {
  try {
    const authHeader = _req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.substring("Bearer ".length);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Your session has expired. Please log in again." });
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${user.id},id.eq.1`);

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
})

categoryRouter.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.substring("Bearer ".length);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Your session has expired. Please log in again." });
    }

    const categoryItem: category = {...req.body, user_id: user.id};

    if (!categoryItem.name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([categoryItem])
      .select()

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (err: any) {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      error: err.message || 'Something went wrong while saving the category.',
    });
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
        error: 'Category not found',
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