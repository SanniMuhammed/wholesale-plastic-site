import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { generalInquiryLink } from "@/lib/whatsapp";

export function WholesaleQuoteCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isFrench = locale === "fr";
  const copy = isFrench
    ? {
        eyebrow: "VOUS NE TROUVEZ PAS CE QU'IL VOUS FAUT ?",
        title: "Dites-nous ce que vous recherchez.",
        body: "Envoyez-nous les produits, les quantités et votre destination. Nous vous aiderons à trouver les produits et à préparer un devis de gros.",
        primary: "Demander un devis",
        secondary: "Nous écrire sur WhatsApp",
        note: "Produit • Quantité • Destination",
      }
    : {
        eyebrow: "CAN'T FIND WHAT YOU NEED?",
        title: "Tell us what you're looking for.",
        body: "Send us the products, quantities and destination you have in mind. We'll help source the right products and prepare a wholesale quote.",
        primary: "Request a Wholesale Quote",
        secondary: "Message Us on WhatsApp",
        note: "Product • Quantity • Destination",
      };

  return (
    <section className="bg-brand-light/45">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-brand/15 bg-brand p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-light/75">{copy.eyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-surface sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-brand-light/90">{copy.body}</p>
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand-light/70">
              {copy.note}
            </p>
          </div>

          <div className="mt-7 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <Link
              href={`/${locale}/order-summary`}
              className="inline-flex items-center justify-center rounded bg-surface px-5 py-3 text-sm font-semibold text-brand-dark transition-opacity hover:opacity-90"
            >
              {copy.primary}
            </Link>
            <a
              href={generalInquiryLink(dict)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded border border-surface/50 px-5 py-3 text-sm font-semibold text-surface transition-colors hover:bg-surface/10"
            >
              {copy.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
