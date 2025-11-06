import { Router } from "express";
import { supabase } from "../services/supabaseClient";
import type { movie } from "../../../frontend/src/types/types";

const movieRouter = Router();

movieRouter.post('/', async (req, res ) => {
  try {
    const movieItem: movie = req.body;

    if (!movieItem.title) {
      return res.status(400).json({
        code: 'MISSING_TITLE',
        error: 'Title is required',
      });
    }

    const { data, error } = await supabase
      .from('movies')
      .insert([movieItem])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (err: any) {
    if (err.message?.includes('duplicate key value')) {
      return res.status(409).json({
        code: 'DUPLICATE_MOVIE',
        error: 'This movie already exists in your list.',
      });
    }

    res.status(500).json({
      code: 'INTERNAL_ERROR',
      error: err.message || 'Something went wrong while saving the movie.',
    });
  }
});

movieRouter.patch('/:id', async (req, res ) => {
  try {
    const { id } = req.params;
    const movieItem: Partial<movie> = req.body;

    if (!id) {
      return res.status(400).json({
        code: 'MISSING_ID',
        error: 'ID is required',
      });
    }

    const { data, error } = await supabase
      .from('movies')
      .update([movieItem])
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
      error: err.message || 'Error saving this movie.',
    });
  }
});

movieRouter.get('/', async (_req, res) => {
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

    const { category, sortBy, asc, status, from, to } = _req.query
    const direction = asc === 'true' ? { ascending: true } : { ascending: false };

    let query = supabase
      .from('movies')
      .select('*')
      .eq('user_id', user.id)
      .order('status', { ascending: true })
      .order(String(sortBy), direction)
      .range(Number(from), Number(to))

    if (category) {
      query = query.eq('category', category);
    }

    if (status) {
      query.eq('status', status)
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

movieRouter.delete('/:id', async (req, res ) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        code: 'MISSING_ID',
        error: 'Id is required',
      });
    }

    const { data, error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (err: any) {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      error: err.message || 'Unable to delete movie at this time.',
    });
  }
})

export default movieRouter;