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

interface NavProps { locale: Locale; dict: Dictionary; }

function SherinabLogo() {
  return (
    <span className="group/logo inline-flex shrink-0 items-center gap-2.5" aria-hidden>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11">
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 2.75 42.25 13v22L24 45.25 5.75 35V13L24 2.75Z"
            className="fill-brand transition-transform duration-300 group-hover/logo:rotate-1"
          />
          <path
            d="M24 2.75 42.25 13 24 23.2 5.75 13 24 2.75Z"
            className="fill-brand-dark"
            opacity=".9"
          />
          <path
            d="M24 23.2v22.05"
            className="stroke-background"
            strokeWidth="1.4"
            opacity=".32"
          />
          <path
            d="M15.2 17.15c2.1-2.05 5.05-3.15 8.55-3.15 4.2 0 7.05 1.6 7.05 4.15 0 2.45-2.35 3.35-6.65 4.15-4.15.8-7.3 1.9-7.3 5.35 0 3.55 3.4 5.7 8.35 5.7 3.7 0 6.55-1.05 8.05-2.95"
            className="stroke-background transition-transform duration-300 group-hover/logo:translate-x-0.5"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M29.8 31.3h4.2"
            className="stroke-accent"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M9.7 36.2 24 44.25l14.3-8.05"
            className="stroke-accent"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity=".95"
          />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface transition-transform duration-300 group-hover/logo:scale-125" />
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[18px] font-black uppercase tracking-[-0.055em] text-ink transition-colors duration-200 group-hover/logo:text-brand sm:text-[20px]">
          Sherinab
        </span>
        <span className="mt-1.5 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.27em] text-muted sm:text-[9px]">
          <span className="h-[2px] w-4 rounded-full bg-accent" />
          Venture
        </span>
      </span>
    </span>
  );
}

export function Nav({ locale, dict }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const base = `/${locale}`;
  const whatsappHref = generalInquiryLink(dict);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `${base}/products`, label: dict.nav.products },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className={cx("sticky top-0 z-40 border-b bg-surface/95 backdrop-blur transition-shadow duration-300 print:hidden", scrolled ? "border-border shadow-card" : "border-transparent")}>
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-3 sm:px-6">
        <Link href={base} className="group shrink-0" aria-label="Sherinab Venture home">
          <SherinabLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="relative whitespace-nowrap py-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-soft transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand hover:after:scale-x-100">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} />
          <span className="h-5 w-px bg-border" aria-hidden />
          <WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="icon" />
          <CartTrigger dict={dict} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <CartTrigger dict={dict} variant="icon" />
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? dict.nav.close : dict.nav.menu} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink transition-colors hover:border-brand hover:text-brand active:bg-brand-light">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <nav className="flex flex-col divide-y divide-border px-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-4 text-base font-medium text-ink transition-colors hover:text-brand">
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
