import type { Dictionary } from "@/lib/getDictionary";

export function HowItWorksSection({ dict, id }: { dict: Dictionary; id?: string }) {
  return (
    <section id={id} className="border-y border-border bg-surface scroll-mt-20">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.howItWorksSection.title}
        </h2>
        <p className="mt-2 text-muted">{dict.howItWorksSection.subtitle}</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-5">
          {dict.howItWorksSection.steps.map((step) => (
            <div key={step.number} className="border-t-2 border-brand pt-4">
              <span className="font-display text-2xl font-semibold text-brand">{step.number}</span>
              <h3 className="mt-2 font-medium text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
