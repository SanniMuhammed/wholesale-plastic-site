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
        countries_served: form.countries_served
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
      <Field label="Company name">
        <input
          value={form.company_name}
          onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field label="Phone">
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field label="WhatsApp number" hint="International format, digits only, e.g. 2348012345678">
        <input
          value={form.whatsapp_number}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))}
          className={`${inputClass} font-mono`}
        />
      </Field>
      <Field label="Address">
        <input
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field label="Countries served" hint="Comma-separated.">
        <input
          value={form.countries_served}
          onChange={(e) => setForm((f) => ({ ...f, countries_served: e.target.value }))}
          className={inputClass}
        />
      </Field>

      <div className="flex items-center justify-between gap-3 pt-2">
        <SaveStatusPill state={saveState} />
        <button
          type="submit"
          disabled={saveState === "saving"}
          className="ml-auto inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
