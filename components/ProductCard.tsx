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
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted">
      <Link href={href}>
        <ProductImage product={product} locale={locale} className="rounded-none rounded-t-lg" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link
          href={href}
          className="font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand"
        >
          {product.name[locale]}
        </Link>
        {product.capacity && <p className="font-mono text-xs text-muted">{product.capacity}</p>}
        <p className="text-xs font-medium text-brand">{dict.common.wholesalePricing}</p>
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center rounded border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            {dict.common.viewProduct}
          </Link>
          <AddToOrderButton slug={product.slug} dict={dict} />
        </div>
      </div>
    </div>
  );
}
