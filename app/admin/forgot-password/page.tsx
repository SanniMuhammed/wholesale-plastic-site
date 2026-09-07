"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists for that email, a password reset link has been sent."
    );
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <h1 className="font-display text-xl font-semibold text-ink">
          Reset password
        </h1>

        <p className="mt-1 text-sm text-muted">
          Enter your admin email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink-soft">
              Email
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </label>

          {message && (
            <p className="text-sm text-green-700">{message}</p>
          )}

          {error && (
            <p className="text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded bg-brand px-5 py-3 text-sm font-medium text-surface transition-all hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          <Link
            href="/admin/login"
            className="font-medium text-ink underline underline-offset-2"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
