import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { HeroVisual } from "@/components/HeroVisual";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            {dict.hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">{dict.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`${base}/products`}
              className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
            >
              {dict.hero.primaryCta}
            </Link>
            <Link
              href={`${base}/order-summary`}
              className="inline-flex items-center justify-center rounded border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
            >
              {dict.hero.secondaryCta}
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">{dict.hero.supporting}</p>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
