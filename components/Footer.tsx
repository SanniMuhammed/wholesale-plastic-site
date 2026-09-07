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

  return (
    <footer className="border-t border-border bg-surface print:hidden">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
        {/* Closing signature -- the footer's one oversized moment, echoing
            the wordmark at a scale nothing else on the page uses, so the
            page ends on the same deliberate note it opened on. */}
        <Link
          href={base}
          className="font-display text-[2.75rem] font-semibold leading-none tracking-tight text-ink transition-colors hover:text-brand sm:text-6xl"
        >
          Sherinab Venture<span className="text-brand">.</span>
        </Link>
        <p className="mt-4 max-w-sm text-sm text-muted">{dict.footer.tagline}</p>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <h3 className="eyebrow">{dict.footer.productsHeading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`${base}/products?category=${c.slug}`} className="transition-colors hover:text-brand">
                    {c.name[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${base}/products`} className="font-medium text-ink transition-colors hover:text-brand">
                  {dict.footer.allProducts}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">{dict.footer.businessHeading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li>
                <Link href={`${base}/wholesale`} className="transition-colors hover:text-brand">{dict.nav.wholesale}</Link>
              </li>
              <li>
                <Link href={`${base}/how-it-works`} className="transition-colors hover:text-brand">{dict.nav.howItWorks}</Link>
              </li>
              <li>
                <Link href={`${base}/delivery`} className="transition-colors hover:text-brand">{dict.nav.delivery}</Link>
              </li>
              <li>
                <Link href={`${base}/products`} className="transition-colors hover:text-brand">{dict.footer.catalog}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">{dict.footer.companyHeading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li>
                <Link href={`${base}/about`} className="transition-colors hover:text-brand">{dict.footer.aboutUs}</Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="transition-colors hover:text-brand">{dict.nav.contact}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted">
            {interpolate(dict.footer.copyright, { year })}
          </p>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </footer>
  );
}
