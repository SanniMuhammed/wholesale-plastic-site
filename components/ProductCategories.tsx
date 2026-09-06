import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { cx } from "@/lib/utils";

const CATEGORY_TINTS: Record<CategorySlug, string> = {
  buckets: "bg-brand-light",
  basins: "bg-accent-light",
  bowls: "bg-brand-light",
  containers: "bg-accent-light",
  household: "bg-brand-light",
  other: "bg-accent-light",
};

export function ProductCategories({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section id="categories" className="mx-auto max-w-content px-4 py-16 sm:px-6 scroll-mt-20">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        {dict.categoriesSection.title}
      </h2>
      <p className="mt-2 max-w-xl text-muted">{dict.categoriesSection.subtitle}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`${base}/products?category=${category.slug}`}
            className={cx(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded border border-border p-4 text-center transition-colors hover:border-ink",
              CATEGORY_TINTS[category.slug]
            )}
          >
            <span className="text-sm font-medium text-ink">{category.name[locale]}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
