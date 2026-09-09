import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { generalInquiryLink } from "@/lib/whatsapp";

export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section className="bg-brand">
      <div className="mx-auto grid max-w-content grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center px-4 py-12 text-left sm:px-6 lg:px-10 lg:py-20">
          <h2 className="font-display text-xl font-semibold leading-tight text-surface sm:text-3xl">
            {dict.finalCta.title}
          </h2>
          <p className="mt-3 max-w-md text-sm text-brand-light/90 sm:text-base">{dict.finalCta.subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href={`${base}/order-summary`}
              className="inline-flex items-center justify-center rounded bg-surface px-4 py-2.5 text-xs font-medium text-brand-dark transition-opacity hover:opacity-90 sm:px-6 sm:py-3 sm:text-sm"
            >
              {dict.finalCta.primaryCta}
            </Link>
            <a
              href={generalInquiryLink(dict)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded border border-surface/60 px-4 py-2.5 text-xs font-medium text-surface transition-colors hover:bg-surface/10 sm:px-6 sm:py-3 sm:text-sm"
            >
              {dict.finalCta.secondaryCta}
            </a>
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden sm:min-h-[320px] lg:min-h-[360px]">
          <img
            src="/images/sherinab-truck-cta.webp"
            alt="Sherinab Venture delivery truck"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
