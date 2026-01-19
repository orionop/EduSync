import { createClient } from '@supabase/supabase-js';

// Normalized to use VITE_* prefix for Vite-based projects
if (!process.env.VITE_SUPABASE_URL) {
  throw new Error('Missing env.VITE_SUPABASE_URL');
}
if (!process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
); 