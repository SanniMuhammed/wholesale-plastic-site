"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cx } from "@/lib/utils";

export interface ToastPayload {
  id: number;
  productName: string;
}

/**
 * A short-lived "added to order" confirmation, independent of the
 * fly-to-cart flourish. The flying dot is easy to miss if your eyes
 * aren't already on the cart icon; this always appears in the same,
 * predictable spot so there's no ambiguity about whether the tap
 * registered.
 */
export function AddedToast({ toast, label }: { toast: ToastPayload | null; label: string }) {
  const [rendered, setRendered] = useState<ToastPayload | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setRendered(toast);
      setVisible(false);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = window.setTimeout(() => setRendered(null), 300);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  if (!rendered) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[65] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end"
    >
      <div
        className={cx(
          "flex max-w-xs items-center gap-3 rounded-lg border border-ink/10 bg-ink px-4 py-3 text-surface shadow-lifted transition-all duration-300 ease-out",
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand">
          <Check size={14} strokeWidth={3} className="text-surface" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-tight">{rendered.productName}</p>
          <p className="text-xs leading-tight text-surface/70">{label}</p>
        </div>
      </div>
    </div>
  );
}
