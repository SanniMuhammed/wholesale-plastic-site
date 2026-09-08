import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <Link
          href="/en"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
