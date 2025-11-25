import { Router } from 'express';
import { supabase } from '../services/supabaseClient';
import type { category } from '../types/types';
import { getUserFromRequest } from '../utils/utils';

const categoryRouter = Router();

categoryRouter.get('/', async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const user = await getUserFromRequest(_req, res);
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${user.id},id.eq.1`);

    if (error) throw error;
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

categoryRouter.post('/', async (req, res) => {
  try {
    const user = await getUserFromRequest(req, res);
    if (!user) return;

    const categoryItem: category = { ...req.body, user_id: user.id };

    if (!categoryItem.name) {
      return res.status(400).json({
        code: 'MISSING_CATEGORY_NAME',
        error: 'Category name is required',
      });
    }

    const { data, error } = await supabase.from('categories').insert([categoryItem]).select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      error: err.message || 'Something went wrong while saving the category.',
    });
  }
});

categoryRouter.patch('/:id', async (req, res) => {
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
