/** @type {import('next').NextConfig} */

let supabaseHostname = "*.supabase.co";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  try {
    supabaseHostname = new URL(supabaseUrl).hostname;
  } catch {
    // Keep the safe wildcard fallback.
  }
}

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "cdn11.bigcommerce.com", pathname: "/**" },
      { protocol: "https", hostname: "heroplast.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ebayimg.com", pathname: "/**" },
      { protocol: "https", hostname: "www.isplatech.co.kr", pathname: "/**" },
      { protocol: "https", hostname: "assets.laicms.com", pathname: "/**" },
      { protocol: "https", hostname: "s.alicdn.com", pathname: "/**" },
      { protocol: "https", hostname: "bakehouse.pk", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/:locale/wholesale", destination: "/:locale", permanent: true },
      { source: "/:locale/products/category/:slug", destination: "/:locale/products?category=:slug", permanent: true },
    ];
  },
};

export default nextConfig;
