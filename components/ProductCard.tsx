import Link from "next/link";
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

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lifted">
      <Link href={href} className="block shrink-0 overflow-hidden rounded-t-lg">
        <ProductImage
          product={product}
          locale={locale}
          className="rounded-none rounded-t-lg"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow min-h-[1.1rem] text-brand/70">
          {dict.categories[product.category]}
        </p>

        <Link
          href={href}
          className="mt-1 line-clamp-2 min-h-[2.65rem] font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand"
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
              <p className="pt-1 font-medium leading-4 text-ink">
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
