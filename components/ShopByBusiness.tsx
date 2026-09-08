import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { PathIllustration, type BusinessPath } from "@/components/illustrations/PathIllustration";
import { cx } from "@/lib/utils";

const BUSINESS_TYPES = [
  { en: { title: "For Resellers", description: "Stock fast-moving plastic products for your shop or market stall." }, fr: { title: "Pour les revendeurs", description: "Approvisionnez votre boutique ou votre étal en produits plastiques demandés." }, category: "household" },
  { en: { title: "For Restaurants", description: "Source bowls, containers and everyday plastic supplies in bulk." }, fr: { title: "Pour les restaurants", description: "Approvisionnez-vous en bols, récipients et articles plastiques en gros." }, category: "containers" },
  { en: { title: "For Hotels & Hospitality", description: "Build a dependable supply of practical household plastic products." }, fr: { title: "Pour les hôtels et l'hôtellerie", description: "Constituez un stock fiable de produits plastiques pratiques pour l'accueil." }, category: "household" },
  { en: { title: "Starting a Business", description: "Start, restock, or grow with wholesale plastic products wherever your business is based." }, fr: { title: "Démarrer un commerce", description: "Démarrez, réapprovisionnez ou développez votre activité avec des produits plastiques en gros, où que vous soyez." }, category: "buckets" },
];

const PATHS: { key: BusinessPath; tint: string; ink: string }[] = [
  { key: "start", tint: "bg-clay-light", ink: "text-clay" },
  { key: "restock", tint: "bg-ochre-light", ink: "text-ochre" },
  { key: "distribute", tint: "bg-brand-light", ink: "text-brand" },
];

export function ShopByBusiness({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isFrench = locale === "fr";
  const copy = isFrench
    ? { eyebrow: "ACHETEZ POUR VOTRE ACTIVITÉ", title: "Des produits adaptés à votre commerce", subtitle: "Que vous revendiez, restauriez ou démarriez votre activité, trouvez rapidement ce qui correspond à vos besoins.", cta: "Voir tous les produits", next: "VOTRE PARCOURS", nextTitle: "Commencez, réapprovisionnez ou développez votre distribution" }
    : { eyebrow: "SHOP FOR YOUR BUSINESS", title: "Products built around your business", subtitle: "Whether you resell, run a restaurant or are starting out, get to the products that fit your needs faster.", cta: "View All Products", next: "YOUR BUSINESS JOURNEY", nextTitle: "Start, restock, or grow your distribution" };

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow text-brand">{copy.eyebrow}</p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h2 className="max-w-2xl font-display text-2xl font-semibold text-ink sm:text-3xl">{copy.title}</h2><p className="mt-2 max-w-2xl text-muted">{copy.subtitle}</p></div>
          <Link href={`/${locale}/products`} className="shrink-0 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">{copy.cta} →</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_TYPES.map((item, index) => { const text = isFrench ? item.fr : item.en; return <Link key={text.title} href={`/${locale}/products?category=${item.category}`} className="group rounded-lg border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lifted"><div className="flex items-start justify-between gap-4"><span className="font-mono text-xs font-bold text-brand/60">{String(index + 1).padStart(2, "0")}</span><span className="text-lg text-ink-soft transition-transform group-hover:translate-x-1" aria-hidden>→</span></div><h3 className="mt-8 font-display text-lg font-semibold text-ink">{text.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text.description}</p></Link>; })}
        </div>
        <div className="mt-12 border-t border-border pt-9 sm:mt-14 sm:pt-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6"><div><p className="eyebrow text-muted">{copy.next}</p><h3 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">{copy.nextTitle}</h3></div><Link href={`/${locale}/order-summary`} className="text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">{dict.startBusiness.cta} →</Link></div>
          <div className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-3">{PATHS.map(({ key, tint, ink }, i) => { const segment = dict.startBusiness.segments[key]; return <div key={key} className={cx("flex items-center gap-4 px-4 py-4 sm:px-5", tint)}><span className={cx("font-mono text-xs font-bold", ink)}>{String(i + 1).padStart(2, "0")}</span><PathIllustration path={key} className={cx("h-8 w-8 shrink-0", ink)} /><div className="min-w-0"><h4 className="font-display text-base font-semibold text-ink">{segment.title}</h4><p className="mt-0.5 text-xs leading-5 text-ink-soft sm:text-sm">{segment.description}</p></div></div>; })}</div>
        </div>
      </div>
    </section>
  );
}
