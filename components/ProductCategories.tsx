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

const CATEGORY_LABELS: Record<CategorySlug, { en: string; fr: string }> = {
  buckets: { en: "Buckets & Drums", fr: "Seaux & bidons" },
  basins: { en: "Basins & Tubs", fr: "Bassines & cuves" },
  bowls: { en: "Bowls & Kitchenware", fr: "Bols & cuisine" },
  containers: { en: "Food Containers & Packaging", fr: "Boîtes & emballages" },
  household: { en: "Storage, Laundry & Cleaning", fr: "Rangement, lessive & nettoyage" },
  other: { en: "Furniture, Crates & Commercial", fr: "Mobilier, caisses & commercial" },
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
    <section id="categories" className="mx-auto max-w-content scroll-mt-20 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{dict.categoriesSection.title}</h2>
        </div>
        <Link href={`${base}/products`} className="shrink-0 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand">
          {dict.common.exploreProducts} →
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((category) => {
          const photoUrl = categoryImages?.[category.slug] || PUBLIC_CATEGORY_IMAGES[category.slug];
          const label = CATEGORY_LABELS[category.slug][locale];
          return (
            <Link
              key={category.slug}
              href={`${base}/products?category=${category.slug}`}
              className={cx(
                "group relative flex aspect-square items-end overflow-hidden rounded-lg border border-border transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lifted",
                !photoUrl && CATEGORY_TINTS[category.slug],
              )}
            >
              {photoUrl && (
                <>
                  <Image src={photoUrl} alt={label} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </>
              )}
              {!photoUrl && (
                <CategoryIllustration category={category.slug} className={cx("absolute -right-4 -top-4 h-28 w-28 opacity-25 transition-transform group-hover:scale-105", CATEGORY_INK[category.slug])} aria-hidden />
              )}
              <span className={cx("relative z-10 p-3 font-display text-base font-semibold leading-tight sm:text-[17px]", photoUrl ? "text-white" : "text-ink")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
