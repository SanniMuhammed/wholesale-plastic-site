"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { generalInquiryLink } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CartTrigger } from "@/components/cart/CartTrigger";
import { cx } from "@/lib/utils";

interface NavProps {
  locale: Locale;
  dict: Dictionary;
}

export function Nav({ locale, dict }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const base = `/${locale}`;
  const whatsappHref = generalInquiryLink(dict);

  // Purely cosmetic: the header tightens and picks up a hairline shadow
  // once the page has actually scrolled, so it reads as "floating above
  // content" rather than a flat bar that happens to be sticky. No effect
  // on layout or any interactive behaviour below.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopLinks = [
    { href: `${base}/products`, label: dict.nav.products },
    { href: `${base}/how-it-works`, label: dict.nav.howItWorks },
    { href: `${base}/wholesale`, label: dict.nav.wholesale },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/delivery`, label: dict.nav.delivery },
  ];

  const mobileLinks = [
    { href: `${base}/products`, label: dict.nav.products },
    { href: `${base}/products#categories`, label: dict.nav.categories },
    { href: `${base}/how-it-works`, label: dict.nav.howItWorks },
    { href: `${base}/wholesale`, label: dict.nav.forBusiness },
    { href: `${base}/delivery`, label: dict.nav.delivery },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  return (
    <header
      className={cx(
        "sticky top-0 z-40 border-b bg-surface/95 backdrop-blur transition-shadow duration-300 print:hidden",
        scrolled ? "border-border shadow-card" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <Link href={base} className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
          Sherinab Venture<span className="text-brand">.</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 text-[13px] font-medium uppercase tracking-[0.06em] text-ink-soft transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-ink hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher locale={locale} />
          <span className="h-4 w-px bg-border" aria-hidden />
          <WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="icon" />
          <CartTrigger dict={dict} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {/* Always visible, independent of the menu below -- this used to
              live only inside the collapsible menu, wrapped in a div that
              closed the menu on click via onClickCapture. That raced with
              this button's own click handler on real touch devices and
              could swallow the tap entirely. Promoting it to a persistent,
              standalone button also means people can see their order count
              without opening the nav menu at all. */}
          <CartTrigger dict={dict} variant="icon" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-border text-ink transition-colors active:bg-brand-light"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="flex flex-col divide-y divide-border px-4">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-base font-medium text-ink transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between border-t border-border px-4 py-4">
            <LanguageSwitcher locale={locale} />
            <WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="text" />
          </div>
        </div>
      )}
    </header>
  );
}
