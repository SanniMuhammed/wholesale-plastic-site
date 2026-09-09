import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { generalInquiryLink } from "@/lib/whatsapp";

export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section className="bg-brand">
      <div className="mx-auto grid max-w-content lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-16 text-center sm:px-6 lg:px-10 lg:py-20 lg:text-left">
          <h2 className="font-display text-2xl font-semibold text-surface sm:text-3xl">
            {dict.finalCta.title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-brand-light/90 lg:mx-0">{dict.finalCta.subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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

        <div className="relative min-h-[260px] overflow-hidden sm:min-h-[320px] lg:min-h-[360px]">
          <Image
            src="/images/sherinab-truck-cta.webp"
            alt="Sherinab Venture delivery truck"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
