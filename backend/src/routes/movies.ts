import { Router } from "express";
import { supabase } from "../services/supabaseClient";
import type { movie } from "../../../frontend/src/types/types";

const movieRouter = Router();

movieRouter.post('/', async (req, res ) => {
  try {
    const movieItem: movie = req.body;

    if (!movieItem.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('movies')
      .insert([movieItem])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (error: any) {
    res.status(500).json({error: error.message})
  }
})

movieRouter.patch('/:id', async (req, res ) => {
  try {
    const { id } = req.params;
    const movieItem: Partial<movie> = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const { data, error } = await supabase
      .from('movies')
      .update([movieItem])
      .eq('id', id)
      .select();

    if (error) throw error;
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(201).json(data[0]);

  } catch (error: any) {
    res.status(500).json({error: error.message})
  }
})

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

    const category = _req.query.category as number | undefined;

    let query = supabase
      .from('movies')
      .select('*')
      .eq('user_id', user.id)

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
})

export default movieRouter;