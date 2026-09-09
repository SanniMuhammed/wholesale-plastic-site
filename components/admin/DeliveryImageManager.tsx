"use client";

import { useRef, useState, type ReactNode } from "react";
import { Image as ImageIcon, Monitor, Smartphone, Truck, X } from "lucide-react";
import type { DeliveryContent } from "@/lib/cms/types";
import {
  removeDeliveryImageAction,
  uploadDeliveryImageAction,
} from "@/app/admin/(dashboard)/content/actions";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const IMAGE_BUCKET = "product-images";

type Slot =
  | "hero"
  | "nigeria"
  | "truck"
  | "step_1"
  | "step_2"
  | "step_3"
  | "step_4"
  | "step_5";

type SlotDefinition = {
  slot: Slot;
  label: string;
  hint: string;
  icon: ReactNode;
};

const PAGE_SLOTS: SlotDefinition[] = [
  {
    slot: "hero",
    label: "Hero image",
    hint: "Used in the top How Delivery Works section",
    icon: <Monitor size={18} />,
  },
  {
    slot: "nigeria",
    label: "Nigeria deliveries image",
    hint: "Used above the Nigeria Deliveries card",
    icon: <Truck size={18} />,
  },
  {
    slot: "truck",
    label: "Delivery support image",
    hint: "Used beside the delivery support CTA",
    icon: <Smartphone size={18} />,
  },
];

const PROCESS_SLOTS: SlotDefinition[] = [
  { slot: "step_1", label: "Step 01 image", hint: "Tell us your destination", icon: <ImageIcon size={18} /> },
  { slot: "step_2", label: "Step 02 image", hint: "We confirm your order", icon: <ImageIcon size={18} /> },
  { slot: "step_3", label: "Step 03 image", hint: "We arrange logistics", icon: <ImageIcon size={18} /> },
  { slot: "step_4", label: "Step 04 image", hint: "You receive delivery details", icon: <ImageIcon size={18} /> },
  { slot: "step_5", label: "Step 05 image", hint: "Your order is delivered", icon: <ImageIcon size={18} /> },
];

function getImageUrl(path: string) {
  if (
    path.startsWith("/") ||
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

function getSlotPath(content: DeliveryContent, slot: Slot) {
  switch (slot) {
    case "hero":
      return content.hero_image_path;
    case "nigeria":
      return content.nigeria_image_path;
    case "truck":
      return content.truck_image_path;
    case "step_1":
      return content.step_1_image_path;
    case "step_2":
      return content.step_2_image_path;
    case "step_3":
      return content.step_3_image_path;
    case "step_4":
      return content.step_4_image_path;
    case "step_5":
      return content.step_5_image_path;
  }
}

function updatedContent(content: DeliveryContent): Partial<DeliveryContent> {
  return {
    hero_image_path: content.hero_image_path,
    nigeria_image_path: content.nigeria_image_path,
    truck_image_path: content.truck_image_path,
    step_1_image_path: content.step_1_image_path,
    step_2_image_path: content.step_2_image_path,
    step_3_image_path: content.step_3_image_path,
    step_4_image_path: content.step_4_image_path,
    step_5_image_path: content.step_5_image_path,
  };
}

export function DeliveryImageManager({
  initialContent,
}: {
  initialContent: DeliveryContent;
}) {
  const [content, setContent] = useState(initialContent);

  function applyUpdate(next: DeliveryContent) {
    setContent((current) => ({ ...current, ...updatedContent(next) }));
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-sm font-medium text-ink">Delivery page images</h2>
        <p className="mt-1 text-xs leading-5 text-muted">
          Replace or remove any photo used by the delivery page. Process images
          are optional; an empty slot uses the approved icon design.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PAGE_SLOTS.map((definition) => (
          <DeliveryImageSlot
            key={definition.slot}
            definition={definition}
            path={getSlotPath(content, definition.slot)}
            onChange={applyUpdate}
          />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-ink">
            How delivery works — process images
          </h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            Add a photo to any step to replace its default icon. Removing the
            photo restores the original icon.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_SLOTS.map((definition) => (
            <DeliveryImageSlot
              key={definition.slot}
              definition={definition}
              path={getSlotPath(content, definition.slot)}
              onChange={applyUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryImageSlot({
  definition,
  path,
  onChange,
}: {
  definition: SlotDefinition;
  path: string | null;
  onChange: (content: DeliveryContent) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("slot", definition.slot);

      const next = await uploadDeliveryImageAction(formData);
      onChange(next);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed — try again",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleRemove() {
    setBusy(true);
    setError(null);

    try {
      const next = await removeDeliveryImageAction(definition.slot);
      onChange(next);
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Remove failed — try again",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex items-start gap-2 text-ink">
        {definition.icon}
        <div>
          <div className="text-sm font-medium">{definition.label}</div>
          <div className="text-xs text-muted">{definition.hint}</div>
        </div>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-background">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="group h-full w-full text-left disabled:opacity-60"
        >
          {path ? (
            <>
              <img
                src={getImageUrl(path)}
                alt={`${definition.label} preview`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-ink/75 px-2 py-1 text-xs text-surface">
                {busy ? "Working…" : "Tap to replace"}
              </span>
            </>
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 text-muted">
              <ImageIcon size={26} />
              <span className="text-sm font-medium text-ink">Add image</span>
              <span className="text-xs">Tap to choose a photo</span>
            </span>
          )}
        </button>

        {path && (
          <button
            type="button"
            disabled={busy}
            aria-label={`Remove ${definition.label}`}
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-ink/75 p-2 text-surface transition-opacity hover:bg-ink disabled:opacity-50"
          >
            <X size={16} />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            handleFile(event.target.files?.[0] ?? null)
          }
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {busy && !error && (
        <p className="mt-2 text-xs text-muted">Uploading…</p>
      )}
    </div>
  );
}
