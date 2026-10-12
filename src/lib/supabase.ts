import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pofruxnxcnzhjdwdlkiu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseReady = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your_')
);

// Client-side Supabase instance (RLS-enforced via Auth session)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Admin Supabase instance (Bypasses RLS when needed for system triggers)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
