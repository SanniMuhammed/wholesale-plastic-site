import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { TravelSection } from "@/components/TravelSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { StartBusinessSection } from "@/components/StartBusinessSection";
import { DeliveryTeaser } from "@/components/DeliveryTeaser";
import { FinalCta } from "@/components/FinalCta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return { title: dict.meta.home.title, description: dict.meta.home.description };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <TrustBar dict={dict} />
      <ProductCategories locale={locale} dict={dict} />
      <FeaturedProducts locale={locale} dict={dict} />
      <TravelSection dict={dict} />
      <HowItWorksSection dict={dict} />
      <StartBusinessSection locale={locale} dict={dict} />
      <DeliveryTeaser locale={locale} dict={dict} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
