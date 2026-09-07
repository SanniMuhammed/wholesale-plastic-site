import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { CATEGORIES } from "@/lib/products";
import { HowItWorksSection } from "@/components/HowItWorksSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.wholesale.title, description: dict.meta.wholesale.description };
}

export default async function WholesalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}`;
  const wp = dict.wholesalePage;

  return (
    <div>
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <p className="eyebrow">{dict.nav.wholesale}</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold text-ink sm:text-5xl">
          {wp.heroTitle}
        </h1>
        <p className="mt-4 max-w-xl text-muted">{wp.heroSubtitle}</p>
        <Link
          href={`${base}/order-summary`}
          className="mt-6 inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
        >
          {wp.cta}
        </Link>
      </div>

      <div className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{wp.whoWeServeTitle}</h2>
            <ul className="mt-5 divide-y divide-border border-t border-border">
              {wp.whoWeServe.map((item, i) => (
                <li key={item} className="flex items-baseline gap-3 py-2.5 text-sm text-ink-soft">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{wp.whatWeSupplyTitle}</h2>
            <ul className="mt-5 divide-y divide-border border-t border-border">
              {CATEGORIES.map((c, i) => (
                <li key={c.slug} className="flex items-baseline gap-3 py-2.5 text-sm text-ink-soft">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <Link href={`${base}/products?category=${c.slug}`} className="transition-colors hover:text-brand">
                    {c.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{wp.whySection.title}</h2>
        <ul className="mt-6 grid gap-6 border-t-2 border-border pt-6 sm:grid-cols-2">
          {wp.whySection.points.map((point, i) => (
            <li key={point}>
              <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm text-ink-soft">{point}</p>
            </li>
          ))}
        </ul>
      </div>

      <HowItWorksSection dict={dict} />

      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{wp.bulkTitle}</h2>
        <p className="mt-3 max-w-2xl text-muted">{wp.bulkBody}</p>
      </div>

      <div className="border-t border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{wp.faqTitle}</h2>
          <div className="mt-6 divide-y divide-border border-t border-border">
            {wp.faq.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
                  {item.q}
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-14 text-center sm:px-6">
        <Link
          href={`${base}/order-summary`}
          className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
        >
          {wp.cta}
        </Link>
      </div>
    </div>
  );
}
