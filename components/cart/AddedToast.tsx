"use client";

import { Check } from "lucide-react";

export interface ToastPayload {
  id: number;
  productName: string;
}

export function AddedToast({ toast, label }: { toast: ToastPayload | null; label: string }) {
  if (!toast) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[65] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end"
    >
      <div
        key={toast.id}
        className="flex max-w-xs animate-[toast-in_300ms_ease-out] items-center gap-3 rounded-lg border border-ink/10 bg-ink px-4 py-3 text-surface shadow-lifted"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand">
          <Check size={14} strokeWidth={3} className="text-surface" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-tight">{toast.productName}</p>
          <p className="text-xs leading-tight text-surface/70">{label}</p>
        </div>
      </div>
    </div>
  );
}
