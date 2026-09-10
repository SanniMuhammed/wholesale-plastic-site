"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { SaveStatusPill, type SaveState } from "@/components/admin/AdminUI";
import { updateCompanySettingsAction } from "../actions";
import type { CompanySettings } from "@/lib/cms/types";

export function CompanySettingsForm({ settings }: { settings: CompanySettings }) {
  const [form, setForm] = useState({
    company_name: settings.company_name,
    email: settings.email,
    phone: settings.phone,
    whatsapp_number: settings.whatsapp_number,
    address: settings.address,
    countries_served: settings.countries_served.join(", "),
    business_hours_en: settings.business_hours_en,
    business_hours_fr: settings.business_hours_fr,
    facebook: settings.social_links?.facebook ?? "",
    instagram: settings.social_links?.instagram ?? "",
    linkedin: settings.social_links?.linkedin ?? "",
    tiktok: settings.social_links?.tiktok ?? "",
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveState("saving");
    try {
      await updateCompanySettingsAction({
        company_name: form.company_name,
        email: form.email,
        phone: form.phone,
        whatsapp_number: form.whatsapp_number,
        address: form.address,
        countries_served: form.countries_served.split(",").map((c) => c.trim()).filter(Boolean),
        business_hours_en: form.business_hours_en,
        business_hours_fr: form.business_hours_fr,
        social_links: Object.fromEntries(
          Object.entries({ facebook: form.facebook, instagram: form.instagram, linkedin: form.linkedin, tiktok: form.tiktok })
            .map(([key, value]) => [key, value.trim()])
            .filter(([, value]) => Boolean(value))
        ),
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div><h2 className="font-display text-lg font-semibold text-ink">Contact details</h2><p className="mt-1 text-xs text-muted">These details are used across the public website.</p></div>
      <Field label="Company name"><input value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} className={inputClass} /></Field>
      <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} /></Field>
      <Field label="Phone"><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} /></Field>
      <Field label="WhatsApp number" hint="International format, digits only, e.g. 2348012345678"><input value={form.whatsapp_number} onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))} className={`${inputClass} font-mono`} /></Field>
      <Field label="Address"><input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputClass} /></Field>
      <Field label="Countries served" hint="Comma-separated."><input value={form.countries_served} onChange={(e) => setForm((f) => ({ ...f, countries_served: e.target.value }))} className={inputClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business hours (English)" hint="Example: Mon–Sat, 8:00 AM–6:00 PM"><input value={form.business_hours_en} onChange={(e) => setForm((f) => ({ ...f, business_hours_en: e.target.value }))} className={inputClass} /></Field>
        <Field label="Business hours (French)" hint="Example: Lun–Sam, 8h00–18h00"><input value={form.business_hours_fr} onChange={(e) => setForm((f) => ({ ...f, business_hours_fr: e.target.value }))} className={inputClass} /></Field>
      </div>

      <div className="border-t border-border pt-5"><h2 className="font-display text-lg font-semibold text-ink">Social links</h2><p className="mt-1 text-xs text-muted">Paste the full public profile URL. Leave blank to hide a platform.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Facebook"><input type="url" value={form.facebook} onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))} placeholder="https://facebook.com/..." className={inputClass} /></Field>
        <Field label="Instagram"><input type="url" value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))} placeholder="https://instagram.com/..." className={inputClass} /></Field>
        <Field label="LinkedIn"><input type="url" value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/company/..." className={inputClass} /></Field>
        <Field label="TikTok"><input type="url" value={form.tiktok} onChange={(e) => setForm((f) => ({ ...f, tiktok: e.target.value }))} placeholder="https://tiktok.com/@..." className={inputClass} /></Field>
      </div></div>

      <div className="flex items-center justify-between gap-3 pt-2"><SaveStatusPill state={saveState} /><button type="submit" disabled={saveState === "saving"} className="ml-auto inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60">Save changes</button></div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>{children}{hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}</label>;
}

const inputClass = "w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
