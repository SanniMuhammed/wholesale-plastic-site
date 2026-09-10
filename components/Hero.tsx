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
    <section className={`relative mx-auto max-w-content overflow-hidden px-4 sm:px-6 ${hasHeroImage ? "min-h-[540px] py-10 sm:min-h-[570px] sm:py-12 md:min-h-[600px] md:py-14 lg:min-h-[640px] lg:py-16" : "pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pt-20"}`}>
      {hasHeroImage && <HeroVisual dict={dict} categoryImages={categoryImages} heroImage={heroImage} mobileHeroImage={mobileHeroImage} />}
      <div className={`relative z-10 flex items-center ${hasHeroImage ? "min-h-[460px] sm:min-h-[490px] md:min-h-[510px] lg:min-h-[540px]" : ""}`}>
        <div className={`${hasHeroImage ? "w-full max-w-[34rem] sm:w-[76%] sm:max-w-[36rem] md:w-[68%] lg:w-[64%] xl:w-[62%]" : "w-full md:max-w-2xl"}`}>
          <div className="animate-settle-up">
            <p className="eyebrow inline-flex max-w-full -rotate-1 items-center rounded border border-brand/20 bg-brand-light/90 px-3 py-1.5 text-brand shadow-sm backdrop-blur-md">{dict.hero.supporting}</p>
            <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.65rem,7.6vw,4.75rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-ink [text-wrap:balance] sm:mt-6 sm:max-w-[24ch] sm:text-[clamp(3rem,6.8vw,5.25rem)] sm:leading-[0.91] lg:text-[4.75rem]">{title}</h1>
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <Link href={`${base}/products`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lifted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{dict.hero.primaryCta}</Link>
              <Link href={`${base}/order-summary`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink/70 bg-surface/88 px-6 py-3 text-sm font-medium text-ink backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2">{dict.startBusiness.cta}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
