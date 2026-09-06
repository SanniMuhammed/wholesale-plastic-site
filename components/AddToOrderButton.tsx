"use client";

import { useState } from "react";
import { useOrder } from "@/components/OrderProvider";
import type { Dictionary } from "@/lib/getDictionary";
import { cx } from "@/lib/utils";

interface AddToOrderButtonProps {
  slug: string;
  dict: Dictionary;
  className?: string;
  fullWidth?: boolean;
}

export function AddToOrderButton({ slug, dict, className, fullWidth }: AddToOrderButtonProps) {
  const { addItem } = useOrder();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cx(
        "inline-flex items-center justify-center rounded border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface",
        fullWidth && "w-full",
        className
      )}
    >
      {added ? dict.common.addedToOrder : dict.common.addToOrder}
    </button>
  );
}
