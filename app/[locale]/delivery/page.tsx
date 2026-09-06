import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return { title: dict.meta.delivery.title, description: dict.meta.delivery.description };
}

export default function DeliveryPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const dp = dict.deliveryPage;

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{dp.title}</h1>
      <p className="mt-4 max-w-xl text-muted">{dp.intro}</p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dp.steps.map((step, i) => (
          <li key={step} className="rounded border border-border p-4">
            <span className="font-display text-lg font-semibold text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-sm text-ink-soft">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded border border-border bg-surface p-6">
        <h2 className="font-medium text-ink">{dp.factorsTitle}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dp.factors.map((f) => (
            <li key={f} className="text-sm text-muted">
              • {f}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{dp.note}</p>
      </div>

      <Link
        href={`/${locale}/order-summary`}
        className="mt-10 inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
      >
        {dp.cta}
      </Link>
    </div>
  );
}
