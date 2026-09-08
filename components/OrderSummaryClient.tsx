"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, FileDown, Loader2, PackageOpen, Send, Trash2 } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { buildWhatsAppLink, buildOrderMessage } from "@/lib/whatsapp";
import { recordOrderOnWhatsAppClick } from "@/lib/recordOrder";
import { cx } from "@/lib/utils";
import { formatNigeriaDestination, NIGERIAN_STATES, type DeliveryRegion } from "@/lib/location";

interface DetailsState {
  customerName: string;
  businessName: string;
  region: DeliveryRegion | "";
  state: string;
  country: string;
  city: string;
  deliveryPreference: string;
  otherInfo: string;
}

const EMPTY_DETAILS: DetailsState = {
  customerName: "",
  businessName: "",
  region: "",
  state: "",
  country: "",
  city: "",
  deliveryPreference: "",
  otherInfo: "",
};

interface FallbackState {
  region: DeliveryRegion | "";
  state: string;
  country: string;
  city: string;
  contact: string;
}

const EMPTY_FALLBACK: FallbackState = { region: "", state: "", country: "", city: "", contact: "" };
type FallbackStatus = "idle" | "sending" | "success" | "error";
type ShareStatus = "idle" | "preparing" | "sharing" | "downloaded";
const REMOVE_ANIMATION_MS = 260;

