"use client";

import { useState, type FormEvent } from "react";
import { SaveStatusPill, type SaveState } from "@/components/admin/AdminUI";

export function BodyContentForm({
  initialBodyEn,
  initialBodyFr,
  onSave,
}: {
  initialBodyEn: string;
  initialBodyFr: string;
  onSave: (input: { body_en: string; body_fr: string }) => Promise<unknown>;
}) {
  const [bodyEn, setBodyEn] = useState(initialBodyEn);
  const [bodyFr, setBodyFr] = useState(initialBodyFr);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveState("saving");
    try {
      await onSave({ body_en: bodyEn, body_fr: bodyFr });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink-soft">English</span>
        <textarea
          rows={8}
          value={bodyEn}
          onChange={(e) => setBodyEn(e.target.value)}
          className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink-soft">French</span>
        <textarea
          rows={8}
          value={bodyFr}
          onChange={(e) => setBodyFr(e.target.value)}
          className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </label>
      <div className="flex items-center justify-between gap-3">
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
