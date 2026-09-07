"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ConfirmButton } from "@/components/admin/AdminUI";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./actions";
import type { Category } from "@/lib/cms/types";

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameFr, setNewNameFr] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!newNameEn.trim() || !newNameFr.trim()) return;
    setAdding(true);
    const slug = newNameEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const created = await createCategoryAction({
      slug,
      name_en: newNameEn.trim(),
      name_fr: newNameFr.trim(),
      sort_order: categories.length + 1,
      is_active: true,
    });
    setCategories((c) => [...c, created]);
    setNewNameEn("");
    setNewNameFr("");
    setAdding(false);
  }

  async function handleUpdate(id: string, patch: Partial<Category>) {
    setCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, ...patch } : cat)));
    await updateCategoryAction(id, patch);
  }

  async function handleDelete(id: string) {
    await deleteCategoryAction(id);
    setCategories((c) => c.filter((cat) => cat.id !== id));
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <ul className="divide-y divide-border">
        {categories.map((category) => (
          <li key={category.id} className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
            <input
              defaultValue={category.name_en}
              onBlur={(e) => handleUpdate(category.id, { name_en: e.target.value })}
              className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
              placeholder="English name"
            />
            <input
              defaultValue={category.name_fr}
              onBlur={(e) => handleUpdate(category.id, { name_fr: e.target.value })}
              className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
              placeholder="French name"
            />
            <label className="flex items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                checked={category.is_active}
                onChange={(e) => handleUpdate(category.id, { is_active: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              Visible
            </label>
            <ConfirmButton confirmLabel="Delete category?" onConfirm={() => handleDelete(category.id)} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-border p-3 sm:p-4">
        <input
          value={newNameEn}
          onChange={(e) => setNewNameEn(e.target.value)}
          placeholder="English name"
          className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
        />
        <input
          value={newNameFr}
          onChange={(e) => setNewNameFr(e.target.value)}
          placeholder="French name"
          className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="inline-flex items-center gap-1.5 rounded bg-brand px-3 py-2 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60"
        >
          <Plus size={15} /> Add
        </button>
      </div>
    </div>
  );
}
