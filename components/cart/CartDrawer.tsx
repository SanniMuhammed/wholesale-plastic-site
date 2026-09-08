"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, PackageOpen, Plus, X } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { ProductImage } from "@/components/ProductImage";
import { cx } from "@/lib/utils";

export function CartDrawer({ locale, dict, open, onClose, products }: { locale: Locale; dict: Dictionary; open: boolean; onClose: () => void; products: Product[] }) {
  const { items, updateQuantity, removeItem } = useOrder();
  const base = `/${locale}`;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; };
  }, [open, onClose]);

  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const resolved = items.map((item) => {
    const product = productBySlug.get(item.slug);
    if (!product) return null;
    return { slug: item.slug, quantity: item.quantity, product, name: product.name[locale], capacity: product.capacity };
  }).filter((item): item is { slug: string; quantity: number; product: Product; name: string; capacity: string | undefined } => item !== null);
  const totalQuantity = resolved.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div aria-hidden onClick={onClose} className={cx("fixed inset-0 z-[60] bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")} />
      <div role="dialog" aria-modal="true" aria-label={dict.cartDrawer.title} aria-hidden={!open} className={cx("fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-surface shadow-lifted transition-transform duration-300 ease-out sm:max-w-md", open ? "translate-x-0" : "translate-x-full")}>
        <div className="shrink-0 border-b border-border px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-brand">{dict.cartDrawer.title}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">{locale === "fr" ? "Votre sélection" : "Your selection"}</h2>
              {totalQuantity > 0 && <p className="mt-1 font-mono text-xs text-muted">{totalQuantity} {dict.common.items}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label={dict.nav.close} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-ink hover:text-ink"><X size={18} /></button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {resolved.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand"><PackageOpen size={28} strokeWidth={1.4} /></div>
              <div><p className="font-display text-lg font-semibold text-ink">{dict.cartDrawer.empty}</p><p className="mt-1 max-w-xs text-sm leading-6 text-muted">{locale === "fr" ? "Ajoutez des produits pour préparer votre commande en gros." : "Add products to build your wholesale order."}</p></div>
            </div>
          ) : (
            <ul className="space-y-3">
              {resolved.map((item, index) => (
                <li key={item.slug} className="rounded-xl border border-border bg-white/60 p-3 transition-colors hover:border-ink/15">
                  <div className="flex gap-3">
                    <Link href={`${base}/products/${item.slug}`} onClick={onClose} className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-border bg-surface"><ProductImage product={item.product} locale={locale} className="h-full w-full rounded-none" sizes="72px" /></Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <span className="pt-0.5 font-mono text-[10px] font-bold text-muted">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0 flex-1"><Link href={`${base}/products/${item.slug}`} onClick={onClose} className="block truncate text-sm font-semibold text-ink hover:text-brand">{item.name}</Link>{item.capacity && <p className="mt-0.5 font-mono text-xs text-muted">{item.capacity}</p>}</div>
                        <button type="button" onClick={() => removeItem(item.slug)} className="shrink-0 text-[11px] font-medium text-muted hover:text-ink">{dict.common.removeFromOrder}</button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3"><span className="text-[11px] font-medium uppercase tracking-wider text-muted">{dict.common.quantity}</span><div className="flex h-9 items-center rounded-lg border border-border bg-surface"><button type="button" onClick={() => updateQuantity(item.slug, Math.max(1, item.quantity - 1))} aria-label={`Decrease ${item.name}`} className="inline-flex h-full w-9 items-center justify-center text-ink-soft hover:bg-brand-light"><Minus size={13} /></button><input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.slug, Math.max(1, Number(e.target.value) || 1))} aria-label={dict.common.quantity} className="h-full w-12 border-x border-border bg-transparent text-center font-mono text-sm font-medium text-ink outline-none" /><button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} aria-label={`Increase ${item.name}`} className="inline-flex h-full w-9 items-center justify-center text-ink-soft hover:bg-brand-light"><Plus size={13} /></button></div></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-surface px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
          {resolved.length > 0 && <div className="mb-4 rounded-xl bg-brand-light p-4"><div className="flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-wider text-brand">{locale === "fr" ? "Quantité totale" : "Total quantity"}</span><span className="font-mono text-sm font-semibold text-ink">{totalQuantity.toLocaleString()}</span></div><p className="mt-2 text-xs leading-5 text-muted">{locale === "fr" ? "Vérifiez votre commande, ajoutez votre destination et envoyez le PDF complet sur WhatsApp." : "Review your order, add your destination, then send the complete PDF to WhatsApp."}</p></div>}
          <div className="flex flex-col gap-2.5">
            {resolved.length > 0 && <Link href={`${base}/order-summary`} onClick={onClose} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand px-5 text-sm font-semibold text-surface shadow-sm transition-all hover:bg-brand-dark active:scale-[0.99]">{dict.cartDrawer.viewFullOrder} →</Link>}
            <button type="button" onClick={onClose} className="py-1.5 text-center text-sm font-medium text-muted hover:text-ink">{dict.cartDrawer.keepBrowsing}</button>
          </div>
        </div>
      </div>
    </>
  );
}
