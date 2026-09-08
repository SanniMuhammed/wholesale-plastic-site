export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-background" aria-label="Loading" role="status">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-border/70" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-border/60" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="aspect-square animate-pulse bg-border/60" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-border/60" />
                <div className="h-3 w-full animate-pulse rounded bg-border/50" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-border/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
