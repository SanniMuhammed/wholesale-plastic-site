import type { Dictionary } from "@/lib/getDictionary";

export function TravelSection({ dict }: { dict: Dictionary }) {
  const flow = [dict.travel.flow.you, dict.travel.flow.team, dict.travel.flow.products, dict.travel.flow.business];

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {dict.travel.title}
          </h2>
          <p className="mt-4 text-muted">{dict.travel.problem}</p>
          <p className="mt-4 font-medium text-ink-soft">{dict.travel.solution}</p>
        </div>

        {/* The sourcing chain as a numbered sequence rather than boxes
            joined by arrow icons -- the rule itself implies direction, so
            no icon has to do that job. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 self-end border-t-2 border-border pt-6 sm:grid-cols-4">
          {flow.map((step, i) => (
            <div key={step}>
              <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
