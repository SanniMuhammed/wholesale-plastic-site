import type { SVGProps } from "react";
import type { CategorySlug } from "@/lib/products";

type IllustrationProps = SVGProps<SVGSVGElement>;

/**
 * Hand-drawn-style line illustrations, one per product category.
 * These stand in for real product photography: each one is a specific
 * silhouette (not a generic box/package icon), drawn with a slightly
 * irregular, single-weight line so the catalog reads as illustrated
 * rather than auto-generated. Swap for real photos via ProductImage
 * once available -- this is the interim visual language.
 */

function Bucket(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <path
        d="M32 40 L38 96 Q60 102 82 96 L88 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="60" cy="40" rx="28" ry="7" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M42 36 Q40 20 60 20 Q80 20 78 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M46 52 L52 88" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M74 52 L68 88" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function Basin(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <path
        d="M22 46 Q60 96 98 46"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="46" rx="38" ry="9" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M14 44 Q10 46 14 48"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M106 44 Q110 46 106 48"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M34 56 Q60 78 86 56" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function Bowl(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <path
        d="M28 50 Q30 88 60 90 Q90 88 92 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="50" rx="32" ry="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M40 60 Q60 74 80 60" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function Container(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <rect
        x="30"
        y="38"
        width="60"
        height="56"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M26 38 L94 38 L88 30 L32 30 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M50 30 L50 22 Q60 16 70 22 L70 30" stroke="currentColor" strokeWidth="2" />
      <path d="M30 60 L90 60" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function Basket(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <path
        d="M26 44 L34 92 Q60 98 86 92 L94 44"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="60" cy="44" rx="34" ry="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M36 44 L36 84" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M50 44 L52 90" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M70 44 L68 90" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M84 44 L84 84" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

function Household(props: IllustrationProps) {
  // Stool / crate style: simple stacked-slat silhouette
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <rect x="28" y="34" width="64" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M36 48 L30 92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 48 L90 92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 74 L80 74" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<CategorySlug, (props: IllustrationProps) => JSX.Element> = {
  buckets: Bucket,
  basins: Basin,
  bowls: Bowl,
  containers: Container,
  household: Basket,
  other: Household,
};

export function CategoryIllustration({
  category,
  ...props
}: { category: CategorySlug } & IllustrationProps) {
  const Illustration = ILLUSTRATIONS[category] ?? Household;
  return <Illustration {...props} />;
}
