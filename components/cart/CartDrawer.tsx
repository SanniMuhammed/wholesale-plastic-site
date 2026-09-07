"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, PackageOpen } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import { getProductBySlug } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { orderInquiryLink } from "@/lib/whatsapp";
import { recordOrderOnWhatsAppClick } from "@/lib/recordOrder";
import { cx } from "@/lib/utils";

export function CartDrawer({
  locale,
  dict,
  open,
  onClose,
}: {
  locale: Locale;
  dict: Dictionary;
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeItem } = useOrder();
  const base = `/${locale}`;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const resolved = items
    .map((i) => {
      const product = getProductBySlug(i.slug);
      if (!product) return null;
      return { slug: i.slug, quantity: i.quantity, name: product.name[locale], capacity: product.capacity };
    })
    .filter(
      (i): i is { slug: string; quantity: number; name: string; capacity: string | undefined } =>
        i !== null
    );

  const totalQuantity = resolved.reduce((sum, i) => sum + i.quantity, 0);

  const whatsappHref = orderInquiryLink(dict, {
    items: resolved.map((i) => ({ name: i.name, quantity: i.quantity })),
  });

  function handleWhatsAppClick() {
    recordOrderOnWhatsAppClick({
      channel: "whatsapp",
      locale,
      items: resolved.map((i) => ({
        slug: i.slug,
        name: i.name,
        capacity: i.capacity,
        quantity: i.quantity,
      })),
    });
  }

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cx(
          "fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dict.cartDrawer.title}
        aria-hidden={!open}
        className={cx(
          // Full-bleed below the sm breakpoint -- previously "max-w-sm" applied
          // unconditionally, which on any viewport wider than ~384px (a
          // resized browser window, a larger phone reporting a wider CSS
          // viewport, a small tablet) capped the drawer short of the edge and
          // left a visible strip of the page showing on the left, as seen in
          // the screenshots. From sm: up it goes back to a fixed-width side
          // panel, which is the right call once there's room to spare.
          "fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-surface shadow-lifted transition-transform duration-300 ease-out sm:max-w-sm",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-semibold text-ink">{dict.cartDrawer.title}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label={dict.nav.close}
              className="inline-flex h-9 w-9 items-center justify-center rounded text-ink-soft hover:bg-brand-light hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          {totalQuantity > 0 && (
            <p className="mt-0.5 font-mono text-xs text-muted">
              {totalQuantity} {dict.common.items}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {resolved.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
              <PackageOpen size={28} strokeWidth={1.25} className="text-muted" />
              <p className="text-sm text-muted">{dict.cartDrawer.empty}</p>
            </div>
          ) : (
            <ul className="divide-y divide-dashed divide-border">
              {resolved.map((item, i) => (
                <li key={item.slug} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="flex min-w-0 items-baseline gap-2.5">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                      {item.capacity && <p className="font-mono text-xs text-muted">{item.capacity}</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.slug, Number(e.target.value) || 1)}
                      aria-label={dict.common.quantity}
                      className="w-14 rounded border border-border px-2 py-1 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="text-xs text-muted hover:text-ink"
                    >
                      {dict.common.removeFromOrder}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-dashed border-border px-5 py-4">
          <div className="flex flex-col gap-2.5">
            {resolved.length > 0 && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center rounded bg-brand px-5 py-3 text-sm font-medium text-surface transition-all hover:bg-brand-dark active:scale-[0.98]"
              >
                {dict.orderSummaryPage.continueOnWhatsapp}
              </a>
            )}
            <Link
              href={`${base}/order-summary`}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
            >
              {dict.cartDrawer.viewFullOrder}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="py-1 text-center text-sm font-medium text-muted hover:text-ink"
            >
              {dict.cartDrawer.keepBrowsing}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
