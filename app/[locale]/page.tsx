export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { getCategoryCoverImageMap } from "@/lib/cms/categories";
import { buildHomepageImageUrl, getHomepageHeroImages, getHomepageFinalCtaImageUrl, listHomepageSections } from "@/lib/cms/settings";
import type { HomepageSection } from "@/lib/cms/types";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ShopByBusiness } from "@/components/ShopByBusiness";
import { WholesaleQuoteCta } from "@/components/WholesaleQuoteCta";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FinalCta } from "@/components/FinalCta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.home.title, description: dict.meta.home.description, alternates: { canonical: `/${rawLocale}`, languages: { en: "/en", fr: "/fr" } } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const [categoryImages, heroImages, finalCtaImage, sections] = await Promise.all([
    getCategoryCoverImageMap(),
    getHomepageHeroImages(),
    getHomepageFinalCtaImageUrl(),
    listHomepageSections(),
  ]);

  const byKey = new Map(sections.map((section) => [section.key, section]));
  const heroSection = byKey.get("hero");
  const trustSection = byKey.get("trust_bar");
  const startBusinessSection = byKey.get("start_business");
  const travelSection = byKey.get("travel");
  const howItWorksSection = byKey.get("how_it_works");
  const deliveryTeaserSection = byKey.get("delivery_teaser");
  const finalCtaSection = byKey.get("final_cta");
  const homepageImage = (section: HomepageSection | undefined, slot: "desktop" | "mobile") => {
    const path = slot === "mobile" ? section?.hero_mobile_image_path : section?.hero_image_path;
    return path ? buildHomepageImageUrl(path) : null;
  };

  return (
    <>
      <Hero locale={locale} dict={dict} categoryImages={categoryImages} heroImage={heroImages.desktop} mobileHeroImage={heroImages.mobile} section={heroSection} />
      <TrustBar dict={dict} section={trustSection} imageUrl={homepageImage(trustSection, "desktop")} mobileImageUrl={homepageImage(trustSection, "mobile")} />
      <ProductCategories locale={locale} dict={dict} categoryImages={categoryImages} />
      <FeaturedProducts locale={locale} dict={dict} />
      <ShopByBusiness locale={locale} dict={dict} section={startBusinessSection} imageUrl={homepageImage(startBusinessSection, "desktop")} mobileImageUrl={homepageImage(startBusinessSection, "mobile")} />
      <WholesaleQuoteCta locale={locale} dict={dict} section={travelSection} imageUrl={homepageImage(travelSection, "desktop")} mobileImageUrl={homepageImage(travelSection, "mobile")} />
      <HowItWorksSection
        locale={locale}
        dict={dict}
        section={howItWorksSection}
        deliverySection={deliveryTeaserSection}
        deliveryImageUrl={finalCtaImage}
        deliveryMobileImageUrl={finalCtaImage}
      />
      <FinalCta locale={locale} dict={dict} section={finalCtaSection} />
    </>
  );
}
