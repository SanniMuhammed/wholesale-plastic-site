"use client";
import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import type { SiteSettings } from "@/lib/cms/site-settings";
import { generalInquiryLink } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CartTrigger } from "@/components/cart/CartTrigger";
import { SearchBox } from "@/components/SearchBox";
import { cx } from "@/lib/utils";

interface NavProps { locale: Locale; dict: Dictionary; siteSettings?: SiteSettings }

function SherinabLogo() {
  return <span className="group/logo inline-flex shrink-0 items-center gap-2.5" aria-hidden><span className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11"><svg viewBox="0 0 48 48" className="h-full w-full" fill="none"><path d="M12 6.5h24a4 4 0 0 1 4 4v27a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-27a4 4 0 0 1 4-4Z" className="fill-surface"/><path d="M12 6.5h24a4 4 0 0 1 4 4v3H8v-3a4 4 0 0 1 4-4Z" className="fill-accent"/><path d="M31.8 17.5c-2-1.45-4.55-2.15-7.55-2.15-5.1 0-8.1 2.05-8.1 5.25 0 3.05 2.55 4.2 7.65 5.15 4.4.8 6.15 1.65 6.15 3.65 0 2.2-2.2 3.6-5.9 3.6-3.15 0-5.9-.9-7.95-2.55" className="stroke-brand" strokeWidth="3.1" strokeLinecap="round"/><path d="M13.5 39.5h21" className="stroke-accent" strokeWidth="1.6" strokeLinecap="round"/></svg></span><span className="flex flex-col leading-none"><span className="font-display text-[18px] font-black tracking-[-0.055em] text-surface sm:text-[20px]">Sherinab</span><span className="mt-1 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.25em] text-surface/70 sm:text-[9px]"><span className="h-px w-5 bg-accent"/>Venture</span></span></span>
}

export function Nav({ locale, dict, siteSettings }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchParams = useSearchParams();
  const base = `/${locale}`;
  const nav = siteSettings?.navigation?.[locale];
  const labels = { products: nav?.products || dict.nav.products, about: nav?.about || dict.nav.about, contact: nav?.contact || dict.nav.contact, whatsapp: nav?.whatsapp || dict.nav.whatsapp };
  const whatsappHref = generalInquiryLink(dict);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const links = [
    { href: `${base}/products`, label: labels.products },
    { href: `${base}/about`, label: labels.about },
    { href: `${base}/contact`, label: labels.contact },
  ];

  function handleBrandClick(e: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== base) return;
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  return <header className={cx("sticky top-0 z-40 border-b bg-brand text-surface backdrop-blur transition-shadow duration-300", scrolled ? "border-brand-dark shadow-card" : "border-brand/70")}><div className="mx-auto flex h-16 w-full max-w-content items-center gap-2 px-4 sm:h-[68px] sm:gap-3 lg:gap-4 lg:px-8"><Link href={base} className="group shrink-0" aria-label="Sherinab Venture home" onClick={handleBrandClick}><SherinabLogo /></Link><SearchBox locale={locale} dict={dict} initialQuery={searchParams.get("q") ?? ""} /><nav className="hidden min-w-0 shrink-0 items-center gap-2 md:flex lg:gap-4 xl:gap-5">{links.map(l => <Link key={l.href} href={l.href} className="relative shrink-0 whitespace-nowrap py-2 text-[11px] font-semibold uppercase tracking-[0.03em] text-surface/90 hover:text-surface lg:text-[12px] lg:tracking-[0.05em]">{l.label}</Link>)}</nav><div className="hidden shrink-0 items-center gap-1 md:flex lg:gap-1.5 xl:gap-2"><LanguageSwitcher locale={locale} dark/><span className="h-5 w-px bg-surface/30"/><WhatsAppLink href={whatsappHref} label={labels.whatsapp} variant="icon"/><CartTrigger dict={dict}/></div><div className="flex shrink-0 items-center gap-1.5 md:hidden"><CartTrigger dict={dict} variant="icon"/><button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface/40 bg-surface/10 text-surface sm:h-11 sm:w-11">{open ? <X size={20}/> : <Menu size={20}/>}</button></div></div>{open && <div className="border-t border-surface/20 bg-brand md:hidden"><nav className="flex flex-col divide-y divide-surface/15 px-4 sm:px-6">{links.map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-4 text-base font-medium text-surface">{l.label}</Link>)}</nav><div className="flex items-center justify-between border-t border-surface/15 px-4 py-4 sm:px-6"><LanguageSwitcher locale={locale} dark/><WhatsAppLink href={whatsappHref} label={labels.whatsapp} variant="text"/></div></div>}</header>
}
