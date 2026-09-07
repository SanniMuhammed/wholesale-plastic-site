import Image from "next/image";
import type { Product, CategorySlug, ColorKey } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import { cx } from "@/lib/utils";
import { CategoryIllustration } from "@/components/illustrations/CategoryIllustration";

// Each category gets one consistent tint -- not an alternating pattern --
// so color carries meaning (this is what a bucket page looks like) instead
// of just breaking up a grid visually.
const CATEGORY_TINTS: Record<CategorySlug, string> = {
  buckets: "bg-brand-light",
  basins: "bg-clay-light",
  bowls: "bg-ochre-light",
  containers: "bg-accent-light",
  household: "bg-brand-light",
  other: "bg-clay-light",
};

const CATEGORY_INK: Record<CategorySlug, string> = {
  buckets: "text-brand",
  basins: "text-clay",
  bowls: "text-ochre",
  containers: "text-accent",
  household: "text-brand",
  other: "text-clay",
};

const SWATCH_HEX: Record<ColorKey, string> = {
  red: "#C0392B",
  blue: "#2E5C8A",
  green: "#3D7A4F",
  yellow: "#D4A017",
  white: "#F3F1EA",
  black: "#232320",
  orange: "#C97A2B",
  gray: "#8B897E",
  assorted: "#A8492E",
};

interface ProductImageProps {
  product: Product;
  locale: Locale;
  className?: string;
  sizes?: string;
}

/**
 * Renders the real product photo when `product.image` is set. Until real
 * photography exists, shows a category-specific line illustration on a
 * consistent category tint, with the product's actual available colors
 * shown as a small swatch strip -- a deliberate illustrated-catalog style
 * rather than a generic "no image" placeholder.
 */
export function ProductImage({ product, locale, className, sizes }: ProductImageProps) {
  if (product.image) {
    return (
      <div className={cx("relative aspect-square overflow-hidden rounded-lg", className)}>
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

  const swatches = product.colors.filter((c) => c !== "assorted").slice(0, 4);

  return (
    <div
      className={cx(
        "relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg",
        CATEGORY_TINTS[product.category],
        className
      )}
    >
      {/* Faint oversized watermark echo of the shape for depth, behind the main illustration */}
      <CategoryIllustration
        category={product.category}
        className={cx("absolute h-[140%] w-[140%] opacity-[0.06]", CATEGORY_INK[product.category])}
        aria-hidden
      />
      <CategoryIllustration
        category={product.category}
        className={cx("relative h-[52%] w-[52%]", CATEGORY_INK[product.category])}
      />
      {product.capacity && (
        <span className="relative mt-2 font-mono text-xs text-ink-soft/70">{product.capacity}</span>
      )}
      {swatches.length > 0 && (
        <div className="relative mt-2 flex items-center gap-1">
          {swatches.map((color) => (
            <span
              key={color}
              className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: SWATCH_HEX[color] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
