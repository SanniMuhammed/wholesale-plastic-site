"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";

interface SearchResult {
  slug: string;
  name: string;
  image?: string;
  category: string;
}

interface SearchBoxProps {
  locale: Locale;
  dict: Dictionary;
  initialQuery?: string;
}

const searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>();
const SEARCH_CACHE_TTL = 30_000;
const SEARCH_CACHE_LIMIT = 40;

function readCachedResults(key: string): SearchResult[] | null {
  const cached = searchCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > SEARCH_CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  return cached.results;
}

function writeCachedResults(key: string, results: SearchResult[]) {
  searchCache.delete(key);
  searchCache.set(key, { results, timestamp: Date.now() });
  while (searchCache.size > SEARCH_CACHE_LIMIT) {
    const oldestKey = searchCache.keys().next().value;
    if (!oldestKey) break;
    searchCache.delete(oldestKey);
  }
}

export function SearchBox({ locale, dict, initialQuery = "" }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const base = `/${locale}`;

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const value = query.trim();
      if (value.length < 2) {
        setResults([]);
        setLoading(false);
        setOpen(false);
        setActiveIndex(-1);
        return;
      }

      const cacheKey = `${locale}:${value.toLowerCase()}`;
      const cached = readCachedResults(cacheKey);
      if (cached) {
        setResults(cached);
        setLoading(false);
        setOpen(true);
        setActiveIndex(-1);
        return;
      }

      setLoading(true);
      setOpen(true);
      try {
        const response = await fetch(`/api/product-search?q=${encodeURIComponent(value)}&locale=${locale}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");
        const data = (await response.json()) as { results?: SearchResult[] };
        const nextResults = data.results ?? [];
        writeCachedResults(cacheKey, nextResults);
        setResults(nextResults);
        setActiveIndex(-1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 50);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locale, query]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `${base}/products?q=${encodeURIComponent(value)}` : `${base}/products`);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      router.push(`${base}/products/${results[activeIndex].slug}`);
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative min-w-0 flex-1 md:max-w-[220px] lg:max-w-md">
      <form onSubmit={submitSearch} className="relative">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand" aria-hidden="true" />
        <label htmlFor="navbar-search" className="sr-only">{dict.common.searchPlaceholder}</label>
        <input
          id="navbar-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => { if (query.trim().length >= 2) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={dict.common.searchPlaceholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="navbar-search-results"
          className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-10 text-sm text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 sm:h-11 sm:text-[13px]"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-brand-light hover:text-brand" aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </form>

      {open && (
        <div id="navbar-search-results" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-[0_12px_35px_rgba(19,25,33,0.18)]">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted"><Loader2 size={16} className="animate-spin" /> Searching…</div>
          ) : results.length > 0 ? (
            <>
              <div className="border-b border-border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{dict.nav.products}</div>
              {results.map((result, index) => (
                <Link
                  key={result.slug}
                  href={`${base}/products/${result.slug}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 border-b border-border px-3 py-2.5 transition-colors ${index === activeIndex ? "bg-brand-light" : "hover:bg-brand-light/70"}`}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-brand-light">
                    {result.image ? <Image src={result.image} alt="" fill sizes="44px" className="object-contain" /> : <div className="flex h-full items-center justify-center text-muted"><Search size={15} /></div>}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{result.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{dict.categories[result.category as keyof typeof dict.categories] ?? result.category}</p>
                  </div>
                </Link>
              ))}
              <Link href={`${base}/products?q=${encodeURIComponent(query.trim())}`} onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-3 text-xs font-bold text-brand hover:bg-brand-light">
                <span>{dict.common.exploreProducts}</span><span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <div className="px-4 py-4 text-sm text-muted">{dict.common.noResults}</div>
          )}
        </div>
      )}
    </div>
  );
}
