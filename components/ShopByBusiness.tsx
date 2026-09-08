import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const BUSINESS_TYPES = [
  {
    en: { title: "For Resellers", description: "Stock fast-moving plastic products for your shop or market stall." },
    fr: { title: "Pour les revendeurs", description: "Approvisionnez votre boutique ou votre étal en produits plastiques demandés." },
    category: "household",
  },
  {
    en: { title: "For Restaurants", description: "Source bowls, containers and everyday plastic supplies in bulk." },
    fr: { title: "Pour les restaurants", description: "Approvisionnez-vous en bols, récipients et articles plastiques en gros." },
    category: "containers",
  },
  {
    en: { title: "For Hotels & Hospitality", description: "Build a dependable supply of practical household plastic products." },
    fr: { title: "Pour les hôtels et l'hôtellerie", description: "Constituez un stock fiable de produits plastiques pratiques pour l'accueil." },
    category: "household",
  },
  {
    en: { title: "Starting a Business", description: "Start sourcing from Nigeria without needing to travel there yourself." },
    fr: { title: "Démarrer un commerce", description: "Commencez à vous approvisionner au Nigeria sans avoir à vous y déplacer." },
    category: "buckets",
  },
];

export function ShopByBusiness({ locale }: { locale: Locale }) {
  const isFrench = locale === "fr";
  const copy = isFrench
    ? {
        eyebrow: "ACHETEZ POUR VOTRE ACTIVITÉ",
        title: "Des produits adaptés à votre commerce",
        subtitle: "Que vous revendiez, restauriez ou démarriez votre activité, trouvez rapidement ce qui correspond à vos besoins.",
        cta: "Voir tous les produits",
      }
    : {
        eyebrow: "SHOP FOR YOUR BUSINESS",
        title: "Products built around your business",
        subtitle: "Whether you resell, run a restaurant or are starting out, get to the products that fit your needs faster.",
        cta: "View All Products",
      };

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <p className="eyebrow text-brand">{copy.eyebrow}</p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="max-w-2xl font-display text-2xl font-semibold text-ink sm:text-3xl">{copy.title}</h2>
            <p className="mt-2 max-w-2xl text-muted">{copy.subtitle}</p>
          </div>
          <Link href={`/${locale}/products`} className="shrink-0 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
            {copy.cta} →
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_TYPES.map((item, index) => {
            const text = isFrench ? item.fr : item.en;
            return (
              <Link
                key={text.title}
                href={`/${locale}/products?category=${item.category}`}
                className="group rounded-lg border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lifted"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs font-bold text-brand/60">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-lg text-ink-soft transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </div>
                <h3 className="mt-8 font-display text-lg font-semibold text-ink">{text.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
