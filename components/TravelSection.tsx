import { ArrowDown } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

export function TravelSection({ dict }: { dict: Dictionary }) {
  const flow = [dict.travel.flow.you, dict.travel.flow.team, dict.travel.flow.products, dict.travel.flow.business];

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {dict.travel.title}
          </h2>
          <p className="mt-4 text-muted">{dict.travel.problem}</p>
          <p className="mt-4 font-medium text-ink-soft">{dict.travel.solution}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          {flow.map((step, i) => (
            <div key={step} className="flex w-full flex-col items-center">
              <div className="w-full max-w-xs rounded border border-border bg-surface px-5 py-3 text-center text-sm font-medium text-ink">
                {step}
              </div>
              {i < flow.length - 1 && (
                <ArrowDown size={18} strokeWidth={1.5} className="my-1 text-muted" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
