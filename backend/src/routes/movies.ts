import { Router } from "express";
import { supabase } from "../services/supabaseClient";
import type { movie } from "../../../frontend/src/types/types";

const router = Router();

router.post("/", async (req, res ) => {
  try {
    const movieItem: movie = req.body;

    if (!movieItem.title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const { data, error } = await supabase
      .from("movies")
      .insert([movieItem])
      .select(); // return row

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (error: any) {
    res.status(500).json({error: error.message})
  }
})

router.get("/", async (_req, res) => {
  try {
    const { data, error} = await supabase
      .from("movies")
      .select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.log('err', err)
    res.status(500).json({ error: err.message });

  }
})

export default router;