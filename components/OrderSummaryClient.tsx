"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useOrder } from "@/components/OrderProvider";
import { getProductBySlug } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { orderInquiryLink } from "@/lib/whatsapp";

interface DetailsState {
  customerName: string;
  businessName: string;
  otherInfo: string;
}

const EMPTY_DETAILS: DetailsState = { customerName: "", businessName: "", otherInfo: "" };

interface FallbackState {
  country: string;
  city: string;
  contact: string;
}

const EMPTY_FALLBACK: FallbackState = { country: "", city: "", contact: "" };

type FallbackStatus = "idle" | "sending" | "success" | "error";

export function OrderSummaryClient({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { items, updateQuantity, removeItem, clear } = useOrder();
  const [details, setDetails] = useState<DetailsState>(EMPTY_DETAILS);
  const [fallback, setFallback] = useState<FallbackState>(EMPTY_FALLBACK);
  const [showFallback, setShowFallback] = useState(false);
  const [status, setStatus] = useState<FallbackStatus>("idle");
  const base = `/${locale}`;
  const sp = dict.orderSummaryPage;

  const resolvedItems = items
    .map((i) => {
      const product = getProductBySlug(i.slug);
      if (!product) return null;
      return {
        slug: i.slug,
        quantity: i.quantity,
        name: product.name[locale],
        capacity: product.capacity,
      };
    })
    .filter((i): i is { slug: string; quantity: number; name: string; capacity?: string } => Boolean(i));

  function updateDetail<K extends keyof DetailsState>(key: K, value: DetailsState[K]) {
    setDetails((d) => ({ ...d, [key]: value }));
  }

  function updateFallback<K extends keyof FallbackState>(key: K, value: FallbackState[K]) {
    setFallback((f) => ({ ...f, [key]: value }));
  }

  function handlePrint() {
    window.print();
  }

  async function handleFallbackSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, ...fallback, items: resolvedItems, locale }),
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

  const whatsappHref = orderInquiryLink(dict, {
    items: resolvedItems.map((i) => ({ name: i.name, quantity: i.quantity })),
    customerName: details.customerName,
    businessName: details.businessName,
    note: details.otherInfo,
  });

  if (status === "success") {
    return (
      <div className="rounded border border-border bg-brand-light p-8 text-center">
        <p className="text-ink">{sp.successMessage}</p>
      </div>
    );
  }

  const hasItems = resolvedItems.length > 0;
  const hasContext = Boolean(details.customerName || details.businessName);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr,0.9fr]">
      {/* Receipt card -- this block is what prints. */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-semibold text-ink">{sp.orderSummaryTitle}</h2>
        {hasContext && (
          <p className="mt-1 text-sm text-muted">
            {[details.customerName, details.businessName].filter(Boolean).join(" — ")}
          </p>
        )}

        {!hasItems ? (
          <div className="mt-4 rounded border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted">{sp.orderEmpty}</p>
            <Link href={`${base}/products`} className="mt-3 inline-block text-sm font-medium text-brand hover:underline print:hidden">
              {sp.browseProducts}
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {resolvedItems.map((item) => (
              <li key={item.slug} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <span className="text-sm text-ink">{item.name}</span>
                  {item.capacity && <span className="ml-2 text-xs text-muted">({item.capacity})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden text-sm text-ink print:inline">
                    {dict.common.quantity}: {item.quantity}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.slug, Number(e.target.value) || 1)}
                    className="w-16 rounded border border-border px-2 py-1 text-sm print:hidden"
                    aria-label={dict.common.quantity}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="text-xs text-muted hover:text-ink print:hidden"
                  >
                    {dict.common.removeFromOrder}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {hasItems && <p className="mt-4 text-xs text-muted print:hidden">{sp.receiptNote}</p>}
      </div>

      {/* Actions -- hidden entirely when printing. */}
      <div className="print:hidden">
        <div className="grid gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{sp.detailsTitle}</h2>
            <p className="mt-1 text-sm text-muted">{sp.detailsNote}</p>
          </div>
          <Field
            label={sp.fields.customerName}
            value={details.customerName}
            onChange={(v) => updateDetail("customerName", v)}
          />
          <Field
            label={sp.fields.businessName}
            value={details.businessName}
            onChange={(v) => updateDetail("businessName", v)}
          />
          <TextAreaField
            label={sp.fields.otherInfo}
            value={details.otherInfo}
            onChange={(v) => updateDetail("otherInfo", v)}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            {hasItems ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
              >
                {sp.continueOnWhatsapp}
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface opacity-50"
              >
                {sp.continueOnWhatsapp}
              </span>
            )}
            <button
              type="button"
              onClick={handlePrint}
              disabled={!hasItems}
              className="inline-flex items-center justify-center rounded border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sp.printReceipt}
            </button>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            {!showFallback ? (
              <p className="text-sm text-muted">
                {sp.noWhatsappPrompt}{" "}
                <button
                  type="button"
                  onClick={() => setShowFallback(true)}
                  className="font-medium text-brand hover:underline"
                >
                  {sp.noWhatsappToggle}
                </button>
              </p>
            ) : (
              <form onSubmit={handleFallbackSubmit} className="grid gap-4">
                <p className="text-sm text-muted">{sp.fallbackIntro}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={sp.fallbackFields.country}
                    required
                    value={fallback.country}
                    onChange={(v) => updateFallback("country", v)}
                  />
                  <Field
                    label={sp.fallbackFields.city}
                    required
                    value={fallback.city}
                    onChange={(v) => updateFallback("city", v)}
                  />
                </div>
                <Field
                  label={sp.fallbackFields.contact}
                  required
                  value={fallback.contact}
                  onChange={(v) => updateFallback("contact", v)}
                />

                {status === "error" && <p className="text-sm text-red-700">{sp.errorMessage}</p>}

                <button
                  type="submit"
                  disabled={status === "sending" || !hasItems}
                  className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark disabled:opacity-60"
                >
                  {status === "sending" ? dict.common.sending : sp.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}
