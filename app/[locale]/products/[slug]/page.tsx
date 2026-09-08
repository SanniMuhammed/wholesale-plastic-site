export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getAllProducts, getProductBySlug } from "@/lib/catalog/products";
import { listProductReviews } from "@/lib/cms/reviews";
import { CATEGORIES } from "@/lib/products";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";
import { ProductCard } from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name[locale], description: product.shortDescription[locale] };
}

function PriceBlock({ product, locale }: { product: Awaited<ReturnType<typeof getProductBySlug>>; locale: Locale }) {
  if (!product) return null;
  if ((product.pricingMode === "fixed" || product.pricingMode === "starting_from") && product.price != null) {
    const label = product.pricingMode === "fixed" ? (locale === "fr" ? "Prix" : "Price") : (locale === "fr" ? "À partir de" : "Starting from");
    return <div className="rounded-xl border border-brand/20 bg-brand-light/50 p-4"><p className="text-xs uppercase tracking-wider text-muted">{label}</p><p className="mt-1 font-display text-2xl font-semibold text-ink">{product.price.toLocaleString(locale === "fr" ? "fr-FR" : "en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}{product.priceUnit ? <span className="ml-1 text-sm font-sans font-medium text-muted">{product.priceUnit}</span> : null}</p></div>;
  }
  return <div className="rounded-xl border border-border bg-surface p-4"><p className="text-xs uppercase tracking-wider text-muted">{locale === "fr" ? "Tarification" : "Pricing"}</p><p className="mt-1 font-medium text-ink">{locale === "fr" ? "Demandez le prix de gros" : "Request wholesale pricing"}</p><p className="mt-1 text-xs leading-relaxed text-muted">{locale === "fr" ? "Le prix peut varier selon la quantité et la destination." : "Pricing may vary by quantity and destination."}</p></div>;
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
  const [allProducts, reviews] = await Promise.all([getAllProducts(), listProductReviews(product.cmsId)]);
  const plateNumber = allProducts.findIndex((p) => p.slug === product.slug) + 1;
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const catalogHref = `${base}/products?category=${product.category}`;
  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`${base}/products`} className="inline-flex text-sm text-muted transition-colors hover:text-ink">← {dict.common.backToProducts}</Link>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:gap-14 xl:gap-20">
        <div className="lg:sticky lg:top-24"><ProductGallery images={product.images} name={product.name[locale]} locale={locale} />{product.wholesaleOnly && <div className="mt-3"><span className="rounded-full border border-brand/30 bg-brand-light px-3 py-1.5 text-xs font-medium text-brand">{dict.common.wholesaleOrdersOnly}</span></div>}</div>
        <div>
          <p className="eyebrow">{`Nº ${String(plateNumber).padStart(2, "0")}`}{category && ` / ${category.name[locale]}`}</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">{product.name[locale]}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">{product.description[locale]}</p>
          {product.colors.length > 0 && <div className="mt-7"><p className="text-sm font-medium text-ink-soft">{dict.common.availableColors}</p><div className="mt-2 flex flex-wrap gap-2">{product.colors.map((color) => <span key={color} className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-ink-soft">{dict.colors[color]}</span>)}</div></div>}
          <div className="mt-8"><div className="flex items-end justify-between gap-4"><h2 className="font-display text-xl font-semibold text-ink">{dict.common.productDetails}</h2><span className="font-mono text-[10px] uppercase tracking-wider text-muted">Wholesale spec</span></div><dl className="mt-3 overflow-hidden rounded-xl border border-border"><div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.capacity}</dt><dd className="font-mono text-sm font-medium text-ink">{product.capacity || "—"}</dd></div><div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.material}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.material[locale]}</dd></div><div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.packaging}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.packaging[locale]}</dd></div><div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.useCase}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.useCase[locale]}</dd></div></dl></div>
          <div className="mt-7"><PriceBlock product={product} locale={locale} /></div>
          <ProductOrderPanel product={product} locale={locale} dict={dict} />
        </div>
      </div>
      <ProductReviews reviews={reviews} locale={locale} />
      {relatedProducts.length > 0 && <section className="mt-16 border-t border-border pt-12 sm:mt-24 sm:pt-16"><div className="flex items-end justify-between gap-6"><div><p className="eyebrow">{category?.name[locale]}</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{locale === "fr" ? "Produits similaires" : "You may also need"}</h2></div><Link href={catalogHref} className="hidden text-sm font-medium text-brand hover:text-brand-dark sm:inline-flex">{dict.common.exploreProducts} →</Link></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{relatedProducts.map((related) => <ProductCard key={related.slug} product={related} locale={locale} dict={dict} />)}</div><Link href={catalogHref} className="mt-5 inline-flex text-sm font-medium text-brand sm:hidden">{dict.common.exploreProducts} →</Link></section>}
    </div>
  );
}
