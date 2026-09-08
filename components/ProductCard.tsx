import Link from "next/link";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductImage } from "@/components/ProductImage";
import { AddToOrderButton } from "@/components/AddToOrderButton";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const base = `/${locale}`;
  const href = `${base}/products/${product.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lifted">
      <Link href={href} className="block overflow-hidden rounded-t-lg">
        <ProductImage
          product={product}
          locale={locale}
          className="rounded-none rounded-t-lg transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="eyebrow text-brand/70">{dict.categories[product.category]}</p>

        <Link
          href={href}
          className="font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand"
        >
          {product.name[locale]}
        </Link>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted">
          {product.shortDescription[locale]}
        </p>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-muted">
          {product.capacity && <span>{product.capacity}</span>}
          <span>{product.packaging[locale]}</span>
        </div>

        <div className="mt-3">
          <AddToOrderButton
            slug={product.slug}
            productName={product.name[locale]}
            dict={dict}
            fullWidth
          />
        </div>
      </div>
    </article>
  );
}
