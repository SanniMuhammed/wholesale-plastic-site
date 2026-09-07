import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.about.title, description: dict.meta.about.description };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const ap = dict.aboutPage;
  const [lede, ...rest] = ap.sections;

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <p className="eyebrow">{dict.footer.aboutUs}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{ap.title}</h1>
      <p className="mt-4 max-w-xl text-sm italic text-muted">{ap.placeholderNote}</p>

      {lede && (
        <div className="mt-12 max-w-2xl border-t-2 border-border pt-8">
          <span className="font-mono text-xs font-bold text-brand">01</span>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">{lede.heading}</h2>
          <p className="mt-3 font-display text-xl leading-relaxed text-ink-soft sm:text-2xl">{lede.body}</p>
        </div>
      )}

      <div className="mt-10 grid gap-x-10 gap-y-10 border-t border-border pt-8 sm:grid-cols-2">
        {rest.map((section, i) => (
          <div key={section.heading}>
            <span className="font-mono text-xs font-bold text-brand">{String(i + 2).padStart(2, "0")}</span>
            <h2 className="mt-2 font-display text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2 text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
