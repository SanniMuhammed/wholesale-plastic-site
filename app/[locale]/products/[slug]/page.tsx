import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getAllProducts, getProductBySlug, getCategory } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return { title: product.name[locale], description: product.shortDescription[locale] };
}

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const base = `/${locale}`;

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <Link href={`${base}/products`} className="text-sm text-muted hover:text-ink">
        ← {dict.common.backToProducts}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductImage
          product={product}
          locale={locale}
          className="w-full"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        <div>
          {category && <p className="text-sm text-muted">{category.name[locale]}</p>}
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{product.name[locale]}</h1>
          <p className="mt-3 text-muted">{product.description[locale]}</p>

          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-ink-soft">{dict.common.availableColors}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded border border-border px-2.5 py-1 text-xs text-ink-soft"
                  >
                    {dict.colors[color]}
                  </span>
                ))}
              </div>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
            {product.capacity && (
              <div>
                <dt className="text-muted">{dict.common.capacity}</dt>
                <dd className="mt-0.5 font-medium text-ink">{product.capacity}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">{dict.common.material}</dt>
              <dd className="mt-0.5 font-medium text-ink">{product.material[locale]}</dd>
            </div>
            <div>
              <dt className="text-muted">{dict.common.packaging}</dt>
              <dd className="mt-0.5 font-medium text-ink">{product.packaging[locale]}</dd>
            </div>
            <div>
              <dt className="text-muted">{dict.common.useCase}</dt>
              <dd className="mt-0.5 font-medium text-ink">{product.useCase[locale]}</dd>
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
