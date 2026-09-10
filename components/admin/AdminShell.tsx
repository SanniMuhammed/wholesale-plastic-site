"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, Package, ShoppingBag, FileText, Settings, FolderTree, Palette, Globe2, Building2, HelpCircle, Home, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cx } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Store",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/colors", label: "Colours", icon: Palette },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/content/homepage", label: "Homepage", icon: Home },
      { href: "/admin/content/about", label: "About", icon: Building2 },
      { href: "/admin/content/delivery", label: "Delivery", icon: Truck },
      { href: "/admin/content/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/content/company", label: "Company information", icon: Globe2 },
      { href: "/admin/content", label: "Website settings", icon: Settings, exact: true },
    ],
  },
];

export function AdminShell({ children, userEmail }: { children: ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(item: { href: string; exact?: boolean }) {
    return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4">
        <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} className="inline-flex h-10 w-10 items-center justify-center rounded text-ink md:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/admin" className="font-display text-base font-semibold text-ink">Admin</Link>
        <button type="button" onClick={handleSignOut} className="text-sm font-medium text-muted hover:text-ink">Sign out</button>
      </header>

      <div className="flex">
        <nav className={cx("z-20 w-full shrink-0 border-b border-border bg-surface md:sticky md:top-14 md:block md:h-[calc(100vh-56px)] md:w-60 md:border-b-0 md:border-r", menuOpen ? "block" : "hidden")}>
          <div className="p-3">
            <Link href="/admin" onClick={() => setMenuOpen(false)} className={cx("mb-3 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium", pathname === "/admin" ? "bg-brand-light text-brand-dark" : "text-ink-soft hover:bg-brand-light/60")}>
              <LayoutDashboard size={18} strokeWidth={1.75} />Dashboard
            </Link>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{group.label}</p>
                <ul className="grid gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return <li key={item.href}><Link href={item.href} onClick={() => setMenuOpen(false)} className={cx("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-brand-light text-brand-dark" : "text-ink-soft hover:bg-brand-light/60")}><Icon size={18} strokeWidth={1.75} />{item.label}</Link></li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 text-xs text-muted md:hidden">{userEmail}</div>
        </nav>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
