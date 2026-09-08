import type { MetadataRoute } from "next";

function getSiteUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!configured) return undefined;
  return configured.startsWith("http") ? configured : `https://${configured}`;
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const base = siteUrl?.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
