import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { HowItWorksSection } from "@/components/HowItWorksSection";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return { title: dict.meta.howItWorks.title, description: dict.meta.howItWorks.description };
}

export default function HowItWorksPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
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
