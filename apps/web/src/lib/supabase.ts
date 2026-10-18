/**
 * Supabase client. The URL and the publishable (anon) key are public by design: every browser that opens
 * the app receives them. What protects the data is row-level security in supabase/schema.sql
 * (students read and write only their own rows; only the instructor reads everyone's).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export const cloudEnabled = !!supabase;
