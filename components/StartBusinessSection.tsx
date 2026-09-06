import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";

export function StartBusinessSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  const segments = [dict.startBusiness.segments.start, dict.startBusiness.segments.restock, dict.startBusiness.segments.distribute];

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.startBusiness.title}
        </h2>
        <p className="mt-4 text-muted">{dict.startBusiness.body}</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.title} className="rounded border border-border p-5">
            <h3 className="font-display font-semibold text-ink">{segment.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{segment.description}</p>
          </div>
        ))}
      </div>

      <Link
        href={`${base}/order-summary`}
        className="mt-8 inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
      >
        {dict.startBusiness.cta}
      </Link>
    </section>
  );
}
