import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { HeroVisual } from "@/components/HeroVisual";

export function Hero({ locale, dict, categoryImages, heroImage, mobileHeroImage }: { locale: Locale; dict: Dictionary; categoryImages?: Record<string, string>; heroImage?: string | null; mobileHeroImage?: string | null }) {
  const base = `/${locale}`;
  const hasHeroImage = Boolean(heroImage || mobileHeroImage);

  return (
    <section
      className={`relative mx-auto max-w-content overflow-hidden px-4 sm:px-6 ${
        hasHeroImage
          ? "min-h-[540px] py-10 sm:min-h-[590px] sm:py-14 md:min-h-[620px] md:py-16 lg:min-h-[660px] lg:py-20"
          : "pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pt-20"
      }`}
    >
      {hasHeroImage && (
        <HeroVisual
          dict={dict}
          categoryImages={categoryImages}
          heroImage={heroImage}
          mobileHeroImage={mobileHeroImage}
        />
      )}

      <div
        className={`relative z-10 flex items-center ${
          hasHeroImage ? "min-h-[460px] sm:min-h-[500px] md:min-h-[530px] lg:min-h-[570px]" : ""
        }`}
      >
        <div className={`${hasHeroImage ? "w-full md:w-[66%] lg:w-[62%] xl:w-[60%]" : "w-full md:max-w-2xl"}`}>
          <div className="animate-settle-up">
            <p className="eyebrow inline-flex max-w-full -rotate-1 items-center rounded border border-border/80 bg-surface/80 px-3 py-1.5 backdrop-blur-md">
              {dict.hero.supporting}
            </p>

            <h1
              className="mt-5 max-w-[18ch] font-display text-[clamp(2.65rem,7.6vw,4.75rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-ink [text-wrap:balance] sm:mt-6 sm:text-6xl lg:text-[4.75rem]"
            >
              {dict.hero.title}
            </h1>

            <p className="mt-6 max-w-[36rem] rounded-md bg-surface/72 px-3 py-2 text-[0.98rem] leading-6 text-ink-soft shadow-sm backdrop-blur-md sm:text-base">
              {dict.hero.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <Link
                href={`${base}/products`}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lifted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {dict.hero.primaryCta}
              </Link>
              <Link
                href={`${base}/order-summary`}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink/70 bg-surface/82 px-6 py-3 text-sm font-medium text-ink backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                {dict.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
