"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

type Props = { productId: string; locale: Locale };

export function ProductReviewForm({ productId, locale }: Props) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const t = locale === "fr"
    ? { title: "Partagez votre avis", intro: "Vous avez utilisé ce produit ? Dites-nous ce que vous en pensez.", name: "Votre nom", business: "Entreprise (facultatif)", location: "Ville / pays (facultatif)", review: "Votre avis", submit: "Publier mon avis", sending: "Envoi…", success: "Merci ! Votre avis a été envoyé et sera publié après vérification.", error: "Impossible d'envoyer votre avis. Réessayez.", required: "Champ obligatoire" }
    : { title: "Share your experience", intro: "Used this product? Tell us what you think.", name: "Your name", business: "Business name (optional)", location: "City / country (optional)", review: "Your review", submit: "Submit review", sending: "Submitting…", success: "Thank you! Your review has been submitted and will appear after approval.", error: "We couldn't submit your review. Please try again.", required: "Required" };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/products/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: form.get("customerName"),
          businessName: form.get("businessName"),
          location: form.get("location"),
          review: form.get("review"),
          rating,
          website: form.get("website"),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || t.error);
      formElement.reset();
      setRating(5);
      setStatus("success");
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : t.error);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-surface p-5 sm:p-7">
      <h3 className="font-display text-2xl font-semibold text-ink">{t.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{t.intro}</p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="review-website">Website</label>
          <input id="review-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <p className="text-sm font-medium text-ink">{locale === "fr" ? "Note" : "Rating"}</p>
          <div className="mt-2 flex gap-1" role="radiogroup" aria-label={locale === "fr" ? "Note" : "Rating"}>
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              const active = value <= (hoverRating || rating);
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={value === rating}
                  aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                  className={`text-2xl leading-none transition-transform hover:scale-110 ${active ? "text-brand" : "text-border"}`}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onFocus={() => setHoverRating(value)}
                  onBlur={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            {t.name} <span className="text-brand">*</span>
            <input name="customerName" required minLength={2} maxLength={80} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none transition focus:border-brand" placeholder={t.name} />
          </label>
          <label className="block text-sm font-medium text-ink">
            {t.business}
            <input name="businessName" maxLength={120} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none transition focus:border-brand" placeholder={t.business} />
          </label>
        </div>

        <label className="block text-sm font-medium text-ink">
          {t.location}
          <input name="location" maxLength={120} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none transition focus:border-brand" placeholder={t.location} />
        </label>

        <label className="block text-sm font-medium text-ink">
          {t.review} <span className="text-brand">*</span>
          <textarea name="review" required minLength={10} maxLength={1200} rows={5} className="mt-2 w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal leading-6 outline-none transition focus:border-brand" placeholder={t.review} />
        </label>

        {status === "success" && <p className="rounded-xl bg-brand-light px-4 py-3 text-sm leading-6 text-ink" role="status">{t.success}</p>}
        {status === "error" && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">{error || t.error}</p>}

        <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60">
          {status === "submitting" ? t.sending : t.submit}
        </button>
        <p className="text-xs text-muted">{t.required}: {locale === "fr" ? "nom et avis. Tous les avis sont vérifiés avant publication." : "name and review. All reviews are checked before publication."}</p>
      </form>
    </div>
  );
}
