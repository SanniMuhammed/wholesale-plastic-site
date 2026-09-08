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
  index,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  index?: number;
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
        <p className="eyebrow flex items-center gap-1.5">
          {typeof index === "number" && <span>{String(index).padStart(2, "0")}</span>}
          {typeof index === "number" && <span className="text-border">/</span>}
          <span>{dict.categories[product.category]}</span>
        </p>

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

        <p className="inline-flex w-fit rounded-full bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-brand">
          {dict.common.wholesalePricing}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center rounded border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            {dict.common.viewProduct}
          </Link>
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
