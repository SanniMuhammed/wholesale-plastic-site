"use client";

import { useRef } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useOrder } from "@/components/OrderProvider";
import { useCartUI } from "@/components/cart/CartUIProvider";
import type { Dictionary } from "@/lib/getDictionary";
import { cx } from "@/lib/utils";

interface AddToOrderButtonProps {
  slug: string;
  productName: string;
  dict: Dictionary;
  className?: string;
  fullWidth?: boolean;
}

export function AddToOrderButton({ slug, productName, dict, className, fullWidth }: AddToOrderButtonProps) {
  const { items, addItem, removeItem, updateQuantity } = useOrder();
  const { flyToCart, notifyAdded } = useCartUI();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const item = items.find((entry) => entry.slug === slug);
  const quantity = item?.quantity ?? 0;

  function handleAdd() {
    addItem(slug, 1);
    flyToCart(buttonRef.current);
    notifyAdded(productName);
  }

  if (quantity > 0) {
    return (
      <div className={cx("flex h-11 w-full items-center overflow-hidden rounded border border-brand bg-brand text-surface", className)} aria-label={`${productName}, ${quantity} in order`}>
        <button type="button" onClick={() => removeItem(slug)} aria-label={`Remove ${productName} from order`} title={dict.common.remove} className="inline-flex h-full w-11 shrink-0 items-center justify-center transition-colors hover:bg-brand-dark active:scale-95">
          <Trash2 size={16} strokeWidth={2} />
        </button>
        <button type="button" onClick={() => quantity > 1 ? updateQuantity(slug, quantity - 1) : removeItem(slug)} aria-label={`Decrease ${productName} quantity`} title="Decrease quantity" className="inline-flex h-full w-10 shrink-0 items-center justify-center border-x border-surface/20 transition-colors hover:bg-brand-dark active:scale-95">
          <Minus size={15} strokeWidth={2.25} />
        </button>
        <span className="flex min-w-0 flex-1 items-center justify-center px-1 text-xs font-semibold tabular-nums">
          {quantity} {dict.common.inOrder ?? "in order"}
        </span>
        <button type="button" onClick={() => addItem(slug, 1)} aria-label={`Increase ${productName} quantity`} title="Increase quantity" className="inline-flex h-full w-11 shrink-0 items-center justify-center border-l border-surface/20 transition-colors hover:bg-brand-dark active:scale-95">
          <Plus size={16} strokeWidth={2.25} />
        </button>
      </div>
    );
  }

  return (
    <button ref={buttonRef} type="button" onClick={handleAdd} className={cx("inline-flex h-11 items-center justify-center gap-1.5 rounded border border-brand bg-brand px-4 py-2 text-sm font-semibold text-surface transition-all duration-150 hover:bg-brand-dark active:scale-[0.99]", fullWidth && "w-full", className)}>
      {dict.common.addToOrder}
    </button>
  );
}
