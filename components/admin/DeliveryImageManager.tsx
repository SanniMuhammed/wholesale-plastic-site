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

type Slot = "hero" | "nigeria" | "truck" | "step_1" | "step_2" | "step_3" | "step_4" | "step_5";

type SlotDefinition = { slot: Slot; label: string; hint: string; icon: ReactNode };

const PAGE_SLOTS: SlotDefinition[] = [
  { slot: "hero", label: "Hero image", hint: "Used in the top How Delivery Works section", icon: <Monitor size={18} /> },
  { slot: "nigeria", label: "Nigeria deliveries image", hint: "Used above the Nigeria Deliveries card", icon: <Truck size={18} /> },
  { slot: "truck", label: "Delivery support image", hint: "Used beside the delivery support CTA", icon: <Smartphone size={18} /> },
];

const PROCESS_SLOTS: SlotDefinition[] = [
  { slot: "step_1", label: "Step 01 image", hint: "Tell us your destination", icon: <ImageIcon size={18} /> },
  { slot: "step_2", label: "Step 02 image", hint: "We confirm your order", icon: <ImageIcon size={18} /> },
  { slot: "step_3", label: "Step 03 image", hint: "We arrange logistics", icon: <ImageIcon size={18} /> },
  { slot: "step_4", label: "Step 04 image", hint: "You receive delivery details", icon: <ImageIcon size={18} /> },
  { slot: "step_5", label: "Step 05 image", hint: "Your order is delivered", icon: <ImageIcon size={18} /> },
];

export function DeliveryImageManager({ initialContent }: { initialContent: DeliveryContent }) {
  const [content, setContent] = useState(initialContent);
  const slots = [...PAGE_SLOTS, ...PROCESS_SLOTS];

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-sm font-medium text-ink">Delivery page images</h2>
        <p className="mt-1 text-xs leading-5 text-muted">Every photo on the delivery page can be replaced or removed here. Process images are optional; when empty, the approved icon design remains visible.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PAGE_SLOTS.map((definition) => (
          <DeliveryImageSlot key={definition.slot} definition={definition} path={content[`${definition.slot}_image_path` as keyof DeliveryContent] as string | null} onChange={(patch) => setContent((current) => ({ ...current, ...patch }))} />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-ink">How delivery works — process images</h3>
          <p className="mt-1 text-xs leading-5 text-muted">Add a photo to any step if you want a visual instead of the default icon. Removing the photo restores the original icon automatically.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_SLOTS.map((definition) => (
            <DeliveryImageSlot key={definition.slot} definition={definition} path={content[`${definition.slot}_image_path` as keyof DeliveryContent] as string | null} onChange={(patch) => setContent((current) => ({ ...current, ...patch }))} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryImageSlot({ definition, path, onChange }: { definition: SlotDefinition; path: string | null; onChange: (patch: Partial<DeliveryContent>) => void }) {
  const { slot, label, hint, icon } = definition;
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
        step_1_image_path: updated.step_1_image_path,
        step_2_image_path: updated.step_2_image_path,
        step_3_image_path: updated.step_3_image_path,
        step_4_image_path: updated.step_4_image_path,
        step_5_image_path: updated.step_5_image_path,
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
        step_1_image_path: updated.step_1_image_path,
        step_2_image_path: updated.step_2_image_path,
        step_3_image_path: updated.step_3_image_path,
        step_4_image_path: updated.step_4_image_path,
        step_5_image_path: updated.step_5_image_path,
      });
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Remove failed — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex items-start gap-2 text-ink">
        {icon}
        <div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted">{hint}</div></div>
      </div>
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
