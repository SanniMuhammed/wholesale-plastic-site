import Link from "next/link";
import { ArrowRight, Building2, HelpCircle, Home, Truck, Globe2 } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminUI";

const sections = [
  { href: "/admin/content/homepage", title: "Homepage", description: "Hero, homepage sections and category images.", icon: Home },
  { href: "/admin/content/about", title: "About", description: "Company story and the information customers see on About Us.", icon: Building2 },
  { href: "/admin/content/delivery", title: "Delivery", description: "Delivery page wording and all delivery photos.", icon: Truck },
  { href: "/admin/content/faqs", title: "FAQs", description: "Questions and answers shown to customers.", icon: HelpCircle },
  { href: "/admin/content/company", title: "Company information", description: "Business name, contact details, WhatsApp, address and hours.", icon: Globe2 },
];

export default function WebsiteSettingsPage() {
  return (
    <div>
      <PageHeader title="Website" description="Manage the parts of the public website that change most often. You do not need to edit code." />
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-brand/40 hover:bg-brand-light/20">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-light text-brand-dark"><Icon size={19} strokeWidth={1.75} /></span>
              <ArrowRight size={17} className="text-muted transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-border bg-background p-5">
        <p className="text-sm font-semibold text-ink">Store management</p>
        <p className="mt-1 text-sm leading-6 text-muted">Products, categories, colours and orders are managed from the Store section in the left menu.</p>
      </div>
    </div>
  );
}
