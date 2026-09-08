export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getAllProducts, getProductBySlug } from "@/lib/catalog/products";
import { CATEGORIES } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name[locale], description: product.shortDescription[locale] };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const base = `/${locale}`;
  const allProducts = await getAllProducts();
  const plateNumber = allProducts.findIndex((p) => p.slug === product.slug) + 1;
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const catalogHref = `${base}/products?category=${product.category}`;

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`${base}/products`} className="inline-flex text-sm text-muted transition-colors hover:text-ink">← {dict.common.backToProducts}</Link>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:gap-14 xl:gap-20">
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <ProductImage product={product} locale={locale} className="rounded-none" sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            <span className="rounded-full border border-border px-3 py-1.5">{dict.common.wholesalePricing}</span>
            {product.wholesaleOnly && <span className="rounded-full border border-brand/30 bg-brand-light px-3 py-1.5 font-medium text-brand">{dict.common.wholesaleOrdersOnly}</span>}
          </div>
        </div>
        <div>
          <p className="eyebrow">{`Nº ${String(plateNumber).padStart(2, "0")}`}{category && ` / ${category.name[locale]}`}</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">{product.name[locale]}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">{product.description[locale]}</p>
          {product.colors.length > 0 && (
            <div className="mt-7"><p className="text-sm font-medium text-ink-soft">{dict.common.availableColors}</p><div className="mt-2 flex flex-wrap gap-2">{product.colors.map((color) => <span key={color} className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-ink-soft">{dict.colors[color]}</span>)}</div></div>
          )}
          <div className="mt-8"><div className="flex items-end justify-between gap-4"><h2 className="font-display text-xl font-semibold text-ink">{dict.common.productDetails}</h2><span className="font-mono text-[10px] uppercase tracking-wider text-muted">Wholesale spec</span></div><dl className="mt-3 overflow-hidden rounded-xl border border-border">
            {product.capacity && <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.capacity}</dt><dd className="font-mono text-sm font-medium text-ink">{product.capacity}</dd></div>}
            <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.material}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.material[locale]}</dd></div>
            <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.packaging}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.packaging[locale]}</dd></div>
            <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.useCase}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.useCase[locale]}</dd></div>
          </dl></div>
          <ProductOrderPanel product={product} locale={locale} dict={dict} />
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-12 sm:mt-24 sm:pt-16">
          <div className="flex items-end justify-between gap-6"><div><p className="eyebrow">{category?.name[locale]}</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{locale === "fr" ? "Produits similaires" : "You may also need"}</h2></div><Link href={catalogHref} className="hidden text-sm font-medium text-brand hover:text-brand-dark sm:inline-flex">{dict.common.exploreProducts} →</Link></div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{relatedProducts.map((related) => <ProductCard key={related.slug} product={related} locale={locale} dict={dict} />)}</div>
          <Link href={catalogHref} className="mt-5 inline-flex text-sm font-medium text-brand sm:hidden">{dict.common.exploreProducts} →</Link>
        </section>
      )}
    </div>
  );
}
