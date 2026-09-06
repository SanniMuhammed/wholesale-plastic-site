import Image from "next/image";
import { Package } from "lucide-react";
import type { Product, CategorySlug } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import { cx } from "@/lib/utils";

const CATEGORY_TINTS: Record<CategorySlug, string> = {
  buckets: "bg-brand-light",
  basins: "bg-accent-light",
  bowls: "bg-brand-light",
  containers: "bg-accent-light",
  household: "bg-brand-light",
  other: "bg-accent-light",
};

interface ProductImageProps {
  product: Product;
  locale: Locale;
  className?: string;
  sizes?: string;
}

/**
 * Renders the real product photo when `product.image` is set.
 * Until then, shows a plain placeholder block instead of a stock photo --
 * per the brief, real photography should be added later, not faked.
 */
export function ProductImage({ product, locale, className, sizes }: ProductImageProps) {
  if (product.image) {
    return (
      <div className={cx("relative aspect-square overflow-hidden rounded", className)}>
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          sizes={sizes || "(min-width: 768px) 25vw, 50vw"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cx(
        "flex aspect-square flex-col items-center justify-center gap-2 rounded border border-border",
        CATEGORY_TINTS[product.category],
        className
      )}
    >
      <Package size={32} strokeWidth={1.5} className="text-ink-soft/60" />
      {product.capacity && (
        <span className="text-xs font-medium text-ink-soft/70">{product.capacity}</span>
      )}
    </div>
  );
}
