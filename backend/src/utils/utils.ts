import { supabase } from "../services/supabaseClient";
import { Request, Response } from "express";

export const getUserFromRequest = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return null;
  }

  const token = authHeader.substring("Bearer ".length);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    res.status(401).json({ error: "Your session has expired. Please log in again." });
    return null;
  }

  return user;
};