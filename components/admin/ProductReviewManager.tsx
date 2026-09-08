"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductReviewAction, deleteProductReviewAction, updateProductReviewAction } from "@/app/admin/(dashboard)/products/review-actions";
import type { ProductReview } from "@/lib/cms/types";

export function ProductReviewManager({ productId, reviews }: { productId: string; reviews: ProductReview[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProductReview | null>(null);
  const [form, setForm] = useState({ customerName: "", businessName: "", location: "", rating: 5, reviewEn: "", reviewFr: "", published: false });
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  function startNew() { setEditing(null); setForm({ customerName: "", businessName: "", location: "", rating: 5, reviewEn: "", reviewFr: "", published: false }); setError(undefined); }
  function startEdit(review: ProductReview) { setEditing(review); setForm({ customerName: review.customer_name, businessName: review.business_name ?? "", location: review.location ?? "", rating: review.rating, reviewEn: review.review_en, reviewFr: review.review_fr, published: review.is_published }); setError(undefined); }
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function save() {
    if (!form.customerName.trim() || !form.reviewEn.trim()) { setError("Customer name and English review are required."); return; }
    setSaving(true); setError(undefined);
    try {
      if (editing) await updateProductReviewAction(editing.id, form);
      else await createProductReviewAction({ productId, ...form });
      startNew(); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save review."); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this review?")) return;
    try { await deleteProductReviewAction(id); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "Could not delete review."); }
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-sm font-semibold text-ink">Customer reviews</h2><p className="mt-1 text-xs text-muted">Reviews stay attached to this product. Publish only real customer feedback.</p></div><button type="button" onClick={startNew} className="text-sm font-medium text-brand">+ Add review</button></div>
      {reviews.length > 0 && <div className="mt-5 divide-y divide-border border-y border-border">{reviews.map((review) => <div key={review.id} className="flex items-start justify-between gap-4 py-4"><div><div className="text-brand">{"★".repeat(review.rating)}<span className="text-muted">{"★".repeat(5 - review.rating)}</span></div><p className="mt-1 text-sm text-ink">{review.review_en}</p><p className="mt-1 text-xs text-muted">{review.customer_name}{review.business_name ? ` · ${review.business_name}` : ""}{review.location ? ` · ${review.location}` : ""} · {review.is_published ? "Published" : "Draft"}</p></div><div className="flex shrink-0 gap-3 text-xs"><button type="button" onClick={() => startEdit(review)} className="text-brand">Edit</button><button type="button" onClick={() => remove(review.id)} className="text-muted hover:text-red-700">Delete</button></div></div>)}</div>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input placeholder="Customer name *" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputClass} />
        <input placeholder="Business name" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} className={inputClass} />
        <input placeholder="Location" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
        <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className={inputClass}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select>
        <textarea rows={3} placeholder="Review (English) *" value={form.reviewEn} onChange={(e) => set("reviewEn", e.target.value)} className={`${inputClass} sm:col-span-2`} />
        <textarea rows={3} placeholder="Review (French)" value={form.reviewFr} onChange={(e) => set("reviewFr", e.target.value)} className={`${inputClass} sm:col-span-2`} />
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4" /> Publish this review</label>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <button type="button" onClick={save} disabled={saving} className="mt-4 rounded bg-brand px-5 py-2.5 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60">{editing ? "Save review" : "Add review"}</button>
    </section>
  );
}
const inputClass = "w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
