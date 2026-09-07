"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { RouteDiagram } from "@/components/illustrations/RouteDiagram";
import { useInView } from "@/lib/hooks/useInView";

export function DeliveryTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="border-y border-border bg-surface">
      <div ref={ref} className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {dict.deliveryTeaser.title}
          </h2>
          <p className="mt-3 max-w-lg text-muted">{dict.deliveryTeaser.subtitle}</p>
        </div>

        {/* The route: an abstract origin-to-destination line rather than a
            map, so the claim stays truthful (no invented country, city or
            distance) while still giving this section its own visual
            signature instead of a title/link pair. */}
        <div className="mt-12 max-w-2xl sm:mt-16">
          <RouteDiagram active={inView} className="h-auto w-full text-brand" />
          <div className="mt-3 flex items-start justify-between gap-4">
            <span className="eyebrow">{dict.deliveryTeaser.originLabel}</span>
            <span className="eyebrow text-right">{dict.deliveryTeaser.destinationLabel}</span>
          </div>
        </div>

        <Link
          href={`${base}/delivery`}
          className="mt-10 inline-flex shrink-0 items-center gap-1.5 rounded border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
        >
          {dict.deliveryTeaser.cta}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
