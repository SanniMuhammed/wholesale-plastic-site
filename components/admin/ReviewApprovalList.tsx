"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff } from "lucide-react";
import { setProductReviewPublishedAction } from "@/app/admin/(dashboard)/products/review-actions";
import type { ProductReview } from "@/lib/cms/types";

type ReviewWithProduct = ProductReview & { productName: string };

export function ReviewApprovalList({ reviews }: { reviews: ReviewWithProduct[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"pending" | "published">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const visible = reviews.filter((review) => filter === "pending" ? !review.is_published : review.is_published);

  async function setPublished(review: ReviewWithProduct, published: boolean) {
    setBusyId(review.id); setError(undefined);
    try { await setProductReviewPublishedAction(review.id, published); router.refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update review."); }
    finally { setBusyId(null); }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setFilter("pending")} className={`rounded-md px-3 py-2 text-sm font-medium ${filter === "pending" ? "bg-brand text-white" : "border border-border bg-surface text-ink-soft"}`}>
          Pending ({reviews.filter((review) => !review.is_published).length})
        </button>
        <button type="button" onClick={() => setFilter("published")} className={`rounded-md px-3 py-2 text-sm font-medium ${filter === "published" ? "bg-brand text-white" : "border border-border bg-surface text-ink-soft"}`}>
          Published ({reviews.filter((review) => review.is_published).length})
        </button>
      </div>
      {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-sm font-medium text-ink">{filter === "pending" ? "No reviews waiting for approval" : "No published reviews yet"}</p>
          <p className="mt-1 text-xs text-muted">{filter === "pending" ? "New customer reviews will appear here before they are shown publicly." : "Approved reviews will appear here."}</p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {visible.map((review) => (
            <article key={review.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{review.productName}</p>
                  <div className="mt-2 text-sm text-brand">{"★".repeat(review.rating)}<span className="text-border">{"★".repeat(5 - review.rating)}</span></div>
                  <p className="mt-2 text-sm leading-6 text-ink">{review.review_en}</p>
                  {review.review_fr && <p className="mt-2 text-xs leading-5 text-muted">FR: {review.review_fr}</p>}
                  <p className="mt-3 text-xs text-muted"><span className="font-medium text-ink-soft">{review.customer_name}</span>{review.business_name ? ` · ${review.business_name}` : ""}{review.location ? ` · ${review.location}` : ""}{review.created_at ? ` · ${new Date(review.created_at).toLocaleDateString()}` : ""}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {review.is_published ? (
                    <button type="button" onClick={() => setPublished(review, false)} disabled={busyId === review.id} className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-background disabled:opacity-50"><EyeOff size={15} /> Unpublish</button>
                  ) : (
                    <button type="button" onClick={() => setPublished(review, true)} disabled={busyId === review.id} className="inline-flex items-center gap-1.5 rounded bg-accent px-3 py-2 text-xs font-semibold text-brand-dark hover:opacity-90 disabled:opacity-50"><Check size={15} /> {busyId === review.id ? "Approving…" : "Approve"}</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
