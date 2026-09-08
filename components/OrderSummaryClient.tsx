"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { orderInquiryLink } from "@/lib/whatsapp";
import { recordOrderOnWhatsAppClick } from "@/lib/recordOrder";
import { cx } from "@/lib/utils";
import { formatNigeriaDestination, NIGERIAN_STATES, type DeliveryRegion } from "@/lib/location";

interface DetailsState { customerName: string; businessName: string; region: DeliveryRegion | ""; state: string; country: string; city: string; deliveryPreference: string; otherInfo: string; }
const EMPTY_DETAILS: DetailsState = { customerName: "", businessName: "", region: "", state: "", country: "", city: "", deliveryPreference: "", otherInfo: "" };
interface FallbackState { region: DeliveryRegion | ""; state: string; country: string; city: string; contact: string; }
const EMPTY_FALLBACK: FallbackState = { region: "", state: "", country: "", city: "", contact: "" };
type FallbackStatus = "idle" | "sending" | "success" | "error";
const REMOVE_ANIMATION_MS = 260;

export function OrderSummaryClient({ locale, dict, products }: { locale: Locale; dict: Dictionary; products: Product[] }) {
  const { items, updateQuantity, removeItem, clear } = useOrder();
  const [details, setDetails] = useState<DetailsState>(EMPTY_DETAILS);
  const [fallback, setFallback] = useState<FallbackState>(EMPTY_FALLBACK);
  const [showFallback, setShowFallback] = useState(false);
  const [status, setStatus] = useState<FallbackStatus>("idle");
  const [removingSlugs, setRemovingSlugs] = useState<Set<string>>(new Set());
  const base = `/${locale}`;
  const sp = dict.orderSummaryPage;
  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const resolvedItems = items.map((i) => { const product = productBySlug.get(i.slug); if (!product) return null; return { slug: i.slug, quantity: i.quantity, name: product.name[locale], capacity: product.capacity }; }).filter((i): i is { slug: string; quantity: number; name: string; capacity: string | undefined } => Boolean(i));
  const isFrench = locale === "fr";
  const destinationCountry = details.region === "nigeria" ? "Nigeria" : details.country;
  const destinationCity = details.region === "nigeria" ? formatNigeriaDestination(details.state, details.city) : details.city;
  const fallbackCountry = fallback.region === "nigeria" ? "Nigeria" : fallback.country;
  const fallbackCity = fallback.region === "nigeria" ? formatNigeriaDestination(fallback.state, fallback.city) : fallback.city;

  function updateDetail<K extends keyof DetailsState>(key: K, value: DetailsState[K]) { setDetails((d) => ({ ...d, [key]: value })); }
  function updateFallback<K extends keyof FallbackState>(key: K, value: FallbackState[K]) { setFallback((f) => ({ ...f, [key]: value })); }
  function handleRegionChange(region: DeliveryRegion | "") { setDetails((d) => ({ ...d, region, state: region === "nigeria" ? d.state : "", country: region === "nigeria" ? "Nigeria" : "" })); }
  function handleFallbackRegionChange(region: DeliveryRegion | "") { setFallback((f) => ({ ...f, region, state: region === "nigeria" ? f.state : "", country: region === "nigeria" ? "Nigeria" : "" })); }
  function handleRemove(slug: string) { setRemovingSlugs((prev) => new Set(prev).add(slug)); window.setTimeout(() => { removeItem(slug); setRemovingSlugs((prev) => { const next = new Set(prev); next.delete(slug); return next; }); }, REMOVE_ANIMATION_MS); }
  function handlePrint() { window.print(); }

  async function handleFallbackSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("sending");
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName: details.customerName, businessName: details.businessName, country: fallbackCountry, city: fallbackCity, contact: fallback.contact, deliveryPreference: details.deliveryPreference, otherInfo: details.otherInfo, items: resolvedItems, locale }) });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success"); clear(); setDetails(EMPTY_DETAILS); setFallback(EMPTY_FALLBACK);
    } catch { setStatus("error"); }
  }

  const whatsappHref = orderInquiryLink(dict, { items: resolvedItems.map((i) => ({ name: i.name, quantity: i.quantity })), customerName: details.customerName, businessName: details.businessName, country: destinationCountry, city: destinationCity, deliveryPreference: details.deliveryPreference, note: details.otherInfo });
  function handleWhatsAppClick() { recordOrderOnWhatsAppClick({ channel: "whatsapp", customerName: details.customerName, businessName: details.businessName, note: details.otherInfo, locale, items: resolvedItems.map((i) => ({ slug: i.slug, name: i.name, capacity: i.capacity, quantity: i.quantity })) }); }

  if (status === "success") return <div className="rounded border border-border bg-brand-light p-8 text-center"><p className="text-ink">{sp.successMessage}</p></div>;
  const hasItems = resolvedItems.length > 0;
  const hasContext = Boolean(details.customerName || details.businessName);
  const deliveryOptions = isFrench ? ["À organiser avec votre équipe", "Retrait / enlèvement", "Livraison à destination"] : ["To arrange with your team", "Pickup / collection", "Delivery to destination"];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr,0.9fr]">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-semibold text-ink">{sp.orderSummaryTitle}</h2>
        {hasContext && <p className="mt-1 text-sm text-muted">{[details.customerName, details.businessName].filter(Boolean).join(" — ")}</p>}
        {!hasItems ? <div className="mt-4 flex flex-col items-center gap-3 rounded border border-dashed border-border p-6 text-center"><PackageOpen size={24} strokeWidth={1.25} className="text-muted" /><p className="text-sm text-muted">{sp.orderEmpty}</p><Link href={`${base}/products`} className="text-sm font-medium text-brand hover:underline print:hidden">{sp.browseProducts}</Link></div> : <ul className="mt-4 divide-y divide-dashed divide-border border-t border-dashed border-border">{resolvedItems.map((item) => <li key={item.slug} className={cx("grid transition-[grid-template-rows] duration-300 ease-in-out", removingSlugs.has(item.slug) ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}><div className="overflow-hidden"><div className={cx("flex items-center justify-between gap-3 py-3 transition-opacity duration-150", removingSlugs.has(item.slug) && "opacity-0")}><div><span className="text-sm text-ink">{item.name}</span>{item.capacity && <span className="ml-2 font-mono text-xs text-muted">({item.capacity})</span>}</div><div className="flex items-center gap-2"><span className="hidden font-mono text-sm text-ink print:inline">{dict.common.quantity}: {item.quantity}</span><input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.slug, Number(e.target.value) || 1)} className="w-16 rounded border border-border px-2 py-1 font-mono text-sm print:hidden" aria-label={dict.common.quantity} /><button type="button" onClick={() => handleRemove(item.slug)} className="text-xs text-muted hover:text-ink print:hidden">{dict.common.removeFromOrder}</button></div></div></div></li>)}</ul>}
        {hasItems && <p className="mt-4 text-xs text-muted print:hidden">{sp.receiptNote}</p>}
      </div>

      <div className="print:hidden"><div className="grid gap-4">
        <div><h2 className="font-display text-lg font-semibold text-ink">{sp.detailsTitle}</h2><p className="mt-1 text-sm text-muted">{sp.detailsNote}</p></div>
        <Field label={sp.fields.customerName} value={details.customerName} onChange={(v) => updateDetail("customerName", v)} />
        <Field label={sp.fields.businessName} value={details.businessName} onChange={(v) => updateDetail("businessName", v)} />

        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{isFrench ? "Livraison" : "Delivery to"}</span><select value={details.region} onChange={(e) => handleRegionChange(e.target.value as DeliveryRegion | "")} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"><option value="">{isFrench ? "Choisir une destination" : "Choose a destination"}</option><option value="nigeria">{isFrench ? "Nigeria — partout dans le pays" : "Nigeria — anywhere in the country"}</option><option value="international">{isFrench ? "Hors du Nigeria" : "Outside Nigeria"}</option></select></label>
        {details.region === "nigeria" ? <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{isFrench ? "État" : "State"}</span><select required value={details.state} onChange={(e) => updateDetail("state", e.target.value)} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"><option value="">{isFrench ? "Choisir un État" : "Select a state"}</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label><Field label={isFrench ? "Ville / zone" : "City / area"} required value={details.city} onChange={(v) => updateDetail("city", v)} /></div> : details.region === "international" ? <div className="grid gap-4 sm:grid-cols-2"><Field label={isFrench ? "Pays" : "Country"} required value={details.country} onChange={(v) => updateDetail("country", v)} /><Field label={isFrench ? "Ville" : "City"} required value={details.city} onChange={(v) => updateDetail("city", v)} /></div> : null}

        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{isFrench ? "Préférence de livraison" : "Delivery preference"}</span><select value={details.deliveryPreference} onChange={(e) => updateDetail("deliveryPreference", e.target.value)} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"><option value="">{isFrench ? "Choisir une option (facultatif)" : "Choose an option (optional)"}</option>{deliveryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <TextAreaField label={sp.fields.otherInfo} value={details.otherInfo} onChange={(v) => updateDetail("otherInfo", v)} />
        <div className="rounded border border-border bg-brand-light/50 p-4 text-sm text-ink-soft"><p className="font-medium text-ink">{isFrench ? "Votre demande sera préparée pour WhatsApp" : "Your request will be prepared for WhatsApp"}</p><p className="mt-1">{isFrench ? "Produits, quantités, destination et préférence de livraison seront inclus dans le message." : "Products, quantities, destination and delivery preference will be included in the message."}</p></div>
        <div className="flex flex-wrap gap-3 pt-2">{hasItems ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick} className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-all hover:bg-brand-dark active:scale-[0.98]">{sp.continueOnWhatsapp}</a> : <span aria-disabled="true" className="inline-flex cursor-not-allowed items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface opacity-50">{sp.continueOnWhatsapp}</span>}<button type="button" onClick={handlePrint} disabled={!hasItems} className="inline-flex items-center justify-center rounded border border-ink px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-ink hover:text-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">{sp.printReceipt}</button></div>
        <div className="mt-4 border-t border-border pt-4">{!showFallback ? <p className="text-sm text-muted">{sp.noWhatsappPrompt}{" "}<button type="button" onClick={() => setShowFallback(true)} className="font-medium text-brand hover:underline">{sp.noWhatsappToggle}</button></p> : <form onSubmit={handleFallbackSubmit} className="grid gap-4"><p className="text-sm text-muted">{sp.fallbackIntro}</p><label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{isFrench ? "Livraison" : "Delivery to"}</span><select required value={fallback.region} onChange={(e) => handleFallbackRegionChange(e.target.value as DeliveryRegion | "")} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"><option value="">{isFrench ? "Choisir une destination" : "Choose a destination"}</option><option value="nigeria">{isFrench ? "Nigeria — partout dans le pays" : "Nigeria — anywhere in the country"}</option><option value="international">{isFrench ? "Hors du Nigeria" : "Outside Nigeria"}</option></select></label>{fallback.region === "nigeria" ? <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{isFrench ? "État" : "State"}</span><select required value={fallback.state} onChange={(e) => updateFallback("state", e.target.value)} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"><option value="">{isFrench ? "Choisir un État" : "Select a state"}</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label><Field label={isFrench ? "Ville / zone" : "City / area"} required value={fallback.city} onChange={(v) => updateFallback("city", v)} /></div> : fallback.region === "international" ? <div className="grid gap-4 sm:grid-cols-2"><Field label={sp.fallbackFields.country} required value={fallback.country} onChange={(v) => updateFallback("country", v)} /><Field label={sp.fallbackFields.city} required value={fallback.city} onChange={(v) => updateFallback("city", v)} /></div> : null}<Field label={sp.fallbackFields.contact} required value={fallback.contact} onChange={(v) => updateFallback("contact", v)} />{status === "error" && <p className="text-sm text-red-700">{sp.errorMessage}</p>}<button type="submit" disabled={status === "sending" || !hasItems} className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-all hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60">{status === "sending" ? dict.common.sending : sp.submit}</button></form>}</div>
      </div></div>
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span><input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none" /></label>;
}
function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span><textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none" /></label>;
}
