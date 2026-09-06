import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { HowItWorksSection } from "@/components/HowItWorksSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.howItWorks.title, description: dict.meta.howItWorks.description };
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div>
      <HowItWorksSection dict={dict} />
      <div className="mx-auto max-w-content px-4 py-12 text-center sm:px-6">
        <Link
          href={`/${locale}/order-summary`}
          className="inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
        >
          {dict.common.reviewOrder}
        </Link>
      </div>
    </div>
  );
}
