"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ChevronDown, ChevronUp, Image as ImageIcon, X } from "lucide-react";
import { updateHomepageSectionAction, uploadHomepageHeroImageAction, removeHomepageHeroImageAction } from "../actions";
import type { HomepageSection } from "@/lib/cms/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const IMAGE_BUCKET = "product-images";

function imageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

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
    try {
      await updateHomepageSectionAction(section.id, next);
    } finally {
      setSaving(false);
    }
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
          {section.key === "hero" && (
            <HeroImageControl
              imagePath={section.hero_image_path}
              onChange={(hero_image_path) => {
                // Keep the local preview in sync after an upload/remove.
                section.hero_image_path = hero_image_path;
              }}
            />
          )}

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

function HeroImageControl({
  imagePath,
  onChange,
}: {
  imagePath: string | null;
  onChange: (path: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(imagePath);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const updated = await uploadHomepageHeroImageAction(formData);
      setPath(updated.hero_image_path);
      onChange(updated.hero_image_path);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    setBusy(true);
    try {
      await removeHomepageHeroImageAction();
      setPath(null);
      onChange(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink-soft">Hero image</span>
        <span className="text-xs text-muted">Optional — illustrated hero remains the fallback</span>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="group relative block aspect-[16/7] w-full overflow-hidden rounded-lg border border-border bg-background text-left disabled:opacity-60"
      >
        {path ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl(path)} alt="Homepage hero" className="h-full w-full object-cover" />
            <span
              role="button"
              aria-label="Remove hero image"
              onClick={handleRemove}
              className="absolute right-3 top-3 rounded-full bg-ink/75 p-2 text-surface opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={16} />
            </span>
            <span className="absolute bottom-3 left-3 rounded bg-ink/75 px-2 py-1 text-xs text-surface">
              Tap to replace
            </span>
          </>
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-2 text-muted">
            <ImageIcon size={28} />
            <span className="text-sm font-medium text-ink">Add hero photo</span>
            <span className="text-xs">Recommended: wide product/business photography</span>
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </button>
    </div>
  );
}
