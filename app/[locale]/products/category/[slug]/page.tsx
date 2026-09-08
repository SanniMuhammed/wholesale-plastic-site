export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import { getProductsByCategory } from "@/lib/catalog/products";
import { BulkOrderGrid } from "@/components/BulkOrderGrid";
import { CategoryIllustration } from "@/components/illustrations/CategoryIllustration";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((category) => category.slug === value);
}

const CATEGORY_COPY: Record<CategorySlug, { en: string; fr: string }> = {
  buckets: { en: "Wholesale plastic buckets for retailers, distributors and businesses. Choose the capacity and style you need, then build your order.", fr: "Seaux en plastique en gros pour détaillants, distributeurs et entreprises. Choisissez la capacité et le modèle dont vous avez besoin, puis composez votre commande." },
  basins: { en: "Plastic basins in wholesale quantities for household, retail and commercial use. Compare available sizes and order what fits your market.", fr: "Bassines en plastique en quantités de gros pour la maison, le commerce et les entreprises. Comparez les tailles disponibles et commandez selon votre marché." },
  bowls: { en: "Wholesale plastic bowls for kitchens, food businesses, retailers and market traders. Browse the available sizes and packs.", fr: "Bols en plastique en gros pour cuisines, activités alimentaires, détaillants et commerçants. Découvrez les tailles et lots disponibles." },
  containers: { en: "Storage and transport containers supplied in wholesale quantities. Tell us your required volume and destination for a price quote.", fr: "Récipients de stockage et de transport fournis en quantités de gros. Indiquez le volume et la destination souhaités pour obtenir un devis." },
  household: { en: "Everyday plastic household products for shops, resellers and businesses buying in bulk.", fr: "Articles ménagers en plastique pour boutiques, revendeurs et entreprises qui achètent en gros." },
  other: { en: "Additional plastic products available for wholesale sourcing from Nigeria. If you need something not listed, ask our team.", fr: "Autres articles en plastique disponibles en gros depuis le Nigeria. Si vous cherchez un produit non répertorié, contactez notre équipe." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !isCategorySlug(slug)) return {};
  const locale = rawLocale as Locale;
  const category = CATEGORIES.find((item) => item.slug === slug)!;
  return { title: `${category.name[locale]} — Wholesale Plastic Catalog`, description: CATEGORY_COPY[slug][locale] };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !isCategorySlug(slug)) notFound();

  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const category = CATEGORIES.find((item) => item.slug === slug)!;
  const products = await getProductsByCategory(slug);
  const base = `/${locale}`;
  const whatsappHref = buildWhatsAppLink(locale === "fr" ? `Bonjour, je souhaite connaître vos prix de gros pour les ${category.name.fr.toLowerCase()}.` : `Hello, I'd like wholesale pricing for ${category.name.en.toLowerCase()}.`);
  const capacities = Array.from(new Set(products.map((product) => product.capacity).filter(Boolean))) as string[];

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex items-center gap-1 text-xs text-muted">
            <Link href={`${base}/products`} className="hover:text-ink">{dict.nav.products}</Link><ChevronRight size={13} aria-hidden /><span>{category.name[locale]}</span>
          </div>
          <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_240px]">
            <div>
              <p className="eyebrow">{locale === "fr" ? "Catégorie de gros" : "Wholesale category"}</p>
              <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">{category.name[locale]}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">{CATEGORY_COPY[slug][locale]}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`${base}/order-summary`} className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-medium text-surface hover:bg-brand-dark">{locale === "fr" ? "Commencer une commande" : "Start an order"}<ArrowRight size={15} aria-hidden /></Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded border border-border bg-background px-5 py-3 text-sm font-medium text-ink hover:border-ink">{dict.common.requestPrice}</a>
              </div>
            </div>
            <div className="hidden h-56 w-56 items-center justify-center rounded-2xl border border-border bg-background md:flex"><CategoryIllustration category={slug} className="h-40 w-40 text-brand opacity-70" aria-hidden /></div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-5">
          <div><p className="eyebrow">{locale === "fr" ? "Produits disponibles" : "Available products"}</p><h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">{products.length} {locale === "fr" ? "articles" : "products"}</h2></div>
          <Link href={`${base}/products`} className="text-sm font-medium text-brand hover:text-brand-dark">{dict.common.exploreProducts} →</Link>
        </div>
        {capacities.length > 0 && (
          <div className="py-6">
            <p className="text-sm font-semibold text-ink">{locale === "fr" ? "Choisir par capacité" : "Shop by capacity"}</p>
            <p className="mt-1 text-xs text-muted">{locale === "fr" ? "Tailles actuellement disponibles dans cette catégorie." : "Sizes currently available in this category."}</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {capacities.map((capacity) => <Link key={capacity} href={`${base}/products?category=${slug}&q=${encodeURIComponent(capacity)}`} className="shrink-0 rounded-full border border-border bg-background px-4 py-2 font-mono text-xs font-medium text-ink hover:border-ink">{capacity}</Link>)}
            </div>
          </div>
        )}
        {products.length > 0 ? <BulkOrderGrid products={products} locale={locale} dict={dict} /> : <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center"><p className="font-medium text-ink">{locale === "fr" ? "Aucun produit dans cette catégorie pour le moment." : "No products in this category yet."}</p><a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-medium text-brand">{dict.common.requestPrice} →</a></div>}
      </main>

      <section className="border-t border-border bg-ink text-surface"><div className="mx-auto flex max-w-content flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow text-surface/60">{locale === "fr" ? "Besoin d'une quantité spéciale ?" : "Need a specific quantity?"}</p><h2 className="mt-2 font-display text-2xl font-semibold">{locale === "fr" ? "Demandez votre prix de gros." : "Ask us for your wholesale price."}</h2></div><a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center rounded bg-surface px-5 py-3 text-sm font-semibold text-ink hover:opacity-90">{dict.common.requestPrice}<ArrowRight size={15} className="ml-2" aria-hidden /></a></div></section>
    </div>
  );
}
