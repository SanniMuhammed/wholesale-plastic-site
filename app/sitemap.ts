import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getAllProducts } from "@/lib/catalog/products";

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "https://wholesale-plastic-site-two.vercel.app";
  return configured.startsWith("http") ? configured.replace(/\/$/, "") : `https://${configured.replace(/\/$/, "")}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const products = await getAllProducts();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(
      { url: `${base}/${locale}`, changeFrequency: "weekly", priority: 1 },
      { url: `${base}/${locale}/products`, changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/${locale}/how-it-works`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/${locale}/wholesale`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${base}/${locale}/delivery`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${base}/${locale}/about`, changeFrequency: "monthly", priority: 0.5 },
      { url: `${base}/${locale}/contact`, changeFrequency: "monthly", priority: 0.5 },
    );

    for (const product of products) {
      entries.push({ url: `${base}/${locale}/products/${product.slug}`, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  return entries;
}
