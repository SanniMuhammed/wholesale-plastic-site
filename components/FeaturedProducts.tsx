import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { getFeaturedProducts } from "@/lib/catalog/products";
import { ProductCard } from "@/components/ProductCard";

export async function FeaturedProducts({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  const copy = locale === "fr"
    ? {
        eyebrow: "CATALOGUE GROSSISTE",
        intro: "Sélectionnez les produits dont vous avez besoin et ajoutez-les directement à votre commande.",
        browse: "Voir tout le catalogue",
      }
    : {
        eyebrow: "WHOLESALE CATALOGUE",
        intro: "Choose the products you need and add them directly to your order.",
        browse: "View full catalogue",
      };

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-content px-4 py-11 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex items-end justify-between gap-5 border-b border-border pb-5">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand/80">{copy.eyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{dict.featured.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">{copy.intro}</p>
          </div>
          <Link href={`/${locale}/products`} className="shrink-0 rounded-md border border-border px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand sm:px-4 sm:text-sm">
            {copy.browse} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
