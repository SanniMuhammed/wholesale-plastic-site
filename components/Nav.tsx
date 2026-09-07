"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { generalInquiryLink } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CartTrigger } from "@/components/cart/CartTrigger";

interface NavProps {
  locale: Locale;
  dict: Dictionary;
}

export function Nav({ locale, dict }: NavProps) {
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;
  const whatsappHref = generalInquiryLink(dict);

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
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        <Link href={base} className="font-display text-lg font-semibold tracking-tight text-ink">
          Company<span className="text-brand">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher locale={locale} />
          <WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="icon" />
          <CartTrigger dict={dict} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? dict.nav.close : dict.nav.menu}
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-border text-ink md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-2.5 text-base font-medium text-ink hover:bg-brand-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between border-t border-border px-4 py-4">
            <LanguageSwitcher locale={locale} />
            <WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="text" />
          </div>
          <div className="px-4 pb-4" onClickCapture={() => setOpen(false)}>
            <CartTrigger dict={dict} variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}
