"use client";

import { ShoppingBag } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import { useCartUI } from "@/components/cart/CartUIProvider";
import type { Dictionary } from "@/lib/getDictionary";
import { cx } from "@/lib/utils";

export function CartTrigger({
  dict,
  variant = "desktop",
}: {
  dict: Dictionary;
  variant?: "desktop" | "mobile";
}) {
  const { items } = useOrder();
  const { openDrawer, cartTargetRef } = useCartUI();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded bg-brand px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand-dark",
        variant === "mobile" && "w-full py-3"
      )}
    >
      <ShoppingBag size={16} strokeWidth={1.75} />
      {dict.common.reviewOrder}
      <span
        ref={cartTargetRef}
        className={cx(
          "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-surface px-1 font-mono text-xs font-bold text-brand-dark transition-opacity",
          count === 0 && "opacity-0"
        )}
      >
        {count}
      </span>
    </button>
  );
}
