import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";
import { generalInquiryLink } from "@/lib/whatsapp";

export function FinalCta({ locale, dict, section }: { locale: Locale; dict: Dictionary; section?: HomepageSection }) {
  if (section?.is_visible === false) return null;
  const base = `/${locale}`;
  const title = section?.title_en && locale === "en" ? section.title_en : section?.title_fr && locale === "fr" ? section.title_fr : dict.finalCta.title;
  const subtitle = section?.body_en && locale === "en" ? section.body_en : section?.body_fr && locale === "fr" ? section.body_fr : dict.finalCta.subtitle;

  return (
    <section className="overflow-hidden bg-brand">
      <div className="mx-auto max-w-content">
        <div className="flex min-w-0 flex-col justify-center px-4 py-10 text-left sm:px-6 sm:py-12 lg:px-10 lg:py-14 xl:py-16">
          <h2 className="max-w-2xl font-display text-xl font-semibold leading-tight text-surface sm:text-3xl lg:text-[2.1rem]">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-light/90 sm:text-base sm:leading-7">{subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <Link href={`${base}/order-summary`} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded bg-surface px-4 py-2.5 text-xs font-medium text-brand-dark transition-opacity hover:opacity-90 sm:px-6 sm:py-3 sm:text-sm">{dict.finalCta.primaryCta}</Link>
            <a href={generalInquiryLink(dict)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded border border-surface/60 px-4 py-2.5 text-xs font-medium text-surface transition-colors hover:bg-surface/10 sm:px-6 sm:py-3 sm:text-sm">{dict.finalCta.secondaryCta}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
