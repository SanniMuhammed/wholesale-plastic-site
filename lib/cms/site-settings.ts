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
    return {
      navigation: { ...defaultSiteSettings.navigation, ...(data.navigation ?? {}) },
      footer: { ...defaultSiteSettings.footer, ...(data.footer ?? {}) },
      translations: { ...defaultSiteSettings.translations, ...(data.translations ?? {}) },
      seo: { ...defaultSiteSettings.seo, ...(data.seo ?? {}) },
    };
  } catch { return defaultSiteSettings; }
}

export async function updateSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").update(input).eq("id",1).select("navigation,footer,translations,seo").single();
  if (error) throw error;
  return data as SiteSettings;
}
