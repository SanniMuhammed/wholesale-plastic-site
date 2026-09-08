import { notFound } from "next/navigation";
import { MessageCircle, Mail, Phone, MapPin, Globe2, Clock3 } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getCompanySettings } from "@/lib/cms/settings";
import { generalInquiryLink } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.contact.title, description: dict.meta.contact.description };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const cp = dict.contactPage;
  const settings = await getCompanySettings();
  const whatsappHref = generalInquiryLink(dict);
  const businessHours = locale === "fr" ? settings.business_hours_fr || settings.business_hours_en : settings.business_hours_en || settings.business_hours_fr;

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
      <p className="eyebrow">{dict.nav.contact}</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{cp.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{cp.intro}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
        <div className="divide-y divide-border border-y border-border">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-5 transition-colors hover:text-brand"><MessageCircle size={18} strokeWidth={1.75} className="shrink-0 text-brand" /><div><p className="text-xs text-muted">{cp.whatsappLabel}</p><p className="text-sm font-medium text-ink">{settings.whatsapp_number || dict.nav.whatsapp}</p></div></a>
          {settings.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-4 py-5 transition-colors hover:text-brand"><Mail size={18} strokeWidth={1.75} className="shrink-0 text-brand" /><div><p className="text-xs text-muted">{cp.emailLabel}</p><p className="text-sm font-medium text-ink">{settings.email}</p></div></a>}
          {settings.phone && <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex items-center gap-4 py-5 transition-colors hover:text-brand"><Phone size={18} strokeWidth={1.75} className="shrink-0 text-brand" /><div><p className="text-xs text-muted">{cp.phoneLabel}</p><p className="text-sm font-medium text-ink">{settings.phone}</p></div></a>}
          {settings.address && <div className="flex items-center gap-4 py-5"><MapPin size={18} strokeWidth={1.75} className="shrink-0 text-brand" /><div><p className="text-xs text-muted">{cp.addressLabel}</p><p className="text-sm font-medium text-ink">{settings.address}</p></div></div>}
          {businessHours && <div className="flex items-center gap-4 py-5"><Clock3 size={18} strokeWidth={1.75} className="shrink-0 text-brand" /><div><p className="text-xs text-muted">{locale === "fr" ? "Heures d'ouverture" : "Business hours"}</p><p className="text-sm font-medium text-ink">{businessHours}</p></div></div>}
        </div>

        <aside className="rounded-2xl border border-border bg-brand-light/40 p-5 sm:p-6">
          <p className="eyebrow text-brand">{settings.company_name || "Sherinab Venture"}</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">{locale === "fr" ? "Entreprise au Nigeria, commandes au-delà" : "A Nigerian supplier, serving beyond Nigeria"}</h2>
          {settings.countries_served.length > 0 && <div className="mt-5 flex items-start gap-3"><Globe2 size={17} className="mt-0.5 shrink-0 text-brand" /><div><p className="text-xs text-muted">{locale === "fr" ? "Pays desservis" : "Countries served"}</p><p className="mt-1 text-sm leading-relaxed text-ink">{settings.countries_served.join(" · ")}</p></div></div>}
          <p className="mt-5 text-xs leading-relaxed text-muted">{locale === "fr" ? "Pour les commandes en gros, les demandes personnalisées et les commandes internationales, contactez-nous directement." : "For wholesale orders, custom requirements and international orders, contact us directly."}</p>
        </aside>
      </div>
    </div>
  );
}
