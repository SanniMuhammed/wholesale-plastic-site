import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";

export function DeliveryTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-content flex-col items-start gap-4 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {dict.deliveryTeaser.title}
          </h2>
          <p className="mt-2 max-w-lg text-muted">{dict.deliveryTeaser.subtitle}</p>
        </div>
        <Link
          href={`${base}/delivery`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
        >
          {dict.deliveryTeaser.cta}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
