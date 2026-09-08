"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { Product } from "@/lib/products";
import { useOrder } from "@/components/OrderProvider";
import { ProductImage } from "@/components/ProductImage";

export function BulkOrderGrid({ products, locale, dict }: { products: Product[]; locale: Locale; dict: Dictionary }) {
  const { addItem } = useOrder();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);

  const selectedCount = Object.keys(selected).length;
  const totalUnits = useMemo(() => Object.values(selected).reduce((sum, quantity) => sum + quantity, 0), [selected]);

  function toggle(slug: string) {
    setSelected((current) => {
      if (current[slug]) {
        const next = { ...current };
        delete next[slug];
        return next;
      }
      return { ...current, [slug]: 1 };
    });
  }

  function setQuantity(slug: string, value: number) {
    setSelected((current) => ({ ...current, [slug]: Math.max(1, Math.floor(value) || 1) }));
  }

  function addSelected() {
    Object.entries(selected).forEach(([slug, quantity]) => addItem(slug, quantity));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-brand/20 bg-brand-light/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{locale === "fr" ? "Composez votre commande en gros" : "Build your wholesale order"}</p>
          <p className="mt-1 text-xs text-muted">{locale === "fr" ? "Sélectionnez plusieurs produits et indiquez les quantités dont vous avez besoin." : "Select multiple products and set the quantity you need for each."}</p>
        </div>
        <button
          type="button"
          disabled={!selectedCount}
          onClick={addSelected}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? <Check size={15} /> : <ShoppingBag size={15} />}
          {added
            ? (locale === "fr" ? "Ajouté à la commande" : "Added to order")
            : (locale === "fr" ? `Ajouter ${selectedCount || ""} produit${selectedCount === 1 ? "" : "s"}` : `Add ${selectedCount || ""} product${selectedCount === 1 ? "" : "s"}`)}
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 font-mono text-xs text-muted">
          <span>{selectedCount} {locale === "fr" ? "produit(s) sélectionné(s)" : "product(s) selected"}</span>
          <span>{totalUnits} {locale === "fr" ? "unités" : "units"}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {products.map((product, index) => {
          const quantity = selected[product.slug];
          const selectedProduct = Boolean(quantity);
          return (
            <article key={product.slug} className={`group relative overflow-hidden rounded-xl border bg-surface transition-all ${selectedProduct ? "border-brand ring-1 ring-brand/20" : "border-border hover:border-ink/30"}`}>
              <button type="button" onClick={() => toggle(product.slug)} aria-pressed={selectedProduct} className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/95 shadow-sm" aria-label={selectedProduct ? (locale === "fr" ? "Retirer de la sélection" : "Remove from selection") : (locale === "fr" ? "Sélectionner" : "Select") }>
                {selectedProduct ? <Check size={15} className="text-brand" /> : <span className="h-3.5 w-3.5 rounded-full border border-ink/40" />}
              </button>
              <Link href={`/${locale}/products/${product.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-background p-3">
                  <ProductImage product={product} locale={locale} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wide text-muted">{String(index + 1).padStart(2, "0")} · {product.capacity || (locale === "fr" ? "Standard" : "Standard")}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-ink">{product.name[locale]}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{product.shortDescription[locale]}</p>
                </div>
              </Link>
              {selectedProduct && (
                <div className="border-t border-brand/20 bg-brand-light/30 p-3" onClick={(event) => event.stopPropagation()}>
                  <label className="flex items-center justify-between gap-2 text-xs font-medium text-ink">
                    <span>{locale === "fr" ? "Quantité" : "Quantity"}</span>
                    <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(product.slug, Number(event.target.value))} className="w-20 rounded border border-border bg-surface px-2 py-1.5 text-right font-mono text-xs" />
                  </label>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
