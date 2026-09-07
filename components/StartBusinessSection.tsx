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

      <div className="mt-10 grid gap-8 border-t-2 border-border pt-6 sm:grid-cols-3 sm:gap-6">
        {segments.map((segment, i) => (
          <div key={segment.title}>
            <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">{segment.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{segment.description}</p>
          </div>
        ))}
      </div>

      <Link
        href={`${base}/order-summary`}
        className="mt-10 inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
      >
        {dict.startBusiness.cta}
      </Link>
    </section>
  );
}
