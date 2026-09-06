import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { CatalogClient } from "@/components/CatalogClient";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return { title: dict.meta.products.title, description: dict.meta.products.description };
}

export default function ProductsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">{dict.nav.products}</h1>
      <div className="mt-8">
        <Suspense fallback={null}>
          <CatalogClient locale={locale} dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
