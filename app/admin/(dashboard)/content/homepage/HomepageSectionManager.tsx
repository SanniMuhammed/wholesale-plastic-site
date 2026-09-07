"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ChevronDown, ChevronUp, Image as ImageIcon, X, Monitor, Smartphone } from "lucide-react";
import { updateHomepageSectionAction, uploadHomepageHeroImageAction, uploadHomepageMobileHeroImageAction, removeHomepageHeroImageAction, removeHomepageMobileHeroImageAction } from "../actions";
import type { HomepageSection } from "@/lib/cms/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const IMAGE_BUCKET = "product-images";
function imageUrl(path: string) { return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`; }

export function HomepageSectionManager({ sections, labels }: { sections: HomepageSection[]; labels: Record<string, string> }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return <div className="grid gap-3">{sections.map((section) => <SectionRow key={section.id} section={section} label={labels[section.key] || section.key} open={openId === section.id} onToggle={() => setOpenId(openId === section.id ? null : section.id)} />)}</div>;
}

function SectionRow({ section, label, open, onToggle }: { section: HomepageSection; label: string; open: boolean; onToggle: () => void }) {
  const [form, setForm] = useState({ title_en: section.title_en, title_fr: section.title_fr, body_en: section.body_en, body_fr: section.body_fr, is_visible: section.is_visible });
  const [saving, setSaving] = useState(false);
  async function save(patch: Partial<typeof form>) { const next = { ...form, ...patch }; setForm(next); setSaving(true); try { await updateHomepageSectionAction(section.id, next); } finally { setSaving(false); } }
  return <div className="rounded-lg border border-border bg-surface">
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-4 text-left"><span className="text-sm font-medium text-ink">{label}</span><span className="flex items-center gap-2">{!form.is_visible && <span className="rounded-full bg-border px-2 py-0.5 text-[11px] text-ink-soft">Hidden</span>}{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span></button>
    {open && <div className="grid gap-4 border-t border-border p-4">
      {section.key === "hero" && <ResponsiveHeroImageControl desktopPath={section.hero_image_path} mobilePath={section.hero_mobile_image_path} onChange={(desktop, mobile) => { section.hero_image_path = desktop; section.hero_mobile_image_path = mobile; }} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Title (English)</span><input defaultValue={form.title_en} onBlur={(e) => save({ title_en: e.target.value })} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink" /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Title (French)</span><input defaultValue={form.title_fr} onBlur={(e) => save({ title_fr: e.target.value })} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Body (English)</span><textarea rows={3} defaultValue={form.body_en} onBlur={(e) => save({ body_en: e.target.value })} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink" /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Body (French)</span><textarea rows={3} defaultValue={form.body_fr} onBlur={(e) => save({ body_fr: e.target.value })} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink" /></label>
      </div>
      <label className="flex items-center gap-1.5 text-sm text-ink-soft"><input type="checkbox" checked={form.is_visible} onChange={(e) => save({ is_visible: e.target.checked })} className="h-4 w-4 rounded border-border" />Visible on the homepage {saving && <span className="text-xs text-muted">(saving...)</span>}</label>
    </div>}
  </div>;
}

function ResponsiveHeroImageControl({ desktopPath, mobilePath, onChange }: { desktopPath: string | null; mobilePath: string | null; onChange: (desktop: string | null, mobile: string | null) => void }) {
  return <div className="grid gap-3">
    <div><div className="text-sm font-medium text-ink">Hero images</div><p className="text-xs text-muted">Use a wide desktop image and a dedicated mobile image. If mobile is empty, the desktop image is used automatically.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      <HeroSlot label="Desktop hero" hint="Recommended: 1920 × 720 (16:6)" icon={<Monitor size={18} />} path={desktopPath} onUpload={uploadHomepageHeroImageAction} onRemove={removeHomepageHeroImageAction} onChange={(p) => onChange(p, mobilePath)} />
      <HeroSlot label="Mobile hero" hint="Recommended: 1080 × 1920 (9:16)" icon={<Smartphone size={18} />} path={mobilePath} onUpload={uploadHomepageMobileHeroImageAction} onRemove={removeHomepageMobileHeroImageAction} onChange={(p) => onChange(desktopPath, p)} />
    </div>
  </div>;
}

function HeroSlot({ label, hint, icon, path, onUpload, onRemove, onChange }: { label: string; hint: string; icon: React.ReactNode; path: string | null; onUpload: (form: FormData) => Promise<HomepageSection>; onRemove: () => Promise<HomepageSection>; onChange: (path: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false); const [current, setCurrent] = useState(path);
  async function handleFile(file: File | null) { if (!file) return; setBusy(true); try { const fd = new FormData(); fd.set("file", file); const updated = await onUpload(fd); const next = label === "Desktop hero" ? updated.hero_image_path : updated.hero_mobile_image_path; setCurrent(next); onChange(next); } finally { setBusy(false); if (inputRef.current) inputRef.current.value = ""; } }
  async function handleRemove(e: MouseEvent) { e.stopPropagation(); setBusy(true); try { const updated = await onRemove(); const next = label === "Desktop hero" ? updated.hero_image_path : updated.hero_mobile_image_path; setCurrent(next); onChange(next); } finally { setBusy(false); } }
  return <div className="rounded-lg border border-border p-3">
    <div className="mb-2 flex items-start gap-2">{icon}<div><div className="text-sm font-medium text-ink">{label}</div><div className="text-xs text-muted">{hint}</div></div></div>
    <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="group relative block aspect-[16/7] w-full overflow-hidden rounded-md border border-border bg-background text-left disabled:opacity-60">
      {current ? <><img src={imageUrl(current)} alt={`${label} preview`} className="h-full w-full object-cover" /><span role="button" aria-label={`Remove ${label}`} onClick={handleRemove} className="absolute right-2 top-2 rounded-full bg-ink/75 p-2 text-surface opacity-0 transition-opacity group-hover:opacity-100"><X size={16} /></span><span className="absolute bottom-2 left-2 rounded bg-ink/75 px-2 py-1 text-xs text-surface">Tap to replace</span></> : <span className="flex h-full flex-col items-center justify-center gap-2 text-muted"><ImageIcon size={26} /><span className="text-sm font-medium text-ink">Add {label.toLowerCase()}</span><span className="text-xs">Tap to choose a photo</span></span>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
    </button>
  </div>;
}