function makeReference() {
  const stamp = new Date();
  const date = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(stamp.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SV-${date}-${suffix}`;
}

export function OrderSummaryClient({ locale, dict, products }: { locale: Locale; dict: Dictionary; products: Product[] }) {
  const { items, updateQuantity, removeItem, clear } = useOrder();
  const [details, setDetails] = useState<DetailsState>(EMPTY_DETAILS);
  const [fallback, setFallback] = useState<FallbackState>(EMPTY_FALLBACK);
  const [showFallback, setShowFallback] = useState(false);
  const [status, setStatus] = useState<FallbackStatus>("idle");
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [removingSlugs, setRemovingSlugs] = useState<Set<string>>(new Set());
  const [orderReference] = useState(makeReference);
  const base = `/${locale}`;
  const sp = dict.orderSummaryPage;
  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const resolvedItems = items
    .map((i) => {
      const product = productBySlug.get(i.slug);
      if (!product) return null;
      return { slug: i.slug, quantity: i.quantity, name: product.name[locale], capacity: product.capacity };
    })
    .filter((i): i is { slug: string; quantity: number; name: string; capacity: string | undefined } => Boolean(i));

  const isFrench = locale === "fr";
  const destinationCountry = details.region === "nigeria" ? "Nigeria" : details.country;
  const destinationCity = details.region === "nigeria" ? formatNigeriaDestination(details.state, details.city) : details.city;
  const fallbackCountry = fallback.region === "nigeria" ? "Nigeria" : fallback.country;
  const fallbackCity = fallback.region === "nigeria" ? formatNigeriaDestination(fallback.state, fallback.city) : fallback.city;
  const hasItems = resolvedItems.length > 0;
  const totalQuantity = resolvedItems.reduce((sum, item) => sum + item.quantity, 0);

  function updateDetail<K extends keyof DetailsState>(key: K, value: DetailsState[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function updateFallback<K extends keyof FallbackState>(key: K, value: FallbackState[K]) {
    setFallback((current) => ({ ...current, [key]: value }));
  }

  function handleRegionChange(region: DeliveryRegion | "") {
    setDetails((current) => ({
      ...current,
      region,
      state: region === "nigeria" ? current.state : "",
      country: region === "nigeria" ? "Nigeria" : "",
      city: "",
    }));
  }

  function handleFallbackRegionChange(region: DeliveryRegion | "") {
    setFallback((current) => ({
      ...current,
      region,
      state: region === "nigeria" ? current.state : "",
      country: region === "nigeria" ? "Nigeria" : "",
      city: "",
    }));
  }

  function handleRemove(slug: string) {
    setRemovingSlugs((prev) => new Set(prev).add(slug));
    window.setTimeout(() => {
      removeItem(slug);
      setRemovingSlugs((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }, REMOVE_ANIMATION_MS);
  }

  function handlePrint() {
    window.print();
  }

  async function requestPdf(): Promise<File> {
    const response = await fetch("/api/order-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        reference: orderReference,
        customerName: details.customerName,
        businessName: details.businessName,
        country: destinationCountry,
        city: destinationCity,
        deliveryPreference: details.deliveryPreference,
        note: details.otherInfo,
        items: resolvedItems.map((item) => ({ name: item.name, quantity: item.quantity, capacity: item.capacity })),
      }),
    });
    if (!response.ok) throw new Error("PDF request failed");
    const blob = await response.blob();
    return new File([blob], `${orderReference}.pdf`, { type: "application/pdf" });
  }

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function handleWhatsAppShare() {
    if (!hasItems || shareStatus === "preparing" || shareStatus === "sharing") return;
    setShareStatus("preparing");
    const message = buildOrderMessage(dict, {
      items: resolvedItems.map((item) => ({ name: item.name, quantity: item.quantity })),
      customerName: details.customerName,
      businessName: details.businessName,
      country: destinationCountry,
      city: destinationCity,
      deliveryPreference: details.deliveryPreference,
      note: details.otherInfo,
    });

    try {
      const pdf = await requestPdf();
      const shareData: ShareData = { title: `${dict.orderSummaryPage.title} — ${orderReference}`, text: message, files: [pdf] };
      if (navigator.share && navigator.canShare?.({ files: [pdf] })) {
        setShareStatus("sharing");
        await navigator.share(shareData);
      } else {
        downloadFile(pdf);
        setShareStatus("downloaded");
        window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
      }
      recordOrderOnWhatsAppClick({
        channel: "whatsapp",
        customerName: details.customerName,
        businessName: details.businessName,
        note: details.otherInfo,
        locale,
        items: resolvedItems.map((item) => ({ slug: item.slug, name: item.name, capacity: item.capacity, quantity: item.quantity })),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setShareStatus("idle");
        return;
      }
      setShareStatus("idle");
      window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }
  }

  async function handleDownloadPdf() {
    if (!hasItems || shareStatus === "preparing" || shareStatus === "sharing") return;
    setShareStatus("preparing");
    try {
      const pdf = await requestPdf();
      downloadFile(pdf);
      setShareStatus("downloaded");
      window.setTimeout(() => setShareStatus("idle"), 1800);
    } catch {
      setShareStatus("idle");
    }
  }

  async function handleFallbackSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: details.customerName,
          businessName: details.businessName,
          country: fallbackCountry,
          city: fallbackCity,
          contact: fallback.contact,
          deliveryPreference: details.deliveryPreference,
          otherInfo: details.otherInfo,
          items: resolvedItems,
          locale,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      clear();
      setDetails(EMPTY_DETAILS);
      setFallback(EMPTY_FALLBACK);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <div className="rounded-2xl border border-brand/20 bg-brand-light p-8 text-center"><Check className="mx-auto text-brand" size={30} /><p className="mt-3 font-display text-lg font-semibold text-ink">{sp.successMessage}</p></div>;
  }

  const deliveryOptions = isFrench
    ? ["À organiser avec votre équipe", "Retrait / enlèvement", "Livraison à destination"]
    : ["To arrange with your team", "Pickup / collection", "Delivery to destination"];
  const shareBusy = shareStatus === "preparing" || shareStatus === "sharing";

  return (
    <div className="pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4 print:hidden">
        <div>
          <p className="eyebrow text-brand">{isFrench ? "Prêt à envoyer" : "Ready to send"}</p>
          <p className="mt-1 text-sm text-muted">{isFrench ? "Votre sélection devient un bon de commande PDF partageable." : "Your selection becomes a shareable PDF order sheet."}</p>
        </div>
        <span className="font-mono text-xs text-muted">{orderReference}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.72fr)] lg:items-start">
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card print:rounded-none print:border-0 print:shadow-none">
          <div className="border-b border-border bg-brand px-5 py-5 text-surface sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-surface/70">Sherinab Venture.</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">{sp.orderSummaryTitle}</h2>
              </div>
              <span className="font-mono text-[10px] text-surface/70">{orderReference}</span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4 border-t border-surface/20 pt-4">
              <span className="text-xs text-surface/75">{isFrench ? "Sélection actuelle" : "Current selection"}</span>
              <span className="font-mono text-sm font-semibold">{totalQuantity.toLocaleString()} {dict.common.items}</span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {hasItems ? (
              <ul className="divide-y divide-border">
                {resolvedItems.map((item) => (
                  <li key={item.slug} className={cx("grid transition-[grid-template-rows] duration-300", removingSlugs.has(item.slug) ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}>
                    <div className="overflow-hidden">
                      <div className={cx("grid grid-cols-[1fr_auto] gap-4 py-4 transition-opacity", removingSlugs.has(item.slug) && "opacity-0")}>
                        <div className="min-w-0">
                          <p className="font-display text-base font-semibold text-ink">{item.name}</p>
                          {item.capacity && <p className="mt-1 font-mono text-[11px] text-muted">{item.capacity}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 items-center rounded-lg border border-border bg-surface print:hidden">
                            <button type="button" onClick={() => updateQuantity(item.slug, Math.max(1, item.quantity - 1))} className="inline-flex h-full w-9 items-center justify-center text-muted hover:text-ink" aria-label={`Decrease ${item.name}`}>−</button>
                            <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.slug, Number(e.target.value) || 1)} aria-label={dict.common.quantity} className="h-full w-14 border-x border-border bg-transparent text-center font-mono text-sm font-semibold text-ink outline-none" />
                            <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="inline-flex h-full w-9 items-center justify-center text-muted hover:text-ink" aria-label={`Increase ${item.name}`}>+</button>
                          </div>
                          <span className="hidden font-mono text-sm font-semibold text-ink print:inline">× {item.quantity.toLocaleString()}</span>
                          <button type="button" onClick={() => handleRemove(item.slug)} className="hidden h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-brand-light hover:text-brand print:hidden sm:inline-flex" aria-label={`${dict.common.removeFromOrder}: ${item.name}`}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
                <PackageOpen size={30} strokeWidth={1.25} className="text-muted" />
                <p className="mt-3 font-display text-lg font-semibold text-ink">{sp.orderEmpty}</p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-muted">{isFrench ? "Ajoutez les produits dont votre entreprise a besoin pour commencer." : "Add the products your business needs to start building the order."}</p>
                <Link href={`${base}/products`} className="mt-5 text-sm font-semibold text-brand hover:underline print:hidden">{sp.browseProducts} →</Link>
              </div>
            )}
          </div>

          <div className="hidden border-t border-border px-7 py-5 print:block">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div><p className="eyebrow text-muted">{isFrench ? "Client" : "Customer"}</p><p className="mt-1 text-ink">{details.customerName || "—"}</p></div>
              <div><p className="eyebrow text-muted">{isFrench ? "Entreprise" : "Business"}</p><p className="mt-1 text-ink">{details.businessName || "—"}</p></div>
              <div><p className="eyebrow text-muted">{isFrench ? "Destination" : "Destination"}</p><p className="mt-1 text-ink">{[destinationCity, destinationCountry].filter(Boolean).join(", ") || "—"}</p></div>
              <div><p className="eyebrow text-muted">{isFrench ? "Livraison" : "Delivery"}</p><p className="mt-1 text-ink">{details.deliveryPreference || "—"}</p></div>
            </div>
            {details.otherInfo && <div className="mt-6"><p className="eyebrow text-muted">{isFrench ? "Notes" : "Notes"}</p><p className="mt-1 text-sm text-ink">{details.otherInfo}</p></div>}
            <p className="mt-8 text-xs text-muted">{isFrench ? "Les prix et la disponibilité seront confirmés par notre équipe." : "Pricing and availability will be confirmed by our team."}</p>
          </div>
        </section>

        <aside className="space-y-6 print:hidden">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div>
              <p className="eyebrow text-brand">{sp.detailsTitle}</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-ink">{isFrench ? "Préparez votre demande" : "Help us prepare it"}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{sp.detailsNote}</p>
            </div>
            <div className="mt-5 grid gap-4">
              <Field label={sp.fields.customerName} value={details.customerName} onChange={(v) => updateDetail("customerName", v)} />
              <Field label={sp.fields.businessName} value={details.businessName} onChange={(v) => updateDetail("businessName", v)} />
              <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{isFrench ? "Livraison" : "Delivery to"}</span><select value={details.region} onChange={(e) => handleRegionChange(e.target.value as DeliveryRegion | "")} className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand"><option value="">{isFrench ? "Choisir une destination" : "Choose a destination"}</option><option value="nigeria">{isFrench ? "Nigeria — partout dans le pays" : "Nigeria — anywhere in the country"}</option><option value="international">{isFrench ? "Hors du Nigeria" : "Outside Nigeria"}</option></select></label>
              {details.region === "nigeria" ? <div className="grid gap-4 sm:grid-cols-2"><SelectField label={isFrench ? "État" : "State"} value={details.state} onChange={(v) => updateDetail("state", v)} options={NIGERIAN_STATES} placeholder={isFrench ? "Choisir un État" : "Select a state"} required /><Field label={isFrench ? "Ville / zone" : "City / area"} required value={details.city} onChange={(v) => updateDetail("city", v)} /></div> : details.region === "international" ? <div className="grid gap-4 sm:grid-cols-2"><Field label={isFrench ? "Pays" : "Country"} required value={details.country} onChange={(v) => updateDetail("country", v)} /><Field label={isFrench ? "Ville" : "City"} required value={details.city} onChange={(v) => updateDetail("city", v)} /></div> : null}
              <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{isFrench ? "Préférence de livraison" : "Delivery preference"}</span><select value={details.deliveryPreference} onChange={(e) => updateDetail("deliveryPreference", e.target.value)} className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand"><option value="">{isFrench ? "Facultatif" : "Optional"}</option>{deliveryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <TextAreaField label={sp.fields.otherInfo} value={details.otherInfo} onChange={(v) => updateDetail("otherInfo", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-brand/20 bg-brand-light/45 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-surface"><Send size={16} /></div>
              <div><h2 className="font-display text-lg font-semibold text-ink">{isFrench ? "Envoyer la commande complète" : "Send the complete order"}</h2><p className="mt-1 text-sm leading-6 text-muted">{isFrench ? "Le bon de commande PDF et le message sont préparés ensemble pour WhatsApp." : "Your PDF order sheet and message are prepared together for WhatsApp."}</p></div>
            </div>
            <button type="button" onClick={handleWhatsAppShare} disabled={!hasItems || shareBusy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-surface shadow-sm transition-all hover:bg-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
              {shareBusy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
              {shareStatus === "preparing" ? "Preparing PDF…" : shareStatus === "sharing" ? "Opening share sheet…" : sp.continueOnWhatsapp}
            </button>
            <button type="button" onClick={handleDownloadPdf} disabled={!hasItems || shareBusy} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-ink px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"><FileDown size={16} />{shareStatus === "downloaded" ? "PDF ready" : "Download PDF"}</button>
            <p className="mt-3 text-center text-[11px] leading-5 text-muted">{isFrench ? "Sur Android, votre téléphone peut joindre automatiquement le PDF au partage WhatsApp." : "On Android, your phone can attach the PDF automatically when sharing to WhatsApp."}</p>
          </section>

          <div className="border-t border-border pt-5">
            {!showFallback ? <p className="text-sm text-muted">{sp.noWhatsappPrompt} <button type="button" onClick={() => setShowFallback(true)} className="font-semibold text-brand hover:underline">{sp.noWhatsappToggle}</button></p> : <form onSubmit={handleFallbackSubmit} className="grid gap-4"><p className="text-sm text-muted">{sp.fallbackIntro}</p><label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{isFrench ? "Livraison" : "Delivery to"}</span><select required value={fallback.region} onChange={(e) => handleFallbackRegionChange(e.target.value as DeliveryRegion | "")} className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand"><option value="">{isFrench ? "Choisir une destination" : "Choose a destination"}</option><option value="nigeria">{isFrench ? "Nigeria — partout dans le pays" : "Nigeria — anywhere in the country"}</option><option value="international">{isFrench ? "Hors du Nigeria" : "Outside Nigeria"}</option></select></label>{fallback.region === "nigeria" ? <div className="grid gap-4 sm:grid-cols-2"><SelectField label={isFrench ? "État" : "State"} value={fallback.state} onChange={(v) => updateFallback("state", v)} options={NIGERIAN_STATES} placeholder={isFrench ? "Choisir un État" : "Select a state"} required /><Field label={isFrench ? "Ville / zone" : "City / area"} required value={fallback.city} onChange={(v) => updateFallback("city", v)} /></div> : fallback.region === "international" ? <div className="grid gap-4 sm:grid-cols-2"><Field label={sp.fallbackFields.country} required value={fallback.country} onChange={(v) => updateFallback("country", v)} /><Field label={sp.fallbackFields.city} required value={fallback.city} onChange={(v) => updateFallback("city", v)} /></div> : null}<Field label={sp.fallbackFields.contact} required value={fallback.contact} onChange={(v) => updateFallback("contact", v)} />{status === "error" && <p className="text-sm text-red-700">{sp.errorMessage}</p>}<button type="submit" disabled={status === "sending" || !hasItems} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-surface disabled:opacity-50">{status === "sending" ? dict.common.sending : sp.submit}</button></form>}
          </div>
        </aside>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 print:hidden">
        <p className="text-xs leading-5 text-muted">{sp.receiptNote}</p>
        <button type="button" onClick={handlePrint} disabled={!hasItems} className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"><FileDown size={15} />{sp.printReceipt}</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}{required ? " *" : ""}</span><input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand" /></label>;
}

function SelectField({ label, value, onChange, options, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; placeholder: string; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}{required ? " *" : ""}</span><select required={required} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-brand"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span><textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-ink outline-none placeholder:text-muted focus:border-brand" /></label>;
}
