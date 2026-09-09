"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Filter, X } from "lucide-react";
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
        return [p.name.en, p.name.fr, p.shortDescription.en, p.shortDescription.fr, p.description.en, p.description.fr, p.capacity ?? "", p.material.en, p.material.fr, p.useCase.en, p.useCase.fr, category?.name.en ?? "", category?.name.fr ?? ""].join(" ").toLowerCase().includes(q);
      });
    }
    if (category) list = list.filter((p) => p.category === category);
    return list;
  }, [products, query, category]);

  const hasFilters = Boolean(category || query);
  const activeCategory = category ? CATEGORIES.find((c) => c.slug === category) : null;
  const clearAll = () => { setCategory(null); setQuery(""); };

  return (
    <div>
      <div className="mb-7 sm:mb-9">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand"><Filter size={16} strokeWidth={1.9} aria-hidden /></span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{dict.nav.categories}</p>
                <p className="truncate font-display text-base font-semibold text-ink sm:text-lg">Filter products by category</p>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative min-w-0 flex-1 sm:w-64">
                <label htmlFor="category-filter" className="sr-only">{dict.nav.categories}</label>
                <select id="category-filter" value={category ?? ""} onChange={(event) => setCategory(isCategorySlug(event.target.value) ? event.target.value : null)} className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-semibold text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10">
                  <option value="">{dict.common.all}</option>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name[locale]}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden>⌄</span>
              </div>
              {hasFilters && <button type="button" onClick={clearAll} aria-label={dict.common.clearFilters} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted transition-colors hover:border-brand hover:text-brand"><X size={16} aria-hidden /></button>}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <p className="text-xs text-muted">{activeCategory ? activeCategory.name[locale] : dict.common.all}</p>
            <p className="font-mono text-xs font-semibold text-ink">{String(results.length).padStart(2, "0")} {dict.common.items}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
        <div><p className="eyebrow">{dict.nav.products}</p><h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">{activeCategory ? activeCategory.name[locale] : dict.nav.products}</h2></div>
        {hasFilters && <button type="button" onClick={clearAll} className="text-xs font-semibold text-muted transition-colors hover:text-brand">{dict.common.clearFilters}</button>}
      </div>

      {results.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-surface p-6 text-center sm:mt-6 sm:p-8"><p className="font-medium text-ink">{dict.common.noResults}</p><p className="mx-auto mt-2 max-w-md text-sm text-muted">{dict.categoriesSection.subtitle}</p><button type="button" onClick={clearAll} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded bg-ink px-4 py-2 text-sm font-medium text-surface">{dict.common.clearFilters}<ArrowRight size={14} aria-hidden /></button></div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{results.map((product) => <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />)}</div>
      )}
    </div>
  );
}
