import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { getFeaturedProducts } from "@/lib/catalog/products";
import { ProductCard } from "@/components/ProductCard";

export async function FeaturedProducts({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  return (
    <section>
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="eyebrow text-brand">02 / Featured</p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{dict.featured.title}</h2>
          </div>
          <Link href={`/${locale}/products`} className="shrink-0 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand">
            {dict.common.exploreProducts} →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
