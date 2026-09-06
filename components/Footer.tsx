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
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href={base} className="font-display text-lg font-semibold text-ink">
              Company<span className="text-brand">.</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">{dict.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">{dict.footer.productsHeading}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`${base}/products?category=${c.slug}`} className="hover:text-brand">
                    {c.name[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${base}/products`} className="hover:text-brand">
                  {dict.footer.allProducts}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">{dict.footer.businessHeading}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href={`${base}/wholesale`} className="hover:text-brand">{dict.nav.wholesale}</Link>
              </li>
              <li>
                <Link href={`${base}/how-it-works`} className="hover:text-brand">{dict.nav.howItWorks}</Link>
              </li>
              <li>
                <Link href={`${base}/delivery`} className="hover:text-brand">{dict.nav.delivery}</Link>
              </li>
              <li>
                <Link href={`${base}/products`} className="hover:text-brand">{dict.footer.catalog}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">{dict.footer.companyHeading}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href={`${base}/about`} className="hover:text-brand">{dict.footer.aboutUs}</Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="hover:text-brand">{dict.nav.contact}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            {interpolate(dict.footer.copyright, { year })}
          </p>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </footer>
  );
}
