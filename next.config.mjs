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
  experimental: {
    serverActions: {
      // Image uploads use Server Actions; the Next.js default is 1MB.
      bodySizeLimit: "10mb",
    },
  },
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
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "invopak.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.ikh.fi", pathname: "/**" },
      { protocol: "https", hostname: "cms.celloworld.com", pathname: "/**" },
      { protocol: "https", hostname: "www.sammart.us", pathname: "/**" },
      { protocol: "https", hostname: "decoplast.in", pathname: "/**" },
      { protocol: "https", hostname: "dcdn-us.mitiendanube.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn-881a96c5-a77b871b.commercebuild.com", pathname: "/**" },
      { protocol: "https", hostname: "digitalcontent.api.tesco.com", pathname: "/**" },
      { protocol: "https", hostname: "www.rundb.de", pathname: "/**" },
      { protocol: "https", hostname: "tiimg.tistatic.com", pathname: "/**" },
      { protocol: "https", hostname: "cpimg.tistatic.com", pathname: "/**" },
      { protocol: "https", hostname: "ikrorwxhijilll5q.leadongcdn.com", pathname: "/**" },
      { protocol: "https", hostname: "hoefer-shop.com", pathname: "/**" },
      { protocol: "https", hostname: "d3m9l0v76dty0.cloudfront.net", pathname: "/**" },
      { protocol: "https", hostname: "www.woodies.ie", pathname: "/**" },
      { protocol: "https", hostname: "www.inomata-k.co.jp", pathname: "/**" },
      { protocol: "https", hostname: "cdn.velleman.eu", pathname: "/**" },
      { protocol: "https", hostname: "bosspakistan.com", pathname: "/**" },
      { protocol: "https", hostname: "sse-20517.kxcdn.com", pathname: "/**" },
      { protocol: "https", hostname: "bilgemutfak.com", pathname: "/**" },
      { protocol: "https", hostname: "lntsufin.com", pathname: "/**" },
      { protocol: "https", hostname: "udm.market", pathname: "/**" },
      { protocol: "https", hostname: "nagarbazaar.com", pathname: "/**" },
      { protocol: "https", hostname: "www.dolphinnepal.com", pathname: "/**" },
      { protocol: "https", hostname: "st.bigc-cs.com", pathname: "/**" },
      { protocol: "https", hostname: "shop.senoeseno.it", pathname: "/**" },
      { protocol: "https", hostname: "www.hartstores.com", pathname: "/**" },
      { protocol: "https", hostname: "agrifournitures.fr", pathname: "/**" },
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
