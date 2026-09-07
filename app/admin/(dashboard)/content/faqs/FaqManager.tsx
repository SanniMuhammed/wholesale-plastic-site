"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ConfirmButton } from "@/components/admin/AdminUI";
import { createFaqAction, updateFaqAction, deleteFaqAction, reorderFaqsAction } from "./actions";
import type { Faq } from "@/lib/cms/types";

export function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [openId, setOpenId] = useState<string | null>(null);

  async function handleAdd() {
    const created = await createFaqAction({
      question_en: "New question",
      question_fr: "Nouvelle question",
      answer_en: "",
      answer_fr: "",
      sort_order: faqs.length + 1,
      is_published: false,
    });
    setFaqs((f) => [...f, created]);
    setOpenId(created.id);
  }

  async function handleUpdate(id: string, patch: Partial<Faq>) {
    setFaqs((f) => f.map((faq) => (faq.id === id ? { ...faq, ...patch } : faq)));
    await updateFaqAction(id, patch);
  }

  async function handleDelete(id: string) {
    await deleteFaqAction(id);
    setFaqs((f) => f.filter((faq) => faq.id !== id));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...faqs];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setFaqs(next);
    reorderFaqsAction(next.map((f) => f.id));
  }

  return (
    <div className="grid gap-3">
      {faqs.map((faq, index) => {
        const open = openId === faq.id;
        return (
          <div key={faq.id} className="rounded-lg border border-border bg-surface">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : faq.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <span className="min-w-0 truncate text-sm font-medium text-ink">{faq.question_en}</span>
              <span className="flex shrink-0 items-center gap-2">
                {!faq.is_published && (
                  <span className="rounded-full bg-border px-2 py-0.5 text-[11px] text-ink-soft">Draft</span>
                )}
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {open && (
              <div className="grid gap-4 border-t border-border p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledInput
                    label="Question (English)"
                    value={faq.question_en}
                    onBlur={(v) => handleUpdate(faq.id, { question_en: v })}
                  />
                  <LabeledInput
                    label="Question (French)"
                    value={faq.question_fr}
                    onBlur={(v) => handleUpdate(faq.id, { question_fr: v })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledTextarea
                    label="Answer (English)"
                    value={faq.answer_en}
                    onBlur={(v) => handleUpdate(faq.id, { answer_en: v })}
                  />
                  <LabeledTextarea
                    label="Answer (French)"
                    value={faq.answer_fr}
                    onBlur={(v) => handleUpdate(faq.id, { answer_fr: v })}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-1.5 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={faq.is_published}
                      onChange={(e) => handleUpdate(faq.id, { is_published: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                    Published
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="text-sm text-ink-soft hover:text-ink disabled:opacity-30"
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === faqs.length - 1}
                      className="text-sm text-ink-soft hover:text-ink disabled:opacity-30"
                    >
                      Move down
                    </button>
                    <ConfirmButton confirmLabel="Delete FAQ?" onConfirm={() => handleDelete(faq.id)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center justify-center gap-1.5 rounded border border-dashed border-border py-3 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink"
      >
        <Plus size={16} /> Add FAQ
      </button>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onBlur,
}: {
  label: string;
  value: string;
  onBlur: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      <input
        defaultValue={value}
        onBlur={(e) => onBlur(e.target.value)}
        className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onBlur,
}: {
  label: string;
  value: string;
  onBlur: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      <textarea
        rows={3}
        defaultValue={value}
        onBlur={(e) => onBlur(e.target.value)}
        className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}
