import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { OrderProvider } from "@/components/OrderProvider";
import { CartUIProvider } from "@/components/cart/CartUIProvider";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getAllProducts } from "@/lib/catalog/products";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return {
    title: { default: dict.meta.home.title, template: `%s | ${dict.meta.home.title}` },
    description: dict.meta.home.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const products = await getAllProducts();

  return (
    <OrderProvider>
      <HtmlLangSync locale={locale} />
      <CartUIProvider locale={locale} dict={dict} products={products}>
        <div className="flex min-h-screen flex-col">
          <Nav locale={locale} dict={dict} />
          <main>{children}</main>
          <Footer locale={locale} dict={dict} />
        </div>
      </CartUIProvider>
    </OrderProvider>
  );
}
