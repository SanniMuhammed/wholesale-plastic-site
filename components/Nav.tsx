"use client";

import { useEffect, useState } from "react";
import type { MouseEvent, FormEvent } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
        <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.5h24a4 4 0 0 1 4 4v27a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-27a4 4 0 0 1 4-4Z" className="fill-surface transition-transform duration-300 group-hover/logo:-rotate-1" />
          <path d="M12 6.5h24a4 4 0 0 1 4 4v3H8v-3a4 4 0 0 1 4-4Z" className="fill-brand-dark" opacity=".9" />
          <path d="M31.8 17.5c-2-1.45-4.55-2.15-7.55-2.15-5.1 0-8.1 2.05-8.1 5.25 0 3.05 2.55 4.2 7.65 5.15 4.4.8 6.15 1.65 6.15 3.65 0 2.2-2.2 3.6-5.9 3.6-3.15 0-5.9-.9-7.95-2.55" className="stroke-surface transition-transform duration-300 group-hover/logo:translate-x-0.5" strokeWidth="3.1" strokeLinecap="round" />
          <path d="M13.5 39.5h21" className="stroke-accent" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M33.5 34.7h3" className="stroke-accent" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[18px] font-black tracking-[-0.055em] text-surface transition-colors duration-200 group-hover/logo:text-surface sm:text-[20px]">Sherinab</span>
        <span className="mt-1 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.25em] text-surface/70 sm:text-[9px]"><span className="h-px w-5 bg-accent" />Venture</span>
      </span>
    </span>
  );
}

export function Nav({ locale, dict }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const base = `/${locale}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const whatsappHref = generalInquiryLink(dict);

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 8); }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: `${base}/products`, label: dict.nav.products },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("q") ?? "").trim();
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.push(params.toString() ? `${base}/products?${params}` : `${base}/products`);
    setOpen(false);
  }

  function handleBrandClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== base) return;
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  return (
    <header className={cx("sticky top-0 z-40 border-b bg-brand text-surface backdrop-blur transition-shadow duration-300", scrolled ? "border-brand-dark shadow-card" : "border-brand/70")}>
      <div className="mx-auto flex h-16 w-full max-w-content items-center gap-2 px-4 sm:h-[68px] sm:gap-3 sm:px-6 lg:gap-4 lg:px-8">
        <Link href={base} className="group shrink-0" aria-label="Sherinab Venture home" onClick={handleBrandClick}><SherinabLogo /></Link>

        <form onSubmit={handleSearch} className="relative min-w-0 flex-1 md:max-w-[220px] lg:max-w-md">
          <Search size={17} strokeWidth={1.9} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand" aria-hidden />
          <label htmlFor="navbar-search" className="sr-only">{dict.common.searchPlaceholder}</label>
          <input id="navbar-search" name="q" type="search" defaultValue={searchParams.get("q") ?? ""} placeholder={dict.common.searchPlaceholder} autoComplete="off" className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-muted hover:border-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/10 sm:h-11 sm:text-[13px]" />
        </form>

        <nav className="hidden min-w-0 shrink-0 items-center gap-2 md:flex lg:gap-4 xl:gap-5">
          {links.map((link) => <Link key={link.href} href={link.href} className="relative shrink-0 whitespace-nowrap py-2 text-[11px] font-semibold uppercase tracking-[0.03em] text-surface/90 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-surface after:transition-transform after:duration-300 after:ease-out hover:text-surface hover:after:scale-x-100 lg:text-[12px] lg:tracking-[0.05em]">{link.label}</Link>)}
        </nav>

        <div className="hidden shrink-0 items-center gap-1 md:flex lg:gap-1.5 xl:gap-2">
          <span className="inline-flex shrink-0"><LanguageSwitcher locale={locale} /></span>
          <span className="h-5 w-px shrink-0 bg-surface/30" aria-hidden />
          <span className="inline-flex shrink-0"><WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="icon" /></span>
          <span className="inline-flex shrink-0"><CartTrigger dict={dict} /></span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 md:hidden">
          <CartTrigger dict={dict} variant="icon" />
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? dict.nav.close : dict.nav.menu} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface/40 bg-surface/10 text-surface transition-colors hover:border-surface hover:bg-surface/15 sm:h-11 sm:w-11">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>

      {open && <div className="border-t border-surface/20 bg-brand md:hidden"><nav className="flex flex-col divide-y divide-surface/15 px-4 sm:px-6">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-4 text-base font-medium text-surface transition-colors hover:text-surface/80">{link.label}</Link>)}</nav><div className="flex items-center justify-between border-t border-surface/15 px-4 py-4 sm:px-6"><LanguageSwitcher locale={locale} /><WhatsAppLink href={whatsappHref} label={dict.nav.whatsapp} variant="text" /></div></div>}
    </header>
  );
}
