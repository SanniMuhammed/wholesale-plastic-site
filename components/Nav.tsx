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
      <svg
        viewBox="0 0 44 44"
        className="h-9 w-9 shrink-0 overflow-visible sm:h-10 sm:w-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 8.5h22a2.5 2.5 0 0 1 2.5 2.5v18.2a3.3 3.3 0 0 1-3.3 3.3H11.8a3.3 3.3 0 0 1-3.3-3.3V11A2.5 2.5 0 0 1 11 8.5Z"
          className="fill-brand transition-transform duration-300 group-hover/logo:-translate-y-0.5"
        />
        <path
          d="M12.5 8.5V6.8A3.8 3.8 0 0 1 16.3 3h11.4a3.8 3.8 0 0 1 3.8 3.8v1.7"
          className="stroke-brand-dark"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M13 16.5h18M13 22h18M13 27.5h10"
          className="stroke-background"
          strokeWidth="2.1"
          strokeLinecap="round"
          opacity=".92"
        />
        <path
          d="M28.5 27.5h2.5"
          className="stroke-accent"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8.5 34.5h27"
          className="stroke-accent"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[18px] font-extrabold tracking-[-0.045em] text-ink transition-colors duration-200 group-hover/logo:text-brand sm:text-[20px]">
          Sherinab
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.24em] text-muted sm:text-[9px]">
          <span className="h-px w-3 bg-accent" />
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
