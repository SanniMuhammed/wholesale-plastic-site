import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { OrderSummaryClient } from "@/components/OrderSummaryClient";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return { title: dict.meta.orderSummary.title, description: dict.meta.orderSummary.description };
}

export default function OrderSummaryPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{dict.orderSummaryPage.title}</h1>
      <p className="mt-3 max-w-xl text-muted">{dict.orderSummaryPage.intro}</p>
      <div className="mt-10">
        <OrderSummaryClient locale={locale} dict={dict} />
      </div>
    </div>
  );
}
