"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Filter, Search, X } from "lucide-react";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductCard } from "@/components/ProductCard";

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

  const results = useMemo<CatalogProduct[]>(() => {
    let list = products;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = products.filter((p) => {
        const category = CATEGORIES.find((c) => c.slug === p.category);
        return [
          p.name.en,
          p.name.fr,
          p.shortDescription.en,
          p.shortDescription.fr,
          p.description.en,
          p.description.fr,
          p.capacity ?? "",
          p.material.en,
          p.material.fr,
          p.useCase.en,
          p.useCase.fr,
          category?.name.en ?? "",
          category?.name.fr ?? "",
        ].join(" ").toLowerCase().includes(q);
      });
    }
    if (category) list = list.filter((p) => p.category === category);
    return list;
  }, [products, query, category]);

  const hasFilters = Boolean(category || query);
  const activeCategory = category ? CATEGORIES.find((c) => c.slug === category) : null;
  const clearAll = () => {
    setCategory(null);
    setQuery("");
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">{dict.nav.categories}</p>
            <label htmlFor="category-filter" className="mt-1 block font-display text-xl font-semibold text-ink sm:text-2xl">
              {dict.nav.categories}
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
              <Filter size={15} strokeWidth={1.8} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
              <select
                id="category-filter"
                value={category ?? ""}
                onChange={(event) => setCategory(isCategorySlug(event.target.value) ? event.target.value : null)}
                className="h-11 w-full appearance-none rounded border border-border bg-surface pl-9 pr-9 text-sm font-medium text-ink focus:border-ink focus:outline-none"
              >
                <option value="">{dict.common.all}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name[locale]}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden>⌄</span>
            </div>

            <span className="shrink-0 font-mono text-[11px] text-muted sm:text-xs">
              {String(products.length).padStart(2, "0")} {dict.common.items}
            </span>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 -mx-4 border-y border-border bg-background/95 px-4 py-3 backdrop-blur sm:top-[4.5rem] sm:-mx-6 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1 sm:max-w-lg">
            <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <label htmlFor="catalog-search" className="sr-only">{dict.common.searchPlaceholder}</label>
            <input id="catalog-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={dict.common.searchPlaceholder} autoComplete="off" className="w-full rounded border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none" />
          </div>
          {hasFilters && <button type="button" onClick={clearAll} className="inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-medium text-muted hover:text-ink sm:self-auto"><X size={14} aria-hidden />{dict.common.clearFilters}</button>}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 sm:mt-6">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{activeCategory ? activeCategory.name[locale] : dict.nav.products}</p>
          {activeCategory && <p className="mt-0.5 text-sm text-muted">{String(results.length).padStart(2, "0")} {dict.common.items}</p>}
        </div>
        {!activeCategory && <p className="font-mono text-sm text-muted">{String(results.length).padStart(2, "0")} {dict.common.items}</p>}
      </div>

      {results.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-surface p-6 text-center sm:mt-6 sm:p-8">
          <p className="font-medium text-ink">{dict.common.noResults}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">{dict.categoriesSection.subtitle}</p>
          <button type="button" onClick={clearAll} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded bg-ink px-4 py-2 text-sm font-medium text-surface">{dict.common.clearFilters}<ArrowRight size={14} aria-hidden /></button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {results.map((product) => <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />)}
        </div>
      )}
    </div>
  );
}
