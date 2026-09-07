"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ConfirmButton } from "@/components/admin/AdminUI";
import { createColorAction, updateColorAction, deleteColorAction } from "./actions";
import type { Color } from "@/lib/cms/types";

export function ColorManager({ initialColors }: { initialColors: Color[] }) {
  const [colors, setColors] = useState(initialColors);
  const [draft, setDraft] = useState({ label_en: "", label_fr: "", hex: "#1C4632" });
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!draft.label_en.trim() || !draft.label_fr.trim()) return;
    setAdding(true);
    const slug = draft.label_en.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const created = await createColorAction({
      slug,
      label_en: draft.label_en.trim(),
      label_fr: draft.label_fr.trim(),
      hex: draft.hex,
      sort_order: colors.length + 1,
      is_active: true,
    });
    setColors((c) => [...c, created]);
    setDraft({ label_en: "", label_fr: "", hex: "#1C4632" });
    setAdding(false);
  }

  async function handleUpdate(id: string, patch: Partial<Color>) {
    setColors((c) => c.map((color) => (color.id === id ? { ...color, ...patch } : color)));
    await updateColorAction(id, patch);
  }

  async function handleDelete(id: string) {
    await deleteColorAction(id);
    setColors((c) => c.filter((color) => color.id !== id));
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <ul className="divide-y divide-border">
        {colors.map((color) => (
          <li key={color.id} className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => handleUpdate(color.id, { hex: e.target.value })}
              className="h-9 w-9 shrink-0 cursor-pointer rounded border border-border"
            />
            <input
              defaultValue={color.label_en}
              onBlur={(e) => handleUpdate(color.id, { label_en: e.target.value })}
              className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
              placeholder="English label"
            />
            <input
              defaultValue={color.label_fr}
              onBlur={(e) => handleUpdate(color.id, { label_fr: e.target.value })}
              className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
              placeholder="French label"
            />
            <label className="flex items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                checked={color.is_active}
                onChange={(e) => handleUpdate(color.id, { is_active: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              Visible
            </label>
            <ConfirmButton confirmLabel="Delete colour?" onConfirm={() => handleDelete(color.id)} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-border p-3 sm:p-4">
        <input
          type="color"
          value={draft.hex}
          onChange={(e) => setDraft((d) => ({ ...d, hex: e.target.value }))}
          className="h-9 w-9 shrink-0 cursor-pointer rounded border border-border"
        />
        <input
          value={draft.label_en}
          onChange={(e) => setDraft((d) => ({ ...d, label_en: e.target.value }))}
          placeholder="English label"
          className="min-w-0 flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
        />
        <input
          value={draft.label_fr}
          onChange={(e) => setDraft((d) => ({ ...d, label_fr: e.target.value }))}
          placeholder="French label"
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
