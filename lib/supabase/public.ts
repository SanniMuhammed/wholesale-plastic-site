import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for public, build-safe reads.
 *
 * This client intentionally does not use next/headers or cookies().
 * RLS controls what anonymous users can read. Public catalog queries
 * should therefore use this client instead of the request-bound server
 * client from ./server.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
