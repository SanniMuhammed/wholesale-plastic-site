"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrder } from "@/components/OrderProvider";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { productInquiryLink } from "@/lib/whatsapp";

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
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const base = `/${locale}`;

  function handleAdd() {
    addItem(product.slug, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
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
          className="w-24 rounded border border-border px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
        >
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
    </div>
  );
}
