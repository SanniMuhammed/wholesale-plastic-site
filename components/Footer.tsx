import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { CATEGORIES, type CategorySlug } from "@/lib/products";
import { interpolate } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getCompanySettings } from "@/lib/cms/settings";

const FOOTER_CATEGORY_SLUGS: CategorySlug[] = ["buckets", "basins", "containers", "household"];

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();
  const footerCategories = CATEGORIES.filter((c) => FOOTER_CATEGORY_SLUGS.includes(c.slug));
  const settings = await getCompanySettings().catch(() => null);
  const address = settings?.address || "Oke Sunnah, Saki, Oyo State, Nigeria";
  const mission = locale === "fr"
    ? "Nous rapprochons les produits et les opportunités du Nigeria des entreprises au Nigeria et au-delà."
    : "We connect Nigerian products and opportunity with businesses in Nigeria and beyond.";

  return (
    <footer className="border-t border-white/10 bg-[#123F35] print:hidden">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <Link href={base} className="inline-flex items-baseline font-display text-[2.15rem] font-medium leading-none tracking-tight text-white transition-colors hover:text-brand sm:text-5xl">
          Sherinab <span className="ml-2 text-[0.72em] font-normal tracking-[0.18em] text-white/60">VENTURE</span><span className="ml-1.5 text-brand">.</span>
        </Link>
        <p className="mt-5 max-w-2xl font-display text-lg leading-snug text-white sm:mt-6 sm:text-2xl">{mission}</p>
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9 border-t border-white/15 pt-8 sm:mt-14 sm:grid-cols-[1.4fr_0.9fr_0.7fr_1fr] sm:gap-8 sm:pt-12">
          <div>
            <h3 className="eyebrow !text-white/60">{dict.footer.productsHeading}</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">{locale === "fr" ? "Un catalogue pensé pour les commerces, la restauration et l’hôtellerie." : "A practical catalogue for shops, restaurants, hospitality and growing businesses."}</p>
            <ul className="mt-4 space-y-1.5 font-display text-base text-white/80 sm:mt-5 sm:space-y-2">
              {footerCategories.map((c) => <li key={c.slug}><Link href={`${base}/products?category=${c.slug}`} className="transition-colors hover:text-brand">{c.name[locale]}</Link></li>)}
              <li><Link href={`${base}/products`} className="font-medium text-white transition-colors hover:text-brand">{dict.footer.allProducts} →</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="eyebrow !text-white/60">{dict.footer.businessHeading}</h3>
            <ul className="mt-4 space-y-2 font-display text-base text-white/80">
              <li><Link href={`${base}/how-it-works`} className="transition-colors hover:text-brand">{dict.nav.howItWorks}</Link></li>
              <li><Link href={`${base}/products`} className="transition-colors hover:text-brand">{dict.footer.catalog}</Link></li>
              <li><Link href={`${base}/order-summary`} className="transition-colors hover:text-brand">{dict.nav.reviewOrder}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="eyebrow !text-white/60">{dict.footer.companyHeading}</h3>
            <ul className="mt-4 space-y-2 font-display text-base text-white/80">
              <li><Link href={`${base}/about`} className="transition-colors hover:text-brand">{dict.footer.aboutUs}</Link></li>
              <li><Link href={`${base}/contact`} className="transition-colors hover:text-brand">{dict.nav.contact}</Link></li>
            </ul>
          </div>
          <div className="col-span-2 border-t border-white/15 pt-6 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            <h3 className="eyebrow !text-white/60">{locale === "fr" ? "ADRESSE" : "LOCATION"}</h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">{address}</p>
          </div>
        </div>
        <div className="mt-9 flex flex-col gap-4 border-t border-white/15 pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:pt-7">
          <p className="font-mono text-xs tracking-wide text-white/50">{interpolate(dict.footer.copyright, { year })}</p>
          <div className="inline-flex self-start rounded-full border border-white/20 bg-white/10 p-1 sm:self-auto [&_a]:!text-white [&_span]:!text-white/30"><LanguageSwitcher locale={locale} /></div>
        </div>
      </div>
    </footer>
  );
}
