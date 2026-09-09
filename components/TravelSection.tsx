import type { Dictionary } from "@/lib/getDictionary";

export function TravelSection({ dict }: { dict: Dictionary }) {
  // The four-stop "You -> Our Team in Nigeria -> Products -> Your Business"
  // flow. dict.travel.flow carries this copy in both en.json and fr.json,
  // rendered here as the same numbered-mono strip TrustBar uses, so it
  // doesn't duplicate How It Works' step-by-step card layout below.
  const stops = [dict.travel.flow.you, dict.travel.flow.team, dict.travel.flow.products, dict.travel.flow.business];

  return (
    <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.travel.title}
        </h2>
        <p className="mt-4 text-muted">{dict.travel.problem}</p>
        <p className="mt-4 font-medium text-ink-soft">{dict.travel.solution}</p>
      </div>

      <div className="mt-7 grid grid-cols-2 border-t border-border sm:mt-10 sm:grid-cols-4 sm:divide-x sm:divide-border">
        {stops.map((stop, i) => (
          <div
            key={stop}
            className="flex items-baseline gap-2.5 border-b border-border px-0 py-3.5 odd:pr-4 even:pl-4 sm:border-b-0 sm:px-6 sm:py-5 sm:odd:pr-6 sm:even:pl-6"
          >
            <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium text-ink-soft">{stop}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
