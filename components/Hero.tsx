import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";
import { HeroVisual } from "@/components/HeroVisual";

export function Hero({ locale, dict, categoryImages, heroImage, mobileHeroImage, section }: { locale: Locale; dict: Dictionary; categoryImages?: Record<string, string>; heroImage?: string | null; mobileHeroImage?: string | null; section?: HomepageSection }) {
  if (section?.is_visible === false) return null;
  const base = `/${locale}`;
  const hasHeroImage = Boolean(heroImage || mobileHeroImage);
  const title = section?.title_en && locale === "en" ? section.title_en : section?.title_fr && locale === "fr" ? section.title_fr : dict.hero.title;

  return (
    <section className={`relative mx-auto max-w-content overflow-hidden px-4 sm:px-6 ${hasHeroImage ? "min-h-[590px] py-8 sm:min-h-[600px] sm:py-10 md:min-h-[610px] md:py-12 lg:min-h-[620px] lg:py-14" : "pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pt-20"}`}>
      {hasHeroImage && <HeroVisual dict={dict} categoryImages={categoryImages} heroImage={heroImage} mobileHeroImage={mobileHeroImage} />}
      <div className={`relative z-10 flex items-center ${hasHeroImage ? "min-h-[510px] sm:min-h-[520px] md:min-h-[530px] lg:min-h-[540px]" : ""}`}>
        <div className={`${hasHeroImage ? "w-full max-w-[31rem] sm:w-[76%] sm:max-w-[36rem] md:w-[68%] lg:w-[62%] xl:w-[58%]" : "w-full md:max-w-2xl"}`}>
          <div className="animate-settle-up rounded-2xl bg-surface/40 p-4 backdrop-blur-[2px] sm:bg-surface/25 sm:p-5">
            <p className="eyebrow inline-flex max-w-full -rotate-1 items-center rounded-md border border-brand/20 bg-brand-light/95 px-3 py-1.5 text-brand shadow-sm backdrop-blur-md">{dict.hero.supporting}</p>
            <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(2.7rem,7.4vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-ink [text-wrap:balance] sm:mt-6 sm:max-w-[21ch] sm:text-[clamp(3rem,6.6vw,5.15rem)] sm:leading-[0.92] lg:text-[4.7rem]">{title}</h1>
            <p className="mt-5 max-w-[31rem] text-base leading-7 text-ink/80 sm:mt-6 sm:text-lg sm:leading-7">{dict.hero.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <Link href={`${base}/products`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lifted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{dict.hero.primaryCta}</Link>
              <Link href={`${base}/order-summary`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink/70 bg-surface/95 px-6 py-3 text-sm font-medium text-ink shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2">{dict.hero.secondaryCta}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
