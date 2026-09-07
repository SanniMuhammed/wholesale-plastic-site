import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use inside "use client" components. Only ever uses
 * the public anon key -- never the service role key, which must not reach
 * the browser. Row Level Security (see supabase/migrations) is what keeps
 * this safe: an anon/authenticated-but-non-admin caller simply cannot
 * write to admin-only tables no matter what this client sends.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
