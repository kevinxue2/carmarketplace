import express from 'express';
const router = express.Router();
import supabase from '../config/supabase.js';

// GET /filters/makes
router.get("/makes", async (req, res) => {
  const { data, error } = await supabase
    .from("unique_makes")
    .select("brand")
    .order("brand", { ascending: true })

  if (error) return res.status(500).json({ error })
  const distinct = [...new Set(data.map(d => d.brand))]
  res.json(distinct)
})

// GET /filters/models?make=Honda
router.get("/models", async (req, res) => {
  const { make } = req.query
  if (!make) {
    res.json()
  }
  const { data, error } = await supabase
    .rpc("get_models", { selected_make: make })
    .order("model", { ascending: true })

  if (error) return res.status(500).json({ error })
  const distinct = [...new Set(data.map(d => d.model))]
  res.json(distinct)
})


export { router as filterRoutes };

