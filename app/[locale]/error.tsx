"use client";

import { useEffect } from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep production errors out of the UI while preserving Next's recovery flow.
    console.error("Localized page error");
  }, []);

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Sherinab Venture</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
          We couldn&apos;t load this page right now. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
