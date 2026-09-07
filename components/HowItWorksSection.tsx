"use client";

import type { Dictionary } from "@/lib/getDictionary";
import { useInView } from "@/lib/hooks/useInView";
import { cx } from "@/lib/utils";

export function HowItWorksSection({ dict, id }: { dict: Dictionary; id?: string }) {
  const steps = dict.howItWorksSection.steps;
  const { ref, inView } = useInView<HTMLOListElement>();

  return (
    <section id={id} className="border-y border-border bg-surface scroll-mt-20">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.howItWorksSection.title}
        </h2>
        <p className="mt-2 text-muted">{dict.howItWorksSection.subtitle}</p>

        <ol ref={ref} className="mt-12 grid gap-8 sm:grid-cols-5 sm:gap-4">
          {steps.map((step, i) => (
            <li key={step.number} className="relative flex flex-col">
              {/* Static base line, always present */}
              {i < steps.length - 1 && (
                <span
                  className="absolute left-[19px] top-[19px] hidden h-px w-full bg-border sm:block"
                  aria-hidden
                />
              )}
              {/* Brand overlay draws itself once, left to right, when the
                  sequence scrolls into view -- one deliberate moment tied
                  to an actual process, not a per-card reveal effect. */}
              {i < steps.length - 1 && (
                <span
                  className={cx(
                    "absolute left-[19px] top-[19px] hidden h-px w-full origin-left bg-brand sm:block",
                    inView ? "animate-grow-x" : "scale-x-0"
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                  aria-hidden
                />
              )}
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-surface font-mono text-sm font-bold text-brand">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
