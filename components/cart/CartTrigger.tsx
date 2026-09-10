"use client";

import { ShoppingBag } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import { useCartUI } from "@/components/cart/CartUIProvider";
import type { Dictionary } from "@/lib/getDictionary";
import { cx } from "@/lib/utils";

export function CartTrigger({
  dict,
  variant = "default",
}: {
  dict: Dictionary;
  /** "default" is the labelled button used in the desktop nav. "icon" is
   *  the compact, badge-only button used in the mobile header -- always
   *  visible, independent of whether the nav menu is open. */
  variant?: "default" | "icon";
}) {
  const { items } = useOrder();
  const { openDrawer } = useCartUI();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={openDrawer}
        aria-label={dict.nav.reviewOrder}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded border border-border text-ink"
      >
        <ShoppingBag size={18} strokeWidth={1.75} />
        <span
          data-cart-badge
          className={cx(
            "absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 font-mono text-xs font-bold text-brand transition-opacity",
            count === 0 && "opacity-0"
          )}
        >
          {count}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="inline-flex items-center justify-center gap-2 rounded border border-brand bg-brand px-4 py-2 text-sm font-semibold text-surface transition-colors hover:bg-brand-dark"
    >
      <ShoppingBag size={16} strokeWidth={1.75} />
      {dict.nav.reviewOrder}
      <span
        data-cart-badge
        className={cx(
          "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 font-mono text-xs font-bold text-brand transition-opacity",
          count === 0 && "opacity-0"
        )}
      >
        {count}
      </span>
    </button>
  );
}
