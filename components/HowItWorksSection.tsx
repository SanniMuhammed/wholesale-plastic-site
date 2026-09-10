"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";
import { useInView } from "@/lib/hooks/useInView";
import { cx } from "@/lib/utils";
import { RouteDiagram } from "@/components/illustrations/RouteDiagram";

const HINGE_INDEX = 2;

type HowItWorksProps = {
  dict: Dictionary;
  locale: Locale;
  id?: string;
  section?: HomepageSection;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
  deliverySection?: HomepageSection;
  deliveryImageUrl?: string | null;
  deliveryMobileImageUrl?: string | null;
};

function sectionText(section: HomepageSection | undefined, locale: Locale, fallbackTitle: string, fallbackBody: string) {
  if (locale === "fr") return { title: section?.title_fr || fallbackTitle, body: section?.body_fr || fallbackBody };
  return { title: section?.title_en || fallbackTitle, body: section?.body_en || fallbackBody };
}

export function HowItWorksSection({ dict, locale, id, section, imageUrl, mobileImageUrl, deliverySection, deliveryImageUrl, deliveryMobileImageUrl }: HowItWorksProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  if (section?.is_visible === false) return null;

  const steps = dict.howItWorksSection.steps;
  const copy = sectionText(section, locale, dict.howItWorksSection.title, dict.howItWorksSection.subtitle);
  const deliveryCopy = sectionText(deliverySection, locale, dict.deliveryTeaser.title, dict.deliveryTeaser.subtitle);
  const deliveryVisible = deliverySection?.is_visible !== false;

  return (
    <section id={id} className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto max-w-content px-4 pb-9 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{copy.title}</h2>
        <p className="mt-2 max-w-md text-muted">{copy.body}</p>

        {imageUrl && (
          <picture className="mt-8 block overflow-hidden rounded-xl border border-border bg-background">
            {mobileImageUrl && <source media="(max-width: 640px)" srcSet={mobileImageUrl} />}
            <img src={imageUrl} alt="" className="h-auto max-h-[420px] w-full object-cover" loading="lazy" />
          </picture>
        )}

        <div ref={ref}>
          <ol className="mt-12 sm:hidden">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li key={step.number} className="relative flex gap-4 pb-9 last:pb-0">
                  <div className="relative flex w-2 shrink-0 flex-col items-center">
                    <span className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border border-border bg-surface" />
                    {!isLast && (
                      <>
                        <span className="absolute bottom-0 left-1/2 top-4 w-px -translate-x-1/2 bg-border" aria-hidden />
                        <span className="absolute bottom-0 left-1/2 top-4 w-px origin-top -translate-x-1/2 bg-brand" style={{ transform: `translateX(-50%) scaleY(${inView ? 1 : 0})`, transitionProperty: "transform", transitionDuration: "0.6s", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${index * 120}ms` }} aria-hidden />
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[11px] font-bold tracking-[0.08em] text-muted">{step.number}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">{step.title}</h3>
                    <p className="mt-1.5 max-w-[30ch] text-sm text-muted">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <ol className="relative mt-14 hidden gap-x-6 sm:grid sm:grid-cols-[1.25fr,1fr,1.2fr,1fr,1.25fr]">
            {steps.map((step, index) => {
              const isBookend = index === 0 || index === steps.length - 1;
              const isLast = index === steps.length - 1;
              return (
                <li key={step.number} className="relative flex flex-col">
                  {!isLast && (
                    <>
                      <span className="absolute left-[6px] top-[6px] h-px w-full bg-border" aria-hidden />
                      <span className="absolute left-[6px] top-[6px] h-px w-full origin-left bg-brand" style={{ transform: `scaleX(${inView ? 1 : 0})`, transitionProperty: "transform", transitionDuration: "0.6s", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${index * 120}ms` }} aria-hidden />
                    </>
                  )}
                  <span className="relative z-10 h-3 w-3 shrink-0 rounded-full border-2 border-brand bg-surface" />
                  <p className="mt-3 font-mono text-xs font-bold text-muted">{step.number}</p>
                  <h3 className={cx("mt-2 font-display font-semibold leading-[1.05] text-ink", isBookend ? "text-3xl" : "text-2xl")}>{step.title}</h3>
                  <p className="mt-2 max-w-[22ch] text-sm text-muted">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {deliveryVisible && (
          <div className="mt-12 border-t border-border pt-9 sm:mt-14 sm:pt-10">
            <div className="max-w-xl">
              <p className="eyebrow text-brand">{dict.deliveryTeaser.originLabel} → {dict.deliveryTeaser.destinationLabel}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{deliveryCopy.title}</h3>
              <p className="mt-3 text-muted">{deliveryCopy.body}</p>
            </div>

            {deliveryImageUrl && (
              <picture className="mt-8 block max-w-3xl overflow-hidden rounded-xl border border-border bg-background">
                {deliveryMobileImageUrl && <source media="(max-width: 640px)" srcSet={deliveryMobileImageUrl} />}
                <img src={deliveryImageUrl} alt="" className="h-auto max-h-[320px] w-full object-cover" loading="lazy" />
              </picture>
            )}

            <div className="-my-3 max-w-3xl sm:-my-5">
              <RouteDiagram active={inView} className="h-auto w-full text-brand" />
              <div className="mt-2 flex items-start justify-between gap-4">
                <span className="eyebrow">{dict.deliveryTeaser.originLabel}</span>
                <span className="eyebrow text-right">{dict.deliveryTeaser.destinationLabel}</span>
              </div>
            </div>

            <Link href={`/${locale}/delivery`} className="mt-7 inline-flex items-center gap-1.5 rounded border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface">
              {dict.deliveryTeaser.cta} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
