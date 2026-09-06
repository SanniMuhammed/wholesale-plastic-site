import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { generalInquiryLink } from "@/lib/whatsapp";

export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section className="bg-brand">
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-surface sm:text-3xl">
          {dict.finalCta.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-brand-light/90">{dict.finalCta.subtitle}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`${base}/order-summary`}
            className="inline-flex items-center justify-center rounded bg-surface px-6 py-3 text-sm font-medium text-brand-dark transition-opacity hover:opacity-90"
          >
            {dict.finalCta.primaryCta}
          </Link>
          <a
            href={generalInquiryLink(dict)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded border border-surface/60 px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-surface/10"
          >
            {dict.finalCta.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
