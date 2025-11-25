import { Router } from 'express';
import { supabase } from '../services/supabaseClient';
import type { movie } from '../types/types';
import { getUserFromRequest } from '../utils/utils';

const movieRouter = Router();

movieRouter.get('/', async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    // const user = await getUserFromRequest(_req, res);
    // if (!user) return;

    const { category, sortBy, asc, status } = _req.query;
    const validSortColumns = ['title', 'release_date'];
    const sortColumn =
      typeof sortBy === 'string' && validSortColumns.includes(sortBy)
        ? sortBy
    : 'title';

    const direction = asc === 'true' ? { ascending: true } : { ascending: false };

    let query = supabase
      .from('movies')
      .select('*')
      .eq('user_id', '326ab9be-9c24-4fb0-a035-b68786f958f1')
      .order('status', { ascending: true })
      .order(sortColumn, direction);

    if (category) {
      query = query.eq('category', category);
    }

    if (status) {
      query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      error: err.message || 'Something went wrong while saving the movie.',
    });
  }
});

movieRouter.post('/', async (req, res) => {
  try {
    // const user = await getUserFromRequest(req, res);
    // if (!user) return;

    const movieItem: movie = { ...req.body, user_id: '326ab9be-9c24-4fb0-a035-b68786f958f1' };

    if (!movieItem.title) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_TITLE',
        error: 'Title is required',
      });
    }

    const { data, error } = await supabase.from('movies').insert([movieItem]).select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data[0],
    });
  } catch (err: any) {
    if (err.message?.includes('duplicate key value')) {
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_MOVIE',
        error: 'This movie already exists in your list.',
      });
    }

    res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      error: err.message || 'Something went wrong while saving the movie.',
    });
  }
});

movieRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movieItem: Partial<movie> = req.body;

    if (!id) {
      return res.status(400).json({
        sucess: false,
        code: 'MISSING_ID',
        error: 'ID is required',
      });
    }

    const { data, error } = await supabase.from('movies').update([movieItem]).eq('id', id).select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        succes: false,
        code: 'NOT_FOUND',
        error: 'Movie not found',
      });
    }

    res.status(201).json({
      success: true,
      data: data[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      error: err.message || 'Something went wrong while saving the movie.',
    });
  }
});

movieRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_ID',
        error: 'ID is required',
      });
    }

    const { data, error } = await supabase.from('movies').delete().eq('id', id).select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      error: err.message || 'Unable to delete movie at this time.',
    });
  }
});

export default movieRouter;
