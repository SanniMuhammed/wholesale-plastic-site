import Image from "next/image";
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

const PUBLIC_CATEGORY_IMAGES: Record<CategorySlug, string> = {
  buckets: "/product-images/15l-bucket-with-lid.jpg",
  basins: "/product-images/40l-large-basin.jpg",
  bowls: "/product-images/20l-round-basin.jpg",
  containers: "/product-images/10l-mini-bucket.jpg",
  household: "/product-images/dish-rack.jpg",
  other: "/product-images/plastic-stool.jpg",
};

export function ProductCategories({ locale, dict, categoryImages }: { locale: Locale; dict: Dictionary; categoryImages?: Record<string, string> }) {
  const base = `/${locale}`;

  return (
    <section id="categories" className="mx-auto max-w-content scroll-mt-20 px-4 pt-12 pb-8 sm:px-6 sm:pb-10 sm:pt-14">
      <div className="border-b border-border pb-5">
        <div>
          <p className="eyebrow text-brand">01 / {dict.categoriesSection.title}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{dict.categoriesSection.title}</h2>
          <p className="mt-2 max-w-xl text-muted">{dict.categoriesSection.subtitle}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {CATEGORIES.map((category, i) => {
          const photoUrl = categoryImages?.[category.slug] || PUBLIC_CATEGORY_IMAGES[category.slug];
          return (
            <Link
              key={category.slug}
              href={`${base}/products?category=${category.slug}`}
              className={cx(
                "group relative flex aspect-[4/3] items-end overflow-hidden rounded-lg border border-border p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lifted sm:aspect-[3/2]",
                !photoUrl && CATEGORY_TINTS[category.slug],
              )}
            >
              {photoUrl && (
                <>
                  <Image src={photoUrl} alt={category.name[locale]} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                </>
              )}
              <span className={cx("absolute left-5 top-4 z-10 font-mono text-xs font-bold", photoUrl ? "text-white/80" : "text-brand/70")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {!photoUrl && (
                <CategoryIllustration category={category.slug} className={cx("absolute -right-4 -top-4 h-32 w-32 opacity-25 transition-transform group-hover:scale-105 sm:h-40 sm:w-40", CATEGORY_INK[category.slug])} aria-hidden />
              )}
              <span className={cx("relative z-10 font-display text-lg font-semibold sm:text-xl", photoUrl ? "text-white" : "text-ink")}>
                {category.name[locale]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
