import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { getFeaturedProducts } from "@/lib/catalog/products";
import { ProductCard } from "@/components/ProductCard";

export async function FeaturedProducts({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  return (
    <section className="bg-brand-light/40">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-end justify-between gap-4 border-b border-brand/15 pb-5">
          <div>
            <p className="eyebrow text-brand">02 / Featured</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{dict.featured.title}</h2>
          </div>
          <Link href={`/${locale}/products`} className="shrink-0 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
            {dict.common.exploreProducts} →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
