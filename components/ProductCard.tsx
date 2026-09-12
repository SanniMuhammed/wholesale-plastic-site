import Link from "next/link";
import type { MouseEvent } from "react";
import type { CatalogProduct } from "@/lib/catalog/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductImage } from "@/components/ProductImage";
import { AddToOrderButton } from "@/components/AddToOrderButton";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: CatalogProduct;
  locale: Locale;
  dict: Dictionary;
}) {
  const base = `/${locale}`;
  const href = `${base}/products/${product.slug}`;
  const hasPrice =
    (product.pricingMode === "fixed" || product.pricingMode === "starting_from") &&
    product.price != null;
  const priceLabel =
    product.pricingMode === "starting_from"
      ? locale === "fr"
        ? "À partir de"
        : "Starting from"
      : locale === "fr"
        ? "Prix"
        : "Price";
  const price = hasPrice
    ? `₦${product.price!.toLocaleString(locale === "fr" ? "fr-FR" : "en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : null;

  function handleProductClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lifted">
      <Link href={href} onClick={handleProductClick} className="block shrink-0 overflow-hidden rounded-t-lg">
        <ProductImage
          product={product}
          locale={locale}
          className="rounded-none rounded-t-lg transition-transform duration-300 group-hover:scale-[1.015]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex min-h-[1.2rem] items-center justify-between gap-2">
          <p className="eyebrow truncate text-brand/70">
            {dict.categories[product.category]}
          </p>
          {product.capacity && (
            <span className="shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-ink">
              {product.capacity}
            </span>
          )}
        </div>

        <Link
          href={href}
          onClick={handleProductClick}
          className="mt-1 line-clamp-2 min-h-[2.65rem] font-display text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand sm:text-base"
        >
          {product.name[locale]}
        </Link>

        <div className="mt-auto border-t border-border/70 pt-3">
          <div className="min-h-[3.25rem]">
            {price ? (
              <>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                  {priceLabel}
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-ink">
                  {price}
                  {product.priceUnit && (
                    <span className="ml-1 text-[10px] font-sans font-medium text-muted">
                      {product.priceUnit}
                    </span>
                  )}
                </p>
              </>
            ) : (
              <p className="pt-1 text-sm font-medium leading-4 text-ink">
                {locale === "fr"
                  ? "Prix de gros sur demande"
                  : "Wholesale price on request"}
              </p>
            )}
          </div>

          <div className="pt-3">
            <AddToOrderButton
              slug={product.slug}
              productName={product.name[locale]}
              dict={dict}
              fullWidth
            />
          </div>
        </div>
      </div>
    </article>
  );
}
