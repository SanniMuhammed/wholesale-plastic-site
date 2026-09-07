"use client";

import { useState, type ReactNode } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export type SaveState = "idle" | "saving" | "saved" | "error";

export function SaveStatusPill({ state, errorMessage }: { state: SaveState; errorMessage?: string }) {
  if (state === "idle") return null;
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
        <Loader2 size={14} className="animate-spin" /> Saving...
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-brand-dark">
        <Check size={14} /> Saved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-red-700">
      <AlertCircle size={14} /> {errorMessage || "Something went wrong. Try again."}
    </span>
  );
}

/** A button that asks "Delete this? Cancel / Delete" inline before calling
 *  onConfirm, per the brief's rule that destructive actions always confirm
 *  first. Deliberately not a browser confirm() dialog -- an inline row
 *  reads better on a phone and keeps focus in place. */
export function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Delete this?",
  className = "",
}: {
  onConfirm: () => void | Promise<void>;
  label?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (armed) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-muted">{confirmLabel}</span>
        <button
          type="button"
          onClick={() => setArmed(false)}
          className="rounded px-2 py-1 font-medium text-ink-soft hover:bg-border/60"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onConfirm();
          }}
          className="rounded bg-red-700 px-2 py-1 font-medium text-white hover:bg-red-800 disabled:opacity-60"
        >
          {busy ? "Deleting..." : "Delete"}
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setArmed(true)}
      className={className || "text-sm font-medium text-red-700 hover:text-red-800"}
    >
      {label}
    </button>
  );
}

const ORDER_STATUS_STYLES: Record<string, string> = {
  new: "bg-ochre-light text-ochre",
  contacted: "bg-accent-light text-accent",
  quoted: "bg-brand-light text-brand-dark",
  confirmed: "bg-brand-light text-brand-dark",
  completed: "bg-border text-ink-soft",
  cancelled: "bg-clay-light text-clay",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        ORDER_STATUS_STYLES[status] || "bg-border text-ink-soft"
      }`}
    >
      {status}
    </span>
  );
}
