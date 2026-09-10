"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";
import { useInView } from "@/lib/hooks/useInView";
import { cx } from "@/lib/utils";

type HowItWorksProps = {
  dict: Dictionary;
  locale: Locale;
  id?: string;
  section?: HomepageSection;
  deliverySection?: HomepageSection;
  deliveryImageUrl?: string | null;
  deliveryMobileImageUrl?: string | null;
};

function sectionText(section: HomepageSection | undefined, locale: Locale, fallbackTitle: string, fallbackBody: string) {
  if (locale === "fr") return { title: section?.title_fr || fallbackTitle, body: section?.body_fr || fallbackBody };
  return { title: section?.title_en || fallbackTitle, body: section?.body_en || fallbackBody };
}

export function HowItWorksSection({ dict, locale, id, section, deliverySection, deliveryImageUrl, deliveryMobileImageUrl }: HowItWorksProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  if (section?.is_visible === false) return null;

  const steps = dict.howItWorksSection.steps;
  const copy = sectionText(section, locale, dict.howItWorksSection.title, dict.howItWorksSection.subtitle);
  const deliveryCopy = sectionText(deliverySection, locale, dict.deliveryTeaser.title, dict.deliveryTeaser.subtitle);
  const deliveryVisible = deliverySection?.is_visible !== false;

  return (
    <section id={id} className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{copy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7">{copy.body}</p>
        </div>

        <div ref={ref}>
          <ol className="mt-10 sm:hidden">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li key={step.number} className="relative flex gap-4 pb-8 last:pb-0">
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
                    <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-ink">{step.title}</h3>
                    <p className="mt-1.5 max-w-[34ch] text-sm text-muted">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <ol className="relative mt-12 hidden gap-x-5 sm:grid sm:grid-cols-5 lg:gap-x-7">
            {steps.map((step, index) => {
              const isBookend = index === 0 || index === steps.length - 1;
              const isLast = index === steps.length - 1;
              return (
                <li key={step.number} className="relative flex min-w-0 flex-col">
                  {!isLast && (
                    <>
                      <span className="absolute left-[6px] top-[6px] h-px w-[calc(100%+1.25rem)] bg-border lg:w-[calc(100%+1.75rem)]" aria-hidden />
                      <span className="absolute left-[6px] top-[6px] h-px w-[calc(100%+1.25rem)] origin-left bg-brand lg:w-[calc(100%+1.75rem)]" style={{ transform: `scaleX(${inView ? 1 : 0})`, transitionProperty: "transform", transitionDuration: "0.6s", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${index * 120}ms` }} aria-hidden />
                    </>
                  )}
                  <span className="relative z-10 h-3 w-3 shrink-0 rounded-full border-2 border-brand bg-surface" />
                  <p className="mt-3 font-mono text-xs font-bold text-muted">{step.number}</p>
                  <h3 className={cx("mt-2 font-display font-semibold leading-[1.05] text-ink", isBookend ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl")}>{step.title}</h3>
                  <p className="mt-2 max-w-[22ch] text-sm text-muted">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {deliveryVisible && (
          <div className="mt-12 border-t border-border pt-10 sm:mt-14 sm:pt-12">
            <div className="grid items-center gap-7 lg:grid-cols-[1fr_minmax(320px,0.9fr)] lg:gap-12">
              <div className="max-w-xl">
                <p className="eyebrow text-brand/80">{locale === "fr" ? "Livraison" : "Delivery"}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">{deliveryCopy.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base sm:leading-7">{deliveryCopy.body}</p>
                <Link href={`/${locale}/delivery`} className="mt-6 inline-flex items-center gap-1.5 rounded border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface">
                  {dict.deliveryTeaser.cta} →
                </Link>
              </div>

              {(deliveryImageUrl || deliveryMobileImageUrl) && (
                <picture className="block overflow-hidden rounded-xl border border-border bg-background">
                  {deliveryMobileImageUrl && <source media="(max-width: 640px)" srcSet={deliveryMobileImageUrl} />}
                  {deliveryImageUrl && <img src={deliveryImageUrl} alt="" className="h-auto max-h-[300px] w-full object-cover" loading="lazy" />}
                </picture>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
