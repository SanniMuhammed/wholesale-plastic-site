"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
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
  const { addItem } = useOrder();
  const { flyToCart, notifyAdded } = useCartUI();
  const [added, setAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    addItem(slug, 1);
    flyToCart(buttonRef.current);
    notifyAdded(productName);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded border border-ink px-4 py-2 text-sm font-medium text-ink transition-all duration-150 hover:bg-ink hover:text-surface active:scale-95",
        added && "border-brand bg-brand text-surface hover:bg-brand-dark",
        fullWidth && "w-full",
        className
      )}
    >
      {added && <Check size={14} strokeWidth={2.5} />}
      {added ? dict.common.addedToOrder : dict.common.addToOrder}
    </button>
  );
}
