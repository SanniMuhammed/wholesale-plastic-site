"use client";
import { useState, type FormEvent } from "react";
import type { SiteSettings } from "@/lib/cms/site-settings";
import { SaveStatusPill, type SaveState } from "@/components/admin/AdminUI";
import { updateSiteSettingsAction } from "@/app/admin/(dashboard)/content/site-settings/actions";

export function SiteSettingsForm({ initial }: { initial: SiteSettings }) {
  const [value,setValue]=useState(JSON.stringify(initial,null,2));
  const [state,setState]=useState<SaveState>("idle");
  async function submit(e:FormEvent){e.preventDefault();setState("saving");try{const parsed=JSON.parse(value);await updateSiteSettingsAction(parsed);setState("saved");}catch{setState("error");}}
  return <form onSubmit={submit} className="grid gap-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
    <div><h2 className="font-display text-xl font-semibold text-ink">Website controls</h2><p className="mt-1 text-sm leading-6 text-muted">Advanced site-wide settings. Navigation, footer copy and SEO are stored centrally so public pages use the saved values.</p></div>
    <textarea value={value} onChange={e=>setValue(e.target.value)} rows={28} spellCheck={false} className="w-full rounded border border-border bg-background px-3 py-3 font-mono text-xs leading-5 text-ink focus:border-brand focus:outline-none" />
    <div className="flex items-center justify-between"><SaveStatusPill state={state}/><button disabled={state==='saving'} className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">Save website settings</button></div>
  </form>;
}
