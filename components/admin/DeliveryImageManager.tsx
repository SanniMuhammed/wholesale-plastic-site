"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Image as ImageIcon, Monitor, Smartphone, Truck, X } from "lucide-react";
import type { DeliveryContent } from "@/lib/cms/types";
import { removeDeliveryImageAction, uploadDeliveryImageAction } from "@/app/admin/(dashboard)/content/actions";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const IMAGE_BUCKET = "product-images";

function imageUrl(path: string) {
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

type Slot = "hero" | "nigeria" | "truck";

const SLOTS: Array<{ slot: Slot; label: string; hint: string; icon: ReactNode }> = [
  { slot: "hero", label: "Hero image", hint: "Recommended: wide landscape image", icon: <Monitor size={18} /> },
  { slot: "nigeria", label: "Nigeria deliveries image", hint: "Used above the Nigeria Deliveries card", icon: <Truck size={18} /> },
  { slot: "truck", label: "Delivery support image", hint: "Used beside the delivery support CTA", icon: <Smartphone size={18} /> },
];

export function DeliveryImageManager({ initialContent }: { initialContent: DeliveryContent }) {
  const [content, setContent] = useState(initialContent);
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-sm font-medium text-ink">Delivery page images</h2>
        <p className="mt-1 text-xs leading-5 text-muted">Replace any of the delivery-page photos without changing the approved page layout. Uploads are stored in the CMS and appear on the public delivery page.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {SLOTS.map(({ slot, label, hint, icon }) => (
          <DeliveryImageSlot
            key={slot}
            slot={slot}
            label={label}
            hint={hint}
            icon={icon}
            path={content[`${slot}_image_path` as keyof DeliveryContent] as string | null}
            onChange={(patch) => setContent((current) => ({ ...current, ...patch }))}
          />
        ))}
      </div>
    </div>
  );
}

function DeliveryImageSlot({ slot, label, hint, icon, path, onChange }: { slot: Slot; label: string; hint: string; icon: ReactNode; path: string | null; onChange: (patch: Partial<DeliveryContent>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setBusy(true); setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("slot", slot);
      const updated = await uploadDeliveryImageAction(fd);
      onChange({
        hero_image_path: updated.hero_image_path,
        nigeria_image_path: updated.nigeria_image_path,
        truck_image_path: updated.truck_image_path,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed — try again");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(event: MouseEvent) {
    event.stopPropagation();
    setBusy(true); setError(null);
    try {
      const updated = await removeDeliveryImageAction(slot);
      onChange({
        hero_image_path: updated.hero_image_path,
        nigeria_image_path: updated.nigeria_image_path,
        truck_image_path: updated.truck_image_path,
      });
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Remove failed — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex items-start gap-2 text-ink">{icon}<div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted">{hint}</div></div></div>
      <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="group relative block aspect-[16/9] w-full overflow-hidden rounded-md border border-border bg-background text-left disabled:opacity-60">
        {path ? <>
          <img src={imageUrl(path)} alt={`${label} preview`} className="h-full w-full object-cover" />
          <span role="button" aria-label={`Remove ${label}`} onClick={handleRemove} className="absolute right-2 top-2 rounded-full bg-ink/75 p-2 text-surface opacity-0 transition-opacity group-hover:opacity-100"><X size={16} /></span>
          <span className="absolute bottom-2 left-2 rounded bg-ink/75 px-2 py-1 text-xs text-surface">{busy ? "Working…" : "Tap to replace"}</span>
        </> : <span className="flex h-full flex-col items-center justify-center gap-2 text-muted"><ImageIcon size={26} /><span className="text-sm font-medium text-ink">Add image</span><span className="text-xs">Tap to choose a photo</span></span>}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {busy && !error && <p className="mt-2 text-xs text-muted">Uploading…</p>}
    </div>
  );
}
