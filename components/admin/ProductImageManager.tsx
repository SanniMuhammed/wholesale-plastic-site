"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Star, Trash2, Upload } from "lucide-react";
import { buildProductImageUrl } from "@/lib/cms/productImages";
import {
  uploadProductImageAction,
  setMainProductImageAction,
  reorderProductImagesAction,
  deleteProductImageAction,
} from "@/app/admin/(dashboard)/products/actions";
import type { ProductImage } from "@/lib/cms/types";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function ProductImageManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(undefined);
    try {
      for (const file of Array.from(files)) {
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Use JPG, PNG, or WebP images only.");
        if (file.size > MAX_IMAGE_BYTES) throw new Error("Each image must be 8 MB or smaller.");
        const formData = new FormData();
        formData.set("file", file);
        await uploadProductImageAction(productId, formData);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderProductImagesAction(productId, next.map((i) => i.id));
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Photos</h2>
          <p className="mt-1 text-xs text-muted">JPG, PNG or WebP · max 8 MB each</p>
        </div>
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex min-h-10 items-center gap-1.5 rounded border border-border px-3 py-2 text-sm font-medium text-ink-soft hover:border-ink disabled:opacity-60">
          <Upload size={15} /> {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleFilesSelected(e.target.files)} />
      </div>

      {error && <p role="alert" className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {images.length === 0 ? (
        <p className="rounded border border-dashed border-border p-6 text-center text-sm text-muted">No photos yet. Upload at least one before publishing.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div key={image.id} className="group relative overflow-hidden rounded border border-border">
              <img src={buildProductImageUrl(image.storage_path)} alt="" className="aspect-square w-full object-cover" />
              {image.is_main && <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-surface"><Star size={11} fill="currentColor" /> Main</span>}
              <div className="flex items-center justify-between gap-1 bg-surface px-1.5 py-1.5">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || isPending} aria-label="Move earlier" className="rounded p-2 text-ink-soft hover:bg-background disabled:opacity-30"><ChevronLeft size={16} /></button>
                {!image.is_main && <button type="button" onClick={async () => { await setMainProductImageAction(productId, image.id); router.refresh(); }} className="rounded p-2 text-ink-soft hover:bg-background" aria-label="Set as main photo"><Star size={16} /></button>}
                <button type="button" onClick={async () => { try { await deleteProductImageAction(productId, image.id); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "Delete failed."); } }} className="rounded p-2 text-ink-soft hover:bg-red-50 hover:text-red-700" aria-label="Delete photo"><Trash2 size={16} /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1 || isPending} aria-label="Move later" className="rounded p-2 text-ink-soft hover:bg-background disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
