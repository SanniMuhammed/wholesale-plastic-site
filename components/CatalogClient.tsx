"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  CATEGORIES,
  getAllProducts,
  searchProducts,
  type CategorySlug,
  type Product,
} from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductCard } from "@/components/ProductCard";
import { cx } from "@/lib/utils";

function isCategorySlug(value: string | null): value is CategorySlug {
  return !!value && CATEGORIES.some((c) => c.slug === value);
}

export function CatalogClient({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paramCategory = searchParams.get("category");
  const [category, setCategory] = useState<CategorySlug | null>(
    isCategorySlug(paramCategory) ? paramCategory : null
  );
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Keep the URL in sync so filtered views are shareable/bookmarkable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query, pathname]);

  const results = useMemo<Product[]>(() => {
    let list = query.trim() ? searchProducts(query) : getAllProducts();
    if (category) list = list.filter((p) => p.category === category);
    return list;
  }, [query, category]);

  const hasFilters = Boolean(category || query);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.common.searchPlaceholder}
            className="w-full rounded border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setCategory(null);
              setQuery("");
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
          >
            <X size={14} />
            {dict.common.clearFilters}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cx(
            "rounded border px-3 py-1.5 text-sm font-medium transition-all active:scale-95",
            category === null ? "border-ink bg-ink text-surface" : "border-border text-ink-soft hover:border-ink"
          )}
        >
          {dict.common.all}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            className={cx(
              "rounded border px-3 py-1.5 text-sm font-medium transition-all active:scale-95",
              category === c.slug ? "border-ink bg-ink text-surface" : "border-border text-ink-soft hover:border-ink"
            )}
          >
            {c.name[locale]}
          </button>
        ))}
      </div>

      <p className="mt-6 font-mono text-sm text-muted">{results.length}</p>

      {results.length === 0 ? (
        <p className="mt-4 text-muted">{dict.common.noResults}</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
