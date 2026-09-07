import type { Dictionary } from "@/lib/getDictionary";

export function TravelSection({ dict }: { dict: Dictionary }) {
  // The four-stop "You -> Our Team in Nigeria -> Products -> Your Business"
  // sequence used to render here as its own numbered grid, immediately
  // above the How It Works section's five-step process. The two read as
  // one idea told twice, so this section now just makes the problem/
  // solution case in prose and leaves the numbered walkthrough to How It
  // Works.
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.travel.title}
        </h2>
        <p className="mt-4 text-muted">{dict.travel.problem}</p>
        <p className="mt-4 font-medium text-ink-soft">{dict.travel.solution}</p>
      </div>
    </section>
  );
}
