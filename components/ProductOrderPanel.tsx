"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import { useCartUI } from "@/components/cart/CartUIProvider";
import { useInView } from "@/lib/hooks/useInView";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { productInquiryLink } from "@/lib/whatsapp";
import { cx } from "@/lib/utils";

export function ProductOrderPanel({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const { addItem } = useOrder();
  const { flyToCart, notifyAdded } = useCartUI();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const base = `/${locale}`;

  // Sentinel sits right after the main actions row. Once it scrolls out of
  // view the primary Add to Order button is no longer reachable, so the
  // sticky mobile bar below takes over -- functional, not decorative.
  const { ref: sentinelRef, inView: mainActionsVisible } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0,
  });

  function handleAdd() {
    addItem(product.slug, quantity);
    flyToCart(buttonRef.current);
    notifyAdded(product.name[locale]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  const whatsappHref = productInquiryLink(dict, {
    product: product.name[locale],
    quantity,
  });

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-ink-soft" htmlFor="qty">
          {dict.common.quantity}
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          className="w-24 rounded border border-border px-3 py-2 font-mono text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleAdd}
          className={cx(
            "inline-flex items-center justify-center gap-1.5 rounded border border-ink px-5 py-3 text-sm font-medium text-ink transition-all duration-150 hover:bg-ink hover:text-surface active:scale-95",
            added && "border-brand bg-brand text-surface hover:bg-brand-dark"
          )}
        >
          {added && <Check size={15} strokeWidth={2.5} />}
          {added ? dict.common.addedToOrder : dict.common.addToOrder}
        </button>
        <Link
          href={`${base}/order-summary`}
          className="inline-flex items-center justify-center rounded bg-brand px-5 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
        >
          {dict.common.reviewOrder}
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded border border-border px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          {dict.common.whatsappUs}
        </a>
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {!mainActionsVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur print:hidden sm:hidden">
          <div className="mx-auto flex max-w-content items-center gap-3">
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{product.name[locale]}</p>
            <button
              type="button"
              onClick={handleAdd}
              className={cx(
                "inline-flex shrink-0 items-center justify-center gap-1.5 rounded bg-brand px-4 py-2.5 text-sm font-medium text-surface transition-all active:scale-95",
                added && "bg-brand-dark"
              )}
            >
              {added && <Check size={14} strokeWidth={2.5} />}
              {added ? dict.common.addedToOrder : dict.common.addToOrder}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
