import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { CatalogClient } from "@/components/CatalogClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.products.title, description: dict.meta.products.description };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
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
