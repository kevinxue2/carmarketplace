import axios from "axios";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // or process.env in CRA
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const api = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  headers: {
    apiKey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  },
});