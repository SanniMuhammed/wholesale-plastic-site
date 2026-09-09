export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getAllProducts } from "@/lib/catalog/products";
import { CatalogClient } from "@/components/CatalogClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) return {};

  const dict = getDictionary(rawLocale);

  return {
    title: dict.meta.products.title,
    description: dict.meta.products.description,
    alternates: { canonical: `/${rawLocale}/products` },
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <p className="eyebrow">{dict.footer.catalog}</p>

      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
        {dict.nav.products}
      </h1>

      <div className="mt-10">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <CatalogClient
            locale={locale}
            dict={dict}
            products={products}
          />
        </Suspense>
      </div>
    </div>
  );
}
