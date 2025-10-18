import { Router } from "express";
import { supabase } from "../services/supabaseClient";

const categoryRouter = Router();

categoryRouter.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
})

export default categoryRouter;