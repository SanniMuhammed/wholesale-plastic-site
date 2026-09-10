import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getWholesaleContent } from "@/lib/cms/settings";
import { DEFAULT_ABOUT } from "@/components/admin/AboutContentForm";

type AboutContent = { intro: string; sections: Array<{ heading: string; body: string }> };
function parseAbout(value: string, fallback: AboutContent): AboutContent {
  try {
    const parsed = JSON.parse(value);
    if (parsed?.intro && Array.isArray(parsed.sections) && parsed.sections.length === 4) return parsed;
  } catch {}
  return fallback;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.about.title, description: dict.meta.about.description, alternates: { canonical: `/${rawLocale}/about` } };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const content = await getWholesaleContent().catch(() => null);
  const fallback = locale === "fr" ? DEFAULT_ABOUT.fr : DEFAULT_ABOUT.en;
  const about = parseAbout(content?.[locale === "fr" ? "body_fr" : "body_en"] ?? "", fallback);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">{dict.footer.aboutUs}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{locale === "fr" ? "À propos de nous" : "About Us"}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:mt-4">{about.intro}</p>
      <div className="mt-9 grid gap-x-10 gap-y-8 border-t border-border pt-7 sm:mt-12 sm:gap-y-10 sm:pt-8 sm:grid-cols-2">
        {about.sections.map((section, i) => (
          <div key={`${section.heading}-${i}`}>
            <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-2 font-display text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
