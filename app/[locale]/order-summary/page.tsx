import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { OrderSummaryClient } from "@/components/OrderSummaryClient";
import { WhatsAppDirectMode } from "@/components/WhatsAppDirectMode";
import { getAllProducts } from "@/lib/catalog/products";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.orderSummary.title, description: dict.meta.orderSummary.description };
}

export default async function OrderSummaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <WhatsAppDirectMode />
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{dict.orderSummaryPage.title}</h1>
      <p className="mt-3 max-w-xl text-muted">{dict.orderSummaryPage.intro}</p>
      <div className="mt-10">
        <OrderSummaryClient locale={locale} dict={dict} products={products} />
      </div>
    </div>
  );
}
