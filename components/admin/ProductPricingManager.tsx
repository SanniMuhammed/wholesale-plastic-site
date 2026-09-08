"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SaveStatusPill, type SaveState } from "@/components/admin/AdminUI";
import { updateProductPricingAction } from "@/app/admin/(dashboard)/products/pricing-actions";
import type { PricingMode, Product } from "@/lib/cms/types";

export function ProductPricingManager({ product }: { product: Product }) {
  const router = useRouter();
  const [mode, setMode] = useState<PricingMode>(product.pricing_mode ?? "quote");
  const [price, setPrice] = useState(product.price?.toString() ?? "");
  const [unit, setUnit] = useState(product.price_unit ?? "per piece");
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string>();

  async function save() {
    setState("saving"); setError(undefined);
    try {
      const numericPrice = price.trim() ? Number(price) : null;
      if (mode !== "quote" && (numericPrice == null || !Number.isFinite(numericPrice) || numericPrice < 0)) throw new Error("Enter a valid non-negative price.");
      await updateProductPricingAction(product.id, mode, numericPrice, unit.trim() || null);
      setState("saved"); router.refresh();
    } catch (err) { setState("error"); setError(err instanceof Error ? err.message : "Could not save pricing."); }
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-sm font-semibold text-ink">Pricing</h2><p className="mt-1 text-xs leading-relaxed text-muted">Show a confirmed price only when you have one. Otherwise use request pricing.</p></div>
        <SaveStatusPill state={state} errorMessage={error} />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label><span className="mb-1 block text-sm font-medium text-ink-soft">Pricing mode</span><select value={mode} onChange={(e) => setMode(e.target.value as PricingMode)} className={inputClass}><option value="quote">Request a quote</option><option value="fixed">Fixed price</option><option value="starting_from">Starting from</option></select></label>
        <label><span className="mb-1 block text-sm font-medium text-ink-soft">Price</span><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} disabled={mode === "quote"} placeholder="e.g. 2500" className={inputClass} /></label>
        <label><span className="mb-1 block text-sm font-medium text-ink-soft">Unit</span><input value={unit} onChange={(e) => setUnit(e.target.value)} disabled={mode === "quote"} placeholder="per piece" className={inputClass} /></label>
      </div>
      <button type="button" onClick={save} disabled={state === "saving"} className="mt-4 inline-flex rounded bg-brand px-5 py-2.5 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60">Save pricing</button>
    </section>
  );
}
const inputClass = "w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none disabled:bg-muted/10 disabled:text-muted";
