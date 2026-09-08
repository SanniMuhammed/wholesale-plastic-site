import type { ProductReview } from "@/lib/cms/types";
import type { Locale } from "@/lib/i18n/config";
import { ProductReviewForm } from "@/components/ProductReviewForm";

export function ProductReviews({ reviews, productId, locale }: { reviews: ProductReview[]; productId: string; locale: Locale }) {
  const title = locale === "fr" ? "Avis clients" : "Customer reviews";
  const subtitle = locale === "fr" ? "Ce que les clients disent de ce produit." : "What customers say about this product.";
  const sampleLabel = locale === "fr" ? "Avis de démonstration" : "Sample review";
  const writeLabel = locale === "fr" ? "Écrire un avis" : "Write a review";

  return (
    <section className="mt-16 border-t border-border pt-12 sm:mt-20 sm:pt-16" aria-labelledby="product-reviews-title">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          {reviews.length > 0 && <p className="eyebrow text-brand">{reviews.length} {locale === "fr" ? "avis" : "reviews"}</p>}
          <h2 id="product-reviews-title" className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <a href="#write-review" className="inline-flex min-h-10 items-center justify-center rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-light">
          {writeLabel} ↓
        </a>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => {
            const text = locale === "fr" ? review.review_fr || review.review_en : review.review_en || review.review_fr;
            const isSample = review.customer_name.startsWith("Sample Customer");
            return (
              <article key={review.id} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-brand" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, i) => <span key={i} aria-hidden>{i < review.rating ? "★" : "☆"}</span>)}
                  </div>
                  {isSample && <span className="rounded-full border border-brand/20 bg-brand-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">{sampleLabel}</span>}
                </div>

                {review.customer_photo_path && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
                    <img
                      src={review.customer_photo_path}
                      alt={locale === "fr" ? `Photo partagée par ${review.customer_name}` : `Photo shared by ${review.customer_name}`}
                      loading="lazy"
                      className="h-48 w-full object-cover sm:h-56"
                    />
                  </div>
                )}

                <blockquote className="mt-4 font-display text-lg leading-relaxed text-ink">“{text}”</blockquote>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-ink">{review.customer_name}</p>
                  {review.business_name && <p className="mt-0.5 text-xs text-muted">{review.business_name}</p>}
                  {review.location && <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">{review.location}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div id="write-review" className="scroll-mt-24">
        <ProductReviewForm productId={productId} locale={locale} />
      </div>
    </section>
  );
}
