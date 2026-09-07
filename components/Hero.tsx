import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { HeroVisual } from "@/components/HeroVisual";

export function Hero({ locale, dict, categoryImages, heroImage, mobileHeroImage }: { locale: Locale; dict: Dictionary; categoryImages?: Record<string, string>; heroImage?: string | null; mobileHeroImage?: string | null }) {
  const base = `/${locale}`;
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 xl:grid-cols-[1.15fr,0.85fr] xl:gap-16">
        <div>
          <p className="eyebrow inline-block -rotate-1 rounded border border-border px-3 py-1.5">{dict.hero.supporting}</p>
          <h1 className="mt-6 font-display text-[2.75rem] font-semibold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.75rem]">{dict.hero.title}</h1>
          <p className="mt-6 max-w-lg text-lg text-muted">{dict.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${base}/products`} className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark">{dict.hero.primaryCta}</Link>
            <Link href={`${base}/order-summary`} className="inline-flex items-center justify-center rounded border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface">{dict.hero.secondaryCta}</Link>
          </div>
        </div>
        <div>
          <HeroVisual dict={dict} categoryImages={categoryImages} heroImage={heroImage} mobileHeroImage={mobileHeroImage} />
        </div>
      </div>
    </section>
  );
}
