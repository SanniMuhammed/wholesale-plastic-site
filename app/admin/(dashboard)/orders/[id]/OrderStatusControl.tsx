"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "../actions";
import type { OrderStatus } from "@/lib/cms/types";

const STATUSES: OrderStatus[] = ["new", "contacted", "quoted", "confirmed", "completed", "cancelled"];

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: OrderStatus) {
    setStatus(next);
    setSaving(true);
    await updateOrderStatusAction(orderId, next);
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={saving}
          onClick={() => handleChange(s)}
          className={`rounded-full px-3 py-2 text-sm font-medium capitalize transition-colors disabled:opacity-60 ${
            status === s
              ? "bg-ink text-surface"
              : "border border-border text-ink-soft hover:border-ink"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
