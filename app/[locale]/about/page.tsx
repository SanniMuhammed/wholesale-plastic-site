import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return { title: dict.meta.about.title, description: dict.meta.about.description };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const ap = dict.aboutPage;

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{ap.title}</h1>
      <p className="mt-3 max-w-xl text-sm italic text-muted">{ap.placeholderNote}</p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {ap.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2 text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
