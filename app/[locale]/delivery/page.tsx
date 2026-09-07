import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.delivery.title, description: dict.meta.delivery.description };
}

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const dp = dict.deliveryPage;

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <p className="eyebrow">{dict.nav.delivery}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{dp.title}</h1>
      <p className="mt-4 max-w-xl text-muted">{dp.intro}</p>

      <ol className="mt-10 grid gap-8 border-t-2 border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {dp.steps.map((step, i) => (
          <li key={step}>
            <span className="font-mono text-lg font-bold text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-sm text-ink-soft">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 border-t border-border pt-8">
        <h2 className="font-display text-lg font-semibold text-ink">{dp.factorsTitle}</h2>
        <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {dp.factors.map((f) => (
            <li key={f} className="border-b border-border py-2.5 text-sm text-muted">
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-2xl text-sm text-muted">{dp.note}</p>
      </div>

      <Link
        href={`/${locale}/order-summary`}
        className="mt-12 inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
      >
        {dp.cta}
      </Link>
    </div>
  );
}
