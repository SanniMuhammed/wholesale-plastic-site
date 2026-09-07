import { notFound } from "next/navigation";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
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

  const whatsappHref = generalInquiryLink(dict);
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@example.com";
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "";
  const address = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "";

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <p className="eyebrow">{dict.nav.contact}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{cp.title}</h1>
      <p className="mt-4 max-w-xl text-muted">{cp.intro}</p>

      <div className="mt-10 max-w-md divide-y divide-border border-t border-border">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-4 transition-colors hover:text-brand"
        >
          <MessageCircle size={16} strokeWidth={1.75} className="shrink-0 text-brand" />
          <div>
            <p className="text-xs text-muted">{cp.whatsappLabel}</p>
            <p className="text-sm font-medium text-ink">{dict.nav.whatsapp}</p>
          </div>
        </a>
        <a href={`mailto:${email}`} className="flex items-center gap-3 py-4 transition-colors hover:text-brand">
          <Mail size={16} strokeWidth={1.75} className="shrink-0 text-brand" />
          <div>
            <p className="text-xs text-muted">{cp.emailLabel}</p>
            <p className="text-sm font-medium text-ink">{email}</p>
          </div>
        </a>
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-3 py-4 transition-colors hover:text-brand"
          >
            <Phone size={16} strokeWidth={1.75} className="shrink-0 text-brand" />
            <div>
              <p className="text-xs text-muted">{cp.phoneLabel}</p>
              <p className="text-sm font-medium text-ink">{phone}</p>
            </div>
          </a>
        )}
        {address && (
          <div className="flex items-center gap-3 py-4">
            <MapPin size={16} strokeWidth={1.75} className="shrink-0 text-brand" />
            <div>
              <p className="text-xs text-muted">{cp.addressLabel}</p>
              <p className="text-sm font-medium text-ink">{address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
