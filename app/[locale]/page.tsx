export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getCategoryCoverImageMap } from "@/lib/cms/categories";
import { getHomepageHeroImages } from "@/lib/cms/settings";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ShopByBusiness } from "@/components/ShopByBusiness";
import { WholesaleQuoteCta } from "@/components/WholesaleQuoteCta";
import { TravelSection } from "@/components/TravelSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { StartBusinessSection } from "@/components/StartBusinessSection";
import { DeliveryTeaser } from "@/components/DeliveryTeaser";
import { FinalCta } from "@/components/FinalCta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.home.title, description: dict.meta.home.description };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const [categoryImages, heroImages] = await Promise.all([
    getCategoryCoverImageMap(),
    getHomepageHeroImages(),
  ]);

  return (
    <>
      <Hero locale={locale} dict={dict} categoryImages={categoryImages} heroImage={heroImages.desktop} mobileHeroImage={heroImages.mobile} />
      <TrustBar dict={dict} />
      <ProductCategories locale={locale} dict={dict} categoryImages={categoryImages} />
      <FeaturedProducts locale={locale} dict={dict} />
      <ShopByBusiness locale={locale} />
      <WholesaleQuoteCta locale={locale} dict={dict} />
      <TravelSection dict={dict} />
      <HowItWorksSection dict={dict} />
      <StartBusinessSection locale={locale} dict={dict} />
      <DeliveryTeaser locale={locale} dict={dict} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
