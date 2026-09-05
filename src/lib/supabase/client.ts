import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Uses the publishable (anon) key only. Every query it makes is subject to the
 * RLS policies in supabase/migrations — the browser is never trusted to filter.
 * The service-role key must never appear in this directory.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createBrowserClient(url, key);
}

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
