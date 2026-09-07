import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import {
  getAllProducts,
  getFeaturedProducts,
} from "@/lib/catalog/products";
import { ProductCard } from "@/components/ProductCard";

export async function FeaturedProducts({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  // A product's Nº is its fixed position in the full catalog, not its
  // position within this featured row.
  const allProducts = await getAllProducts();
  const catalogIndex = new Map(
    allProducts.map((p, i) => [p.slug, i + 1])
  );

  return (
    <section className="bg-brand-light/40">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.featured.title}
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
              dict={dict}
              index={catalogIndex.get(product.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
