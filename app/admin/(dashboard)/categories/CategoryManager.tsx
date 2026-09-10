"use client";

import { useRef, useState, type MouseEvent } from "react";
import { Plus, Image as ImageIcon, X, ChevronUp, ChevronDown } from "lucide-react";
import { ConfirmButton } from "@/components/admin/AdminUI";
import { buildCategoryImageUrl } from "@/lib/cms/category-images";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction, uploadCategoryImageAction, removeCategoryImageAction } from "./actions";
import type { Category } from "@/lib/cms/types";

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameFr, setNewNameFr] = useState("");
  const [adding, setAdding] = useState(false);
  const [moving, setMoving] = useState<string | null>(null);

  async function handleAdd() {
    if (!newNameEn.trim() || !newNameFr.trim()) return;
    setAdding(true);
    try {
      const slug = newNameEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      const created = await createCategoryAction({ slug, name_en: newNameEn.trim(), name_fr: newNameFr.trim(), sort_order: categories.length + 1, is_active: true, cover_image_path: null });
      setCategories((c) => [...c, created]); setNewNameEn(""); setNewNameFr("");
    } finally { setAdding(false); }
  }

  async function handleUpdate(id: string, patch: Partial<Category>) {
    setCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, ...patch } : cat)));
    await updateCategoryAction(id, patch);
  }

  async function move(id: string, direction: -1 | 1) {
    const index = categories.findIndex((c) => c.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= categories.length || moving) return;
    setMoving(id);
    const current = categories[index]; const other = categories[target];
    const next = [...categories]; next[index] = { ...other, sort_order: current.sort_order }; next[target] = { ...current, sort_order: other.sort_order };
    setCategories(next);
    try { await Promise.all([updateCategoryAction(current.id, { sort_order: other.sort_order }), updateCategoryAction(other.id, { sort_order: current.sort_order })]); }
    catch { setCategories(categories); }
    finally { setMoving(null); }
  }

  async function handleDelete(id: string) {
    await deleteCategoryAction(id);
    setCategories((c) => c.filter((cat) => cat.id !== id));
  }

  return <div className="rounded-lg border border-border bg-surface">
    <div className="border-b border-border bg-background px-4 py-3 text-xs text-muted">The order below is the order customers see. Use the arrows to move a category up or down.</div>
    <ul className="divide-y divide-border">
      {categories.map((category, index) => <li key={category.id} className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
        <div className="flex shrink-0 flex-col gap-1">
          <button type="button" title="Move up" aria-label={`Move ${category.name_en} up`} disabled={index === 0 || Boolean(moving)} onClick={() => move(category.id, -1)} className="rounded border border-border p-1 text-muted hover:text-ink disabled:opacity-30"><ChevronUp size={14} /></button>
          <button type="button" title="Move down" aria-label={`Move ${category.name_en} down`} disabled={index === categories.length - 1 || Boolean(moving)} onClick={() => move(category.id, 1)} className="rounded border border-border p-1 text-muted hover:text-ink disabled:opacity-30"><ChevronDown size={14} /></button>
        </div>
        <CategoryThumb category={category} onChange={(patch) => setCategories((c) => c.map((cat) => (cat.id === category.id ? { ...cat, ...patch } : cat)))} />
        <input defaultValue={category.name_en} onBlur={(e) => handleUpdate(category.id, { name_en: e.target.value })} className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink" placeholder="English name" />
        <input defaultValue={category.name_fr} onBlur={(e) => handleUpdate(category.id, { name_fr: e.target.value })} className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink" placeholder="French name" />
        <label className="flex items-center gap-1.5 text-xs text-muted"><input type="checkbox" checked={category.is_active} onChange={(e) => handleUpdate(category.id, { is_active: e.target.checked })} className="h-4 w-4 rounded border-border" />Visible</label>
        <ConfirmButton confirmLabel="Delete category?" onConfirm={() => handleDelete(category.id)} />
      </li>)}
    </ul>
    <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-border p-3 sm:p-4">
      <input value={newNameEn} onChange={(e) => setNewNameEn(e.target.value)} placeholder="English name" className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink" />
      <input value={newNameFr} onChange={(e) => setNewNameFr(e.target.value)} placeholder="French name" className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink" />
      <button type="button" onClick={handleAdd} disabled={adding} className="inline-flex items-center gap-1.5 rounded bg-brand px-3 py-2 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60"><Plus size={15} /> Add</button>
    </div>
  </div>;
}

function CategoryThumb({ category, onChange }: { category: Category; onChange: (patch: Partial<Category>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "saved" | "removing" | "error">("idle");
  function showSaved() { setStatus("saved"); window.setTimeout(() => setStatus("idle"), 2200); }
  async function handleFile(file: File | null) { if (!file) return; setBusy(true); setStatus("uploading"); try { const formData = new FormData(); formData.set("file", file); const updated = await uploadCategoryImageAction(category.id, formData); onChange({ cover_image_path: updated.cover_image_path }); showSaved(); } catch { setStatus("error"); } finally { setBusy(false); if (fileInputRef.current) fileInputRef.current.value = ""; } }
  async function handleRemove(e: MouseEvent) { e.stopPropagation(); setBusy(true); setStatus("removing"); try { await removeCategoryImageAction(category.id); onChange({ cover_image_path: null }); showSaved(); } catch { setStatus("error"); } finally { setBusy(false); } }
  const statusLabel = { idle: null, uploading: "Uploading…", saved: "Saved ✓", removing: "Removing…", error: "Failed — try again" }[status];
  return <div className="flex shrink-0 flex-col items-center gap-1">
    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy} title={category.cover_image_path ? "Replace photo" : "Upload a photo"} className="group relative h-12 w-12 overflow-hidden rounded border border-border bg-background disabled:opacity-60">
      {category.cover_image_path ? <><img src={buildCategoryImageUrl(category.cover_image_path)} alt="" className="h-full w-full object-cover" /><span role="button" onClick={handleRemove} aria-label="Remove photo" className="absolute right-0.5 top-0.5 rounded-full bg-ink/70 p-0.5 text-surface opacity-0 transition-opacity group-hover:opacity-100"><X size={11} /></span></> : <span className="flex h-full w-full items-center justify-center text-border"><ImageIcon size={18} /></span>}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
    </button>
    {statusLabel && <span className={`whitespace-nowrap text-[10px] ${status === "error" ? "text-red-600" : "text-muted"}`}>{statusLabel}</span>}
  </div>;
}
