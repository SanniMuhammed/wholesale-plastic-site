import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { cx } from "@/lib/utils";
import { CategoryIllustration } from "@/components/illustrations/CategoryIllustration";

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

const FEATURED_COUNT = 2;

export function ProductCategories({
  locale,
  dict,
  categoryImages,
}: {
  locale: Locale;
  dict: Dictionary;
  categoryImages?: Record<string, string>;
}) {
  const base = `/${locale}`;
  const featured = CATEGORIES.slice(0, FEATURED_COUNT);
  const rest = CATEGORIES.slice(FEATURED_COUNT);

  return (
    <section id="categories" className="mx-auto max-w-content px-4 py-16 sm:px-6 scroll-mt-20">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{dict.categoriesSection.title}</h2>
      <p className="mt-2 max-w-xl text-muted">{dict.categoriesSection.subtitle}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {featured.map((category, i) => {
          const photoUrl = categoryImages?.[category.slug];
          return (
            <Link
              key={category.slug}
              href={`${base}/products/category/${category.slug}`}
              className={cx("group relative flex h-40 items-end overflow-hidden rounded-lg border border-border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lifted sm:h-48", !photoUrl && CATEGORY_TINTS[category.slug])}
            >
              {photoUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </>
              )}
              <span className={cx("absolute left-5 top-4 font-mono text-xs font-bold", photoUrl ? "text-white/80" : "text-ink-soft/60")}>{String(i + 1).padStart(2, "0")}</span>
              {!photoUrl && <CategoryIllustration category={category.slug} className={cx("absolute -right-4 -top-4 h-32 w-32 opacity-25 transition-transform group-hover:scale-105 sm:h-40 sm:w-40", CATEGORY_INK[category.slug])} aria-hidden />}
              <span className={cx("relative font-display text-xl font-semibold", photoUrl ? "text-white" : "text-ink")}>{category.name[locale]}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {rest.map((category, i) => {
          const photoUrl = categoryImages?.[category.slug];
          return (
            <Link
              key={category.slug}
              href={`${base}/products/category/${category.slug}`}
              className={cx("group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-border p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-lifted", CATEGORY_TINTS[category.slug])}
            >
              <span className="absolute left-3 top-3 font-mono text-[10px] font-bold text-ink-soft/60">{String(i + FEATURED_COUNT + 1).padStart(2, "0")}</span>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <CategoryIllustration category={category.slug} className={cx("h-9 w-9", CATEGORY_INK[category.slug])} />
              )}
              <span className="text-sm font-medium text-ink">{category.name[locale]}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
