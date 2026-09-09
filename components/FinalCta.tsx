import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";
import { generalInquiryLink } from "@/lib/whatsapp";

export function FinalCta({ locale, dict, imageUrl, section }: { locale: Locale; dict: Dictionary; imageUrl: string; section?: HomepageSection }) {
  if (section?.is_visible === false) return null;
  const base = `/${locale}`;
  const title = section?.title_en && locale === "en" ? section.title_en : section?.title_fr && locale === "fr" ? section.title_fr : dict.finalCta.title;
  const subtitle = section?.body_en && locale === "en" ? section.body_en : section?.body_fr && locale === "fr" ? section.body_fr : dict.finalCta.subtitle;

  return (
    <section className="bg-brand">
      <div className="mx-auto grid max-w-content grid-cols-1 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center px-4 py-10 text-left sm:px-6 sm:py-12 lg:px-10 lg:py-20">
          <h2 className="font-display text-xl font-semibold leading-tight text-surface sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-md text-sm text-brand-light/90 sm:text-base">{subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <Link href={`${base}/order-summary`} className="inline-flex min-h-11 items-center justify-center rounded bg-surface px-4 py-2.5 text-xs font-medium text-brand-dark transition-opacity hover:opacity-90 sm:px-6 sm:py-3 sm:text-sm">{dict.finalCta.primaryCta}</Link>
            <a href={generalInquiryLink(dict)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded border border-surface/60 px-4 py-2.5 text-xs font-medium text-surface transition-colors hover:bg-surface/10 sm:px-6 sm:py-3 sm:text-sm">{dict.finalCta.secondaryCta}</a>
          </div>
        </div>
        <div className="min-h-[220px] overflow-hidden bg-cover bg-center bg-no-repeat sm:min-h-[280px] lg:min-h-[360px]" role="img" aria-label="Sherinab Venture delivery truck" style={{ backgroundImage: `url(\"${imageUrl}\")` }} />
      </div>
    </section>
  );
}
