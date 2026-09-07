"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <h1 className="font-display text-xl font-semibold text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">Wholesale Plastic Products dashboard</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink-soft">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink-soft">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </label>

          <div className="-mt-2 text-right">
            <Link
              href="/admin/forgot-password"
              className="text-xs font-medium text-muted underline underline-offset-2 hover:text-ink"
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded bg-brand px-5 py-3 text-sm font-medium text-surface transition-all hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted">
          Accounts are created by invitation -- see ADMIN_SETUP.md if you need access.
        </p>
      </div>
    </div>
  );
}
