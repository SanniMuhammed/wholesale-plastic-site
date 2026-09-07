import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components, Route Handlers, and Server
 * Actions. Reads/writes the auth session via cookies, and -- like the
 * browser client -- only ever uses the public anon key. Access control is
 * enforced by the RLS policies in supabase/migrations, not by trusting
 * this client.
 *
 * Call this fresh on every request; it is not meant to be a module-level
 * singleton because it captures the current request's cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render, where cookies can't
            // be written. Harmless as long as the proxy also refreshes the
            // session on every request (see lib/supabase/proxy.ts) --
            // that's what actually keeps the session alive.
          }
        },
      },
    }
  );
}
