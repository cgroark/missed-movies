import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Capture recovery intent before Supabase consumes and clears the URL fragment.
const callbackParams = new URLSearchParams(window.location.hash.slice(1));
export const isPasswordRecoveryRedirect = callbackParams.get('type') === 'recovery';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
