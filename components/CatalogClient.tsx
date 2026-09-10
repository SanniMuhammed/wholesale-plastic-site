"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowUpDown, Filter, X } from "lucide-react";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductCard } from "@/components/ProductCard";

function isCategorySlug(value: string | null): value is CategorySlug {
  return !!value && CATEGORIES.some((c) => c.slug === value);
}

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

function isSortOption(value: string | null): value is SortOption {
  return value === "featured" || value === "price-asc" || value === "price-desc" || value === "name";
}

export function CatalogClient({ locale, dict, products }: { locale: Locale; dict: Dictionary; products: CatalogProduct[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const paramCategory = searchParams.get("category");
  const [category, setCategory] = useState<CategorySlug | null>(isCategorySlug(paramCategory) ? paramCategory : null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortOption>(isSortOption(searchParams.get("sort")) ? searchParams.get("sort") as SortOption : "featured");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    if (sort !== "featured") params.set("sort", sort);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query, sort, pathname]);

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

    return [...list].sort((a, b) => {
      if (sort === "price-asc") {
        const aPrice = a.price ?? Number.POSITIVE_INFINITY;
        const bPrice = b.price ?? Number.POSITIVE_INFINITY;
        return aPrice - bPrice;
      }
      if (sort === "price-desc") {
        const aPrice = a.price ?? Number.NEGATIVE_INFINITY;
        const bPrice = b.price ?? Number.NEGATIVE_INFINITY;
        return bPrice - aPrice;
      }
      if (sort === "name") return a.name[locale].localeCompare(b.name[locale]);
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, query, category, sort, locale]);

  const hasFilters = Boolean(category || query || sort !== "featured");
  const activeCategory = category ? CATEGORIES.find((c) => c.slug === category) : null;
  const clearAll = () => { setCategory(null); setQuery(""); setSort("featured"); };
  const isFrench = locale === "fr";

  const catalogCopy = {
    filterTitle: isFrench ? "Filtrer par catégorie" : "Filter by category",
    sortLabel: isFrench ? "Trier les produits" : "Sort products",
    featured: isFrench ? "En vedette" : "Featured",
    priceAsc: isFrench ? "Prix : du plus bas au plus haut" : "Price: Low to high",
    priceDesc: isFrench ? "Prix : du plus haut au plus bas" : "Price: High to low",
    name: isFrench ? "Nom" : "Name",
  };

  return (
    <div>
      <div className="mb-7 sm:mb-9">
        <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Filter size={16} strokeWidth={1.8} className="shrink-0 text-brand" aria-hidden />
              <p className="eyebrow text-brand">{dict.nav.categories}</p>
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">{catalogCopy.filterTitle}</h2>
          </div>
          <p className="font-mono text-xs font-semibold text-muted">{String(results.length).padStart(2, "0")} {dict.common.items}</p>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button type="button" onClick={() => setCategory(null)} aria-pressed={!category} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${!category ? "border-brand bg-brand text-surface" : "border-border bg-surface text-ink-soft hover:border-brand/40 hover:text-brand"}`}>
            {dict.common.all}
          </button>
          {CATEGORIES.map((c) => {
            const selected = category === c.slug;
            return (
              <button key={c.slug} type="button" onClick={() => setCategory(c.slug)} aria-pressed={selected} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selected ? "border-brand bg-brand text-surface" : "border-border bg-surface text-ink-soft hover:border-brand/40 hover:text-brand"}`}>
                {c.name[locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3 sm:mb-6">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeCategory && (
            <button type="button" onClick={() => setCategory(null)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand">
              {activeCategory.name[locale]} <X size={13} aria-hidden />
            </button>
          )}
          {query && (
            <span className="inline-flex shrink-0 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted">“{query}”</span>
          )}
          {!activeCategory && !query && <p className="text-sm text-muted">{dict.nav.products}</p>}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted">
          <ArrowUpDown size={14} aria-hidden />
          <span className="sr-only">{catalogCopy.sortLabel}</span>
          <select aria-label={catalogCopy.sortLabel} value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-9 rounded-md border border-border bg-surface px-2.5 text-xs font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/10">
            <option value="featured">{catalogCopy.featured}</option>
            <option value="price-asc">{catalogCopy.priceAsc}</option>
            <option value="price-desc">{catalogCopy.priceDesc}</option>
            <option value="name">{catalogCopy.name}</option>
          </select>
        </label>
      </div>

      {hasFilters && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="font-display text-xl font-semibold text-ink sm:text-2xl">{activeCategory ? activeCategory.name[locale] : dict.nav.products}</p>
          <button type="button" onClick={clearAll} className="shrink-0 text-xs font-semibold text-muted underline decoration-border underline-offset-4 transition-colors hover:text-brand">{dict.common.clearFilters}</button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-surface p-6 text-center sm:mt-6 sm:p-8"><p className="font-medium text-ink">{dict.common.noResults}</p><p className="mx-auto mt-2 max-w-md text-sm text-muted">{dict.categoriesSection.subtitle}</p><button type="button" onClick={clearAll} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded bg-ink px-4 py-2 text-sm font-medium text-surface">{dict.common.clearFilters}<ArrowRight size={14} aria-hidden /></button></div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{results.map((product) => <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />)}</div>
      )}
    </div>
  );
}
