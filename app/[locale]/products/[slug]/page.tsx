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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wholesale-plastic-site-two.vercel.app";

const COMPLEMENTARY_CATEGORIES: Record<string, string[]> = {
  buckets: ["basins", "containers", "household"],
  basins: ["buckets", "bowls", "containers"],
  bowls: ["basins", "containers", "household"],
  containers: ["household", "bowls", "buckets"],
  household: ["containers", "buckets", "basins"],
  other: ["household", "containers", "buckets"],
};

function relatedScore(current: Awaited<ReturnType<typeof getProductBySlug>>, candidate: Awaited<ReturnType<typeof getProductBySlug>>) {
  if (!current || !candidate) return -Infinity;
  let score = candidate.featured ? 0.25 : 0;
  if (candidate.category === current.category) score += 4;
  const complementary = COMPLEMENTARY_CATEGORIES[current.category] ?? [];
  const complementIndex = complementary.indexOf(candidate.category);
  if (complementIndex >= 0) score += 3 - complementIndex * 0.5;
  const currentWords = new Set(`${current.useCase.en} ${current.useCase.fr} ${current.shortDescription.en} ${current.shortDescription.fr}`.toLowerCase().split(/[^a-z0-9àâçéèêëîïôùûüÿœæ]+/i).filter((word) => word.length > 3));
  const candidateWords = `${candidate.useCase.en} ${candidate.useCase.fr} ${candidate.shortDescription.en} ${candidate.shortDescription.fr}`.toLowerCase().split(/[^a-z0-9àâçéèêëîïôùûüÿœæ]+/i).filter((word) => word.length > 3);
  score += Math.min(candidateWords.filter((word) => currentWords.has(word)).length, 3) * 0.5;
  score += candidate.colors.filter((color) => current.colors.includes(color)).length * 0.15;
  return score;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name[locale]} | Sherinab Venture`;
  const description = product.shortDescription[locale];
  const image = product.images[0] || product.image;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}/products/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Sherinab Venture",
      url: `${SITE_URL}/${locale}/products/${product.slug}`,
      images: image ? [{ url: image, alt: product.name[locale] }] : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Sherinab Venture" }],
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : ["/opengraph-image.png"] },
  };
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
  const relatedProducts = allProducts.filter((p) => p.slug !== product.slug).sort((a, b) => relatedScore(product, b) - relatedScore(product, a)).slice(0, 4);
  const catalogHref = `${base}/products?category=${product.category}`;
  const hasConfirmedPrice = (product.pricingMode === "fixed" || product.pricingMode === "starting_from") && product.price != null;
  const priceLabel = product.pricingMode === "starting_from" ? (locale === "fr" ? "À partir de" : "Starting from") : locale === "fr" ? "Prix" : "Price";
  const priceText = hasConfirmedPrice ? `₦${product.price!.toLocaleString(locale === "fr" ? "fr-FR" : "en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : locale === "fr" ? "Prix de gros sur demande" : "Wholesale price on request";

  return (
    <div className="mx-auto max-w-content px-4 py-7 sm:px-6 sm:py-10 lg:py-12">
      <Link href={`${base}/products`} className="inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-ink">← {dict.common.backToProducts}</Link>

      <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:gap-12 xl:gap-16">
        <div className="lg:sticky lg:top-24">
          <ProductGallery key={product.slug} images={product.images} name={product.name[locale]} locale={locale} />
          {product.wholesaleOnly && <div className="mt-3"><span className="rounded-full border border-brand/30 bg-brand-light px-3 py-1.5 text-xs font-medium text-brand">{dict.common.wholesaleOrdersOnly}</span></div>}
        </div>

        <div className="min-w-0">
          <p className="eyebrow">{`Nº ${String(plateNumber).padStart(2, "0")}`}{category && ` / ${category.name[locale]}`}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl">{product.name[locale]}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">{product.description[locale]}</p>

          <div className="mt-6 flex items-end justify-between gap-4 border-y border-border py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{priceLabel}</p>
              <p className="mt-1 font-display text-2xl font-semibold leading-none text-ink sm:text-3xl">{priceText}{hasConfirmedPrice && product.priceUnit && <span className="ml-1 text-sm font-sans font-medium text-muted">{product.priceUnit}</span>}</p>
            </div>
            <span className="max-w-[150px] text-right text-xs leading-5 text-muted">{locale === "fr" ? "Quantités de gros et livraison confirmées à la commande." : "Wholesale quantities and delivery confirmed with your order."}</span>
          </div>

          {product.colors.length > 0 && <div className="mt-6"><p className="text-sm font-medium text-ink-soft">{dict.common.availableColors}</p><div className="mt-2 flex flex-wrap gap-2">{product.colors.map((color) => <span key={color} className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink-soft">{dict.colors[color]}</span>)}</div></div>}

          <div className="mt-7">
            <div className="flex items-end justify-between gap-4"><h2 className="font-display text-xl font-semibold text-ink">{dict.common.productDetails}</h2><span className="font-mono text-[10px] uppercase tracking-wider text-muted">Wholesale spec</span></div>
            <dl className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
              <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.capacity}</dt><dd className="font-mono text-sm font-medium text-ink">{product.capacity || "—"}</dd></div>
              <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.material}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.material[locale]}</dd></div>
              <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.packaging}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.packaging[locale]}</dd></div>
              <div className="rule-row px-4"><dt className="text-sm text-muted">{dict.common.useCase}</dt><dd className="max-w-[60%] text-right font-mono text-sm font-medium text-ink">{product.useCase[locale]}</dd></div>
            </dl>
          </div>

          <ProductOrderPanel product={product} locale={locale} dict={dict} hasConfirmedPrice={hasConfirmedPrice} />
        </div>
      </div>

      <ProductReviews reviews={reviews} productId={product.cmsId} locale={locale} />

      {relatedProducts.length > 0 && <section className="mt-14 border-t border-border pt-10 sm:mt-20 sm:pt-14">
        <div className="flex items-end justify-between gap-6">
          <div><p className="eyebrow">{category?.name[locale]}</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{locale === "fr" ? "Produits similaires" : "You may also need"}</h2></div>
          <Link href={catalogHref} className="hidden text-sm font-medium text-brand hover:text-brand-dark sm:inline-flex">{dict.common.exploreProducts} →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{relatedProducts.map((related) => <ProductCard key={related.slug} product={related} locale={locale} dict={dict} />)}</div>
        <Link href={catalogHref} className="mt-5 inline-flex text-sm font-medium text-brand sm:hidden">{dict.common.exploreProducts} →</Link>
      </section>}
    </div>
  );
}
