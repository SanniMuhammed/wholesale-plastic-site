"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIllustration } from "@/components/illustrations/CategoryIllustration";
import { cx } from "@/lib/utils";

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

function isCategorySlug(value: string | null): value is CategorySlug {
  return !!value && CATEGORIES.some((c) => c.slug === value);
}

export function CatalogClient({ locale, dict, products }: { locale: Locale; dict: Dictionary; products: CatalogProduct[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const paramCategory = searchParams.get("category");
  const [category, setCategory] = useState<CategorySlug | null>(isCategorySlug(paramCategory) ? paramCategory : null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query, pathname]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategorySlug, number>();
    CATEGORIES.forEach((c) => counts.set(c.slug, 0));
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return counts;
  }, [products]);

  const results = useMemo<CatalogProduct[]>(() => {
    let list = products;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = products.filter((p) => {
        const category = CATEGORIES.find((c) => c.slug === p.category);
        return [p.name.en, p.name.fr, p.shortDescription.en, p.shortDescription.fr, p.description.en, p.description.fr, p.capacity ?? "", p.material.en, p.material.fr, p.useCase.en, p.useCase.fr, category?.name.en ?? "", category?.name.fr ?? ""].join(" ").toLowerCase().includes(q);
      });
    }
    if (category) list = list.filter((p) => p.category === category);
    return list;
  }, [products, query, category]);

  const hasFilters = Boolean(category || query);
  const activeCategory = category ? CATEGORIES.find((c) => c.slug === category) : null;

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{dict.nav.categories}</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">{dict.categoriesSection.title}</h2>
          </div>
          <span className="hidden font-mono text-xs text-muted sm:block">{String(products.length).padStart(2, "0")} {dict.common.items}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const count = categoryCounts.get(c.slug) ?? 0;
            const active = category === c.slug;
            return (
              <button key={c.slug} type="button" onClick={() => setCategory(active ? null : c.slug)} aria-pressed={active} aria-label={`${c.name[locale]} — ${count} ${dict.common.items}`} className={cx("group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lifted", CATEGORY_TINTS[c.slug], active ? "border-ink ring-2 ring-ink/10" : "border-border")}>
                <span className="font-mono text-[10px] font-bold text-ink-soft/60">{String(count).padStart(2, "0")}</span>
                <CategoryIllustration category={c.slug} className={cx("absolute -right-4 top-3 h-20 w-20 opacity-20 transition-transform duration-300 group-hover:scale-110", CATEGORY_INK[c.slug])} aria-hidden />
                <span className="relative max-w-[9rem] pr-3 text-sm font-semibold leading-tight text-ink">{c.name[locale]}</span>
                <ArrowRight size={14} className="absolute bottom-4 right-4 text-ink-soft transition-transform group-hover:translate-x-1" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-16 z-30 -mx-4 border-y border-border bg-background/95 px-4 py-4 backdrop-blur sm:top-[4.5rem] sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-lg">
            <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <label htmlFor="catalog-search" className="sr-only">{dict.common.searchPlaceholder}</label>
            <input id="catalog-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={dict.common.searchPlaceholder} autoComplete="off" className="w-full rounded border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none" />
          </div>
          {hasFilters && <button type="button" onClick={() => { setCategory(null); setQuery(""); }} className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-muted hover:text-ink sm:self-auto"><X size={14} aria-hidden />{dict.common.clearFilters}</button>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{activeCategory ? activeCategory.name[locale] : dict.nav.products}</p>
          {activeCategory && <p className="mt-0.5 text-sm text-muted">{String(results.length).padStart(2, "0")} {dict.common.items}</p>}
        </div>
        {!activeCategory && <p className="font-mono text-sm text-muted">{String(results.length).padStart(2, "0")} {dict.common.items}</p>}
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
          <p className="font-medium text-ink">{dict.common.noResults}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">{dict.categoriesSection.subtitle}</p>
          <button type="button" onClick={() => { setCategory(null); setQuery(""); }} className="mt-5 inline-flex items-center gap-2 rounded bg-ink px-4 py-2 text-sm font-medium text-surface">{dict.common.clearFilters}<ArrowRight size={14} aria-hidden /></button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {results.map((product) => <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />)}
        </div>
      )}
    </div>
  );
}
