"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/AdminUI";
import { toggleProductStatusAction, deleteProductAction } from "./actions";
import type { Product } from "@/lib/cms/types";

export function ProductRowActions({ product }: { product: Product }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    await toggleProductStatusAction(product.id, product.status === "published" ? "draft" : "published");
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        className="text-sm font-medium text-ink-soft hover:text-ink disabled:opacity-60"
      >
        {product.status === "published" ? "Unpublish" : "Publish"}
      </button>
      <ConfirmButton
        confirmLabel="Delete product?"
        onConfirm={async () => {
          await deleteProductAction(product.id);
          router.refresh();
        }}
      />
    </div>
  );
}
