import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  // Only log error in development, not in production
  if (import.meta.env.DEV) {
    console.error('Missing Supabase environment variables');
  }
  throw new Error('Missing required Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}); 