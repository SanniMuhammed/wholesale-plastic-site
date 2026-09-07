export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import {
  getAllProducts,
  getProductBySlug,
} from "@/lib/catalog/products";
import { CATEGORIES } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name[locale], description: product.shortDescription[locale] };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const base = `/${locale}`;
  // Same fixed catalog position used on the listing grid, so "Nº 07" means
  // the same product wherever it appears.
  const allProducts = await getAllProducts();
  const plateNumber = allProducts.findIndex((p) => p.slug === product.slug) + 1;

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <Link href={`${base}/products`} className="text-sm text-muted transition-colors hover:text-ink">
        ← {dict.common.backToProducts}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImage
          product={product}
          locale={locale}
          className="w-full"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        <div>
          <p className="eyebrow">
            {`Nº ${String(plateNumber).padStart(2, "0")}`}
            {category && ` / ${category.name[locale]}`}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {product.name[locale]}
          </h1>
          <p className="mt-4 max-w-md text-muted">{product.description[locale]}</p>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-ink-soft">{dict.common.availableColors}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded border border-border px-2.5 py-1 font-mono text-xs text-ink-soft"
                  >
                    {dict.colors[color]}
                  </span>
                ))}
              </div>
            </div>
          )}

          <dl className="mt-6 border-t border-border">
            {product.capacity && (
              <div className="rule-row">
                <dt className="text-sm text-muted">{dict.common.capacity}</dt>
                <dd className="font-mono text-sm font-medium text-ink">{product.capacity}</dd>
              </div>
            )}
            <div className="rule-row">
              <dt className="text-sm text-muted">{dict.common.material}</dt>
              <dd className="font-mono text-sm font-medium text-ink">{product.material[locale]}</dd>
            </div>
            <div className="rule-row">
              <dt className="text-sm text-muted">{dict.common.packaging}</dt>
              <dd className="font-mono text-sm font-medium text-ink">{product.packaging[locale]}</dd>
            </div>
            <div className="rule-row">
              <dt className="text-sm text-muted">{dict.common.useCase}</dt>
              <dd className="font-mono text-sm font-medium text-ink">{product.useCase[locale]}</dd>
            </div>
          </dl>

          {product.wholesaleOnly && (
            <p className="mt-4 text-sm font-medium text-brand">{dict.common.wholesaleOrdersOnly}</p>
          )}

          <ProductOrderPanel product={product} locale={locale} dict={dict} />
        </div>
      </div>
    </div>
  );
}
