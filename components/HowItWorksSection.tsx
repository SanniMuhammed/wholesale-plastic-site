"use client";

import Link from "next/link";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";
import { useInView } from "@/lib/hooks/useInView";
import { cx } from "@/lib/utils";
import { RouteDiagram } from "@/components/illustrations/RouteDiagram";

const HINGE_INDEX = 2;

export function HowItWorksSection({ dict, id, section, imageUrl, mobileImageUrl }: { dict: Dictionary; id?: string; section?: HomepageSection; imageUrl?: string | null; mobileImageUrl?: string | null }) {
  if (section?.is_visible === false) return null;
  const steps = dict.howItWorksSection.steps;
  const { ref, inView } = useInView<HTMLDivElement>();
  const title = section?.title_en && dict.locale === "en" ? section.title_en : section?.title_fr && dict.locale === "fr" ? section.title_fr : dict.howItWorksSection.title;
  const subtitle = section?.body_en && dict.locale === "en" ? section.body_en : section?.body_fr && dict.locale === "fr" ? section.body_fr : dict.howItWorksSection.subtitle;

  return (
    <section id={id} className="border-y border-border bg-surface scroll-mt-20">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-md text-muted">{subtitle}</p>

        {imageUrl && (
          <picture className="mt-8 block overflow-hidden rounded-xl border border-border bg-background">
            {mobileImageUrl && <source media="(max-width: 640px)" srcSet={mobileImageUrl} />}
            <img src={imageUrl} alt="" className="h-auto max-h-[420px] w-full object-cover" loading="lazy" />
          </picture>
        )}

        <div ref={ref}>
          <ol className="mt-12 sm:hidden">
            {steps.map((step, i) => {
              const isHinge = i === HINGE_INDEX;
              const isLast = i === steps.length - 1;
              return <li key={step.number} className="relative flex gap-4 pb-9 last:pb-0"><div className="relative flex w-2 shrink-0 flex-col items-center"><span className={cx("relative z-10 mt-1.5 shrink-0 rounded-full", isHinge ? "h-2.5 w-2.5 bg-brand" : "h-2 w-2 border border-border bg-surface")} />{!isLast && <><span className="absolute bottom-0 left-1/2 top-4 w-px -translate-x-1/2 bg-border" aria-hidden /><span className="absolute bottom-0 left-1/2 top-4 w-px origin-top -translate-x-1/2 bg-brand" style={{ transform: `translateX(-50%) scaleY(${inView ? 1 : 0})`, transitionProperty: "transform", transitionDuration: "0.6s", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${i * 120}ms` }} aria-hidden /></>}</div><div className="flex-1"><p className={cx("font-mono text-[11px] font-bold tracking-[0.08em]", isHinge ? "text-brand" : "text-muted")}>{step.number}</p><h3 className={cx("mt-1 font-display font-semibold leading-tight text-ink", isHinge ? "text-[1.7rem]" : "text-2xl")}>{step.title}</h3><p className="mt-1.5 max-w-[30ch] text-sm text-muted">{step.description}</p></div></li>;
            })}
          </ol>

          <ol className="relative mt-16 hidden gap-x-6 sm:grid sm:grid-cols-[1.25fr,1fr,1.2fr,1fr,1.25fr]">
            {steps.map((step, i) => {
              const isHinge = i === HINGE_INDEX;
              const isBookend = i === 0 || i === steps.length - 1;
              const isLast = i === steps.length - 1;
              return <li key={step.number} className="relative flex flex-col">{!isLast && <><span className="absolute left-[6px] top-[6px] h-px w-full bg-border" aria-hidden /><span className="absolute left-[6px] top-[6px] h-px w-full origin-left bg-brand" style={{ transform: `scaleX(${inView ? 1 : 0})`, transitionProperty: "transform", transitionDuration: "0.6s", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${i * 120}ms` }} aria-hidden /></>}<span className={cx("relative z-10 h-3 w-3 shrink-0 rounded-full", isHinge ? "bg-brand" : "border-2 border-brand bg-surface")} /><p className="mt-3 font-mono text-xs font-bold text-muted">{step.number}</p><h3 className={cx("mt-2 font-display font-semibold leading-[1.05] text-ink", isHinge ? "text-4xl" : isBookend ? "text-3xl" : "text-2xl")}>{step.title}</h3><p className="mt-2 max-w-[22ch] text-sm text-muted">{step.description}</p></li>;
            })}
          </ol>
        </div>

        <div className="mt-14 border-t border-border pt-10 sm:mt-16 sm:pt-12">
          <div className="max-w-xl"><p className="eyebrow text-brand">{dict.deliveryTeaser.originLabel} → {dict.deliveryTeaser.destinationLabel}</p><h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{dict.deliveryTeaser.title}</h3><p className="mt-3 text-muted">{dict.deliveryTeaser.subtitle}</p></div>
          <div className="mt-10 max-w-3xl sm:mt-12"><RouteDiagram active={inView} className="h-auto w-full text-brand" /><div className="mt-3 flex items-start justify-between gap-4"><span className="eyebrow">{dict.deliveryTeaser.originLabel}</span><span className="eyebrow text-right">{dict.deliveryTeaser.destinationLabel}</span></div></div>
          <Link href={`/${dict.locale}/delivery`} className="mt-8 inline-flex items-center gap-1.5 rounded border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface">{dict.deliveryTeaser.cta} →</Link>
        </div>
      </div>
    </section>
  );
}
