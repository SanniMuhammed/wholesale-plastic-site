import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import { interpolate } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const FOOTER_CATEGORY_SLUGS: CategorySlug[] = ["buckets", "basins", "containers", "household"];

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();
  const footerCategories = CATEGORIES.filter((c) => FOOTER_CATEGORY_SLUGS.includes(c.slug));
  const mission = locale === "fr"
    ? "Nous rapprochons les produits et les opportunités du Nigeria des entreprises au Nigeria et au-delà."
    : "We connect Nigerian products and opportunity with businesses in Nigeria and beyond.";

  return (
    <footer className="border-t border-border bg-surface print:hidden">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <Link href={base} className="inline-flex items-baseline font-display text-[2.4rem] font-medium leading-none tracking-tight text-ink transition-colors hover:text-brand sm:text-5xl">
          Sherinab <span className="ml-2 text-[0.72em] font-normal tracking-[0.18em] text-ink-soft">VENTURE</span><span className="ml-1.5 text-brand">.</span>
        </Link>
        <p className="mt-6 max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl">{mission}</p>
        <div className="mt-14 grid gap-12 border-t border-border pt-10 sm:mt-16 sm:grid-cols-[1.5fr_1fr_0.7fr] sm:gap-10 sm:pt-12">
          <div><h3 className="eyebrow">{dict.footer.productsHeading}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-muted">{locale === "fr" ? "Un catalogue pensé pour les commerces, la restauration et l’hôtellerie." : "A practical catalogue for shops, restaurants, hospitality and growing businesses."}</p><ul className="mt-5 space-y-2 font-display text-base text-ink-soft">{footerCategories.map((c) => <li key={c.slug}><Link href={`${base}/products?category=${c.slug}`} className="transition-colors hover:text-brand">{c.name[locale]}</Link></li>)}<li><Link href={`${base}/products`} className="font-medium text-ink transition-colors hover:text-brand">{dict.footer.allProducts} →</Link></li></ul></div>
          <div><h3 className="eyebrow">{dict.footer.businessHeading}</h3><ul className="mt-4 space-y-2.5 font-display text-base text-ink-soft"><li><Link href={`${base}/how-it-works`} className="transition-colors hover:text-brand">{dict.nav.howItWorks}</Link></li><li><Link href={`${base}/products`} className="transition-colors hover:text-brand">{dict.footer.catalog}</Link></li><li><Link href={`${base}/order-summary`} className="transition-colors hover:text-brand">{dict.nav.reviewOrder}</Link></li></ul></div>
          <div className="sm:mt-8 sm:text-right"><h3 className="eyebrow">{dict.footer.companyHeading}</h3><ul className="mt-4 space-y-2.5 font-display text-base text-ink-soft"><li><Link href={`${base}/about`} className="transition-colors hover:text-brand">{dict.footer.aboutUs}</Link></li><li><Link href={`${base}/contact`} className="transition-colors hover:text-brand">{dict.nav.contact}</Link></li></ul></div>
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between"><p className="font-mono text-xs tracking-wide text-muted">{interpolate(dict.footer.copyright, { year })}</p><div className="inline-flex self-start rounded-full border border-border bg-background p-1 sm:self-auto"><LanguageSwitcher locale={locale} /></div></div>
      </div>
    </footer>
  );
}
