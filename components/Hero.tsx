import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { HeroVisual } from "@/components/HeroVisual";

export function Hero({ locale, dict, categoryImages, heroImage, mobileHeroImage }: { locale: Locale; dict: Dictionary; categoryImages?: Record<string, string>; heroImage?: string | null; mobileHeroImage?: string | null }) {
  const base = `/${locale}`;
  const hasHeroImage = Boolean(heroImage || mobileHeroImage);
  return (
    <section className={`relative mx-auto max-w-content overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pt-20 ${hasHeroImage ? "min-h-[560px] md:min-h-[620px] lg:min-h-[680px]" : ""}`}>
      {hasHeroImage && (
        <HeroVisual dict={dict} categoryImages={categoryImages} heroImage={heroImage} mobileHeroImage={mobileHeroImage} />
      )}
      <div className={`relative z-10 grid items-center gap-12 md:gap-14 xl:gap-16 ${hasHeroImage ? "min-h-[480px] md:min-h-[540px] lg:min-h-[600px] md:max-w-[58%]" : "md:grid-cols-2"}`}>
        <div className="animate-settle-up">
          <p className="eyebrow inline-block -rotate-1 rounded border border-border bg-surface/80 px-3 py-1.5 backdrop-blur-sm">{dict.hero.supporting}</p>
          <h1 className="mt-6 max-w-2xl font-display text-[2.75rem] font-semibold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.75rem]">{dict.hero.title}</h1>
          <p className="mt-6 max-w-lg rounded bg-surface/65 p-1 text-lg text-muted backdrop-blur-sm">{dict.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${base}/products`} className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark">{dict.hero.primaryCta}</Link>
            <Link href={`${base}/order-summary`} className="inline-flex items-center justify-center rounded border border-ink bg-surface/80 px-6 py-3 text-sm font-medium text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-surface">{dict.hero.secondaryCta}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
