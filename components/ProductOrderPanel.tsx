"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import { useCartUI } from "@/components/cart/CartUIProvider";
import { useInView } from "@/lib/hooks/useInView";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { productInquiryLink } from "@/lib/whatsapp";
import { cx } from "@/lib/utils";
import { formatNigeriaDestination, NIGERIAN_STATES, type DeliveryRegion } from "@/lib/location";

function getPackSize(packaging: string): number | null {
  const match = packaging.match(/(?:of|de)\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}

export function ProductOrderPanel({ product, locale, dict, hasConfirmedPrice = false }: { product: Product; locale: Locale; dict: Dictionary; hasConfirmedPrice?: boolean }) {
  const { addItem } = useOrder();
  const { flyToCart, notifyAdded } = useCartUI();
  const [quantity, setQuantity] = useState(1);
  const [region, setRegion] = useState<DeliveryRegion | "">("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [added, setAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { ref: sentinelRef, inView: mainActionsVisible } = useInView<HTMLDivElement>({ once: false, threshold: 0 });
  const packSize = useMemo(() => getPackSize(product.packaging[locale]), [product.packaging, locale]);
  const quickQuantities = packSize ? [packSize, packSize * 2, packSize * 5, packSize * 10] : [10, 25, 50, 100];
  const destinationCountry = region === "nigeria" ? "Nigeria" : country;
  const destinationCity = region === "nigeria" ? formatNigeriaDestination(state, city) : city;

  function setSafeQuantity(value: number) { setQuantity(Math.max(1, Math.floor(value) || 1)); }
  function handleRegionChange(value: DeliveryRegion | "") { setRegion(value); setState(""); setCountry(value === "nigeria" ? "Nigeria" : ""); setCity(""); }
  function handleAdd() { addItem(product.slug, quantity); flyToCart(buttonRef.current); notifyAdded(product.name[locale]); setAdded(true); window.setTimeout(() => setAdded(false), 1400); }

  const whatsappHref = productInquiryLink(dict, { product: product.name[locale], quantity, city: destinationCity, country: destinationCountry });

  return (
    <div className="mt-7 flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-display text-lg font-semibold text-ink">{locale === "fr" ? "Détails de la commande" : "Order details"}</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Wholesale</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3"><label className="text-sm font-medium text-ink-soft" htmlFor="product-qty">{dict.common.quantity}</label>{packSize && <span className="font-mono text-[10px] text-muted">{locale === "fr" ? `Carton de ${packSize}` : `Carton of ${packSize}`}</span>}</div>
          <div className="mt-2 flex items-center gap-2"><button type="button" aria-label={locale === "fr" ? "Diminuer la quantité" : "Decrease quantity"} onClick={() => setSafeQuantity(quantity - 1)} className="inline-flex h-11 w-11 items-center justify-center rounded border border-border text-ink transition-colors hover:border-ink"><Minus size={16} /></button><input id="product-qty" type="number" min={1} inputMode="numeric" value={quantity} onChange={(e) => setSafeQuantity(Number(e.target.value))} className="h-11 min-w-0 flex-1 rounded border border-border bg-surface px-3 text-center font-mono text-base font-medium text-ink outline-none focus:border-brand" /><button type="button" aria-label={locale === "fr" ? "Augmenter la quantité" : "Increase quantity"} onClick={() => setSafeQuantity(quantity + 1)} className="inline-flex h-11 w-11 items-center justify-center rounded border border-border text-ink transition-colors hover:border-ink"><Plus size={16} /></button></div>
          <div className="mt-3 flex flex-wrap gap-2">{quickQuantities.map((value) => <button key={value} type="button" onClick={() => setSafeQuantity(value)} className={cx("rounded-full border px-3 py-1.5 font-mono text-xs transition-colors", quantity === value ? "border-accent bg-accent text-brand" : "border-border text-ink-soft hover:border-ink")}>{value.toLocaleString()}</button>)}</div>
        </div>
        <div className="mt-5 grid gap-3">
          <label className="text-xs font-medium text-ink-soft">{locale === "fr" ? "Livraison" : "Delivery to"}<select value={region} onChange={(e) => handleRegionChange(e.target.value as DeliveryRegion | "")} className="mt-1.5 h-10 w-full rounded border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand"><option value="">{locale === "fr" ? "Choisir une destination" : "Choose a destination"}</option><option value="nigeria">{locale === "fr" ? "Nigeria — partout dans le pays" : "Nigeria — anywhere in the country"}</option><option value="international">{locale === "fr" ? "Hors du Nigeria" : "Outside Nigeria"}</option></select></label>
          {region === "nigeria" ? <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium text-ink-soft">{locale === "fr" ? "État" : "State"}<select value={state} onChange={(e) => setState(e.target.value)} className="mt-1.5 h-10 w-full rounded border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand"><option value="">{locale === "fr" ? "Choisir un État" : "Select a state"}</option>{NIGERIAN_STATES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-xs font-medium text-ink-soft">{locale === "fr" ? "Ville / zone" : "City / area"}<input value={city} onChange={(e) => setCity(e.target.value)} placeholder={locale === "fr" ? "Ex. Ikeja" : "e.g. Ikeja"} className="mt-1.5 h-10 w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-brand" /></label></div> : region === "international" ? <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium text-ink-soft">{locale === "fr" ? "Pays" : "Country"}<input value={country} onChange={(e) => setCountry(e.target.value)} placeholder={locale === "fr" ? "Ex. Togo" : "e.g. Togo"} className="mt-1.5 h-10 w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-brand" /></label><label className="text-xs font-medium text-ink-soft">{locale === "fr" ? "Ville" : "City"}<input value={city} onChange={(e) => setCity(e.target.value)} placeholder={locale === "fr" ? "Ex. Lomé" : "e.g. Lome"} className="mt-1.5 h-10 w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-brand" /></label></div> : null}
        </div>
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
        <div className="mt-5 grid gap-2 sm:grid-cols-2"><button ref={buttonRef} type="button" onClick={handleAdd} className={cx("inline-flex min-h-11 items-center justify-center gap-1.5 rounded px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]", added ? "border border-accent bg-surface text-brand hover:bg-surface" : "bg-accent text-brand hover:bg-accent/90")}>{added && <Check size={15} strokeWidth={2.5} />}{added ? dict.common.addedToOrder : dict.common.addToOrder}</button><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded border border-brand px-4 py-3 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-surface">{hasConfirmedPrice ? (locale === "fr" ? "Confirmer le prix" : "Confirm pricing") : dict.common.requestPrice}</a></div>
        <Link href={`/${locale}/order-summary`} className="mt-3 inline-flex w-full items-center justify-center rounded border border-[#4B5563] bg-[#4B5563] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#374151]">{dict.common.reviewOrder} →</Link>
      </div>
      {!mainActionsVisible && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur print:hidden sm:hidden"><div className="mx-auto flex max-w-content items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink">{product.name[locale]}</p><p className="font-mono text-[10px] text-muted">× {quantity.toLocaleString()}</p></div><button type="button" onClick={handleAdd} className={cx("inline-flex shrink-0 items-center justify-center gap-1.5 rounded px-4 py-2.5 text-sm font-semibold transition-all active:scale-95", added ? "border border-accent bg-surface text-brand hover:bg-surface" : "bg-accent text-brand hover:bg-accent/90")}>{added && <Check size={14} strokeWidth={2.5} />}{added ? dict.common.addedToOrder : dict.common.addToOrder}</button></div></div>}
    </div>
  );
}
