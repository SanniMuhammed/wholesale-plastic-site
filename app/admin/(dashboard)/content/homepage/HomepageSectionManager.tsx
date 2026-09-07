"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { updateHomepageSectionAction } from "../actions";
import type { HomepageSection } from "@/lib/cms/types";

export function HomepageSectionManager({
  sections,
  labels,
}: {
  sections: HomepageSection[];
  labels: Record<string, string>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid gap-3">
      {sections.map((section) => (
        <SectionRow
          key={section.id}
          section={section}
          label={labels[section.key] || section.key}
          open={openId === section.id}
          onToggle={() => setOpenId(openId === section.id ? null : section.id)}
        />
      ))}
    </div>
  );
}

function SectionRow({
  section,
  label,
  open,
  onToggle,
}: {
  section: HomepageSection;
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  const [form, setForm] = useState({
    title_en: section.title_en,
    title_fr: section.title_fr,
    body_en: section.body_en,
    body_fr: section.body_fr,
    is_visible: section.is_visible,
  });
  const [saving, setSaving] = useState(false);

  async function save(patch: Partial<typeof form>) {
    const next = { ...form, ...patch };
    setForm(next);
    setSaving(true);
    await updateHomepageSectionAction(section.id, next);
    setSaving(false);
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="flex items-center gap-2">
          {!form.is_visible && (
            <span className="rounded-full bg-border px-2 py-0.5 text-[11px] text-ink-soft">Hidden</span>
          )}
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="grid gap-4 border-t border-border p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink-soft">Title (English)</span>
              <input
                defaultValue={form.title_en}
                onBlur={(e) => save({ title_en: e.target.value })}
                className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink-soft">Title (French)</span>
              <input
                defaultValue={form.title_fr}
                onBlur={(e) => save({ title_fr: e.target.value })}
                className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink-soft">Body (English)</span>
              <textarea
                rows={3}
                defaultValue={form.body_en}
                onBlur={(e) => save({ body_en: e.target.value })}
                className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink-soft">Body (French)</span>
              <textarea
                rows={3}
                defaultValue={form.body_fr}
                onBlur={(e) => save({ body_fr: e.target.value })}
                className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink"
              />
            </label>
          </div>
          <label className="flex items-center gap-1.5 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.is_visible}
              onChange={(e) => save({ is_visible: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            Visible on the homepage {saving && <span className="text-xs text-muted">(saving...)</span>}
          </label>
        </div>
      )}
    </div>
  );
}
