import { createClient } from '@supabase/supabase-js';
export * from '@supabase/supabase-js';
import { Database } from './db-types';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default createClient<Database>(supabaseUrl, supabaseKey);
