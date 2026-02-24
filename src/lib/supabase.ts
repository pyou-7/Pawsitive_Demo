import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseUser = async (authToken: string) => {
  const { data: { user }, error } = await supabase.auth.getUser(authToken);
  if (error) throw new Error(error.message);
  return user;
};
