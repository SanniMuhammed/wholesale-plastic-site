import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  navigation: { en: Record<string,string>; fr: Record<string,string>; links: Array<{key:string; href:string; visible?:boolean}> };
  footer: { en: Record<string,string>; fr: Record<string,string> };
  translations: { en: Record<string,string>; fr: Record<string,string> };
  seo: { en: { title:string; description:string; ogTitle:string; ogDescription:string; }; fr: { title:string; description:string; ogTitle:string; ogDescription:string; } };
};

export const defaultSiteSettings: SiteSettings = {
  navigation: { en: { products:"Products", about:"About", contact:"Contact", whatsapp:"WhatsApp", reviewOrder:"Review Order" }, fr: { products:"Produits", about:"À propos", contact:"Contact", whatsapp:"WhatsApp", reviewOrder:"Voir la commande" }, links:[{key:"products",href:"/products"},{key:"about",href:"/about"},{key:"contact",href:"/contact"}] },
  footer: { en: { mission:"We connect Nigerian products and opportunity with businesses in Nigeria and beyond.", productsHeading:"Products", businessHeading:"Business", companyHeading:"Company", locationHeading:"Location" }, fr: { mission:"Nous rapprochons les produits et les opportunités du Nigeria des entreprises au Nigeria et au-delà.", productsHeading:"Produits", businessHeading:"Entreprise", companyHeading:"Société", locationHeading:"Adresse" } },
  translations: { en:{}, fr:{} },
  seo: { en:{title:"Sherinab Venture",description:"Wholesale plastic products for businesses in Nigeria and beyond.",ogTitle:"Sherinab Venture",ogDescription:"Wholesale plastic products for businesses in Nigeria and beyond."}, fr:{title:"Sherinab Venture",description:"Produits plastiques en gros pour les entreprises au Nigeria et au-delà.",ogTitle:"Sherinab Venture",ogDescription:"Produits plastiques en gros pour les entreprises au Nigeria et au-delà."} },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("navigation,footer,translations,seo").eq("id",1).single();
    if (!data) return defaultSiteSettings;

    const navigation = data.navigation ?? {};
    const footer = data.footer ?? {};
    const translations = data.translations ?? {};
    const seo = data.seo ?? {};

    return {
      navigation: {
        ...defaultSiteSettings.navigation,
        ...navigation,
        en: { ...defaultSiteSettings.navigation.en, ...(navigation.en ?? {}) },
        fr: { ...defaultSiteSettings.navigation.fr, ...(navigation.fr ?? {}) },
        links: Array.isArray(navigation.links) ? navigation.links : defaultSiteSettings.navigation.links,
      },
      footer: {
        ...defaultSiteSettings.footer,
        ...footer,
        en: { ...defaultSiteSettings.footer.en, ...(footer.en ?? {}) },
        fr: { ...defaultSiteSettings.footer.fr, ...(footer.fr ?? {}) },
      },
      translations: {
        ...defaultSiteSettings.translations,
        ...translations,
        en: { ...defaultSiteSettings.translations.en, ...(translations.en ?? {}) },
        fr: { ...defaultSiteSettings.translations.fr, ...(translations.fr ?? {}) },
      },
      seo: {
        ...defaultSiteSettings.seo,
        ...seo,
        en: { ...defaultSiteSettings.seo.en, ...(seo.en ?? {}) },
        fr: { ...defaultSiteSettings.seo.fr, ...(seo.fr ?? {}) },
      },
    };
  } catch { return defaultSiteSettings; }
}

export async function updateSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").update(input).eq("id",1).select("navigation,footer,translations,seo").single();
  if (error) throw error;
  return data as SiteSettings;
}
