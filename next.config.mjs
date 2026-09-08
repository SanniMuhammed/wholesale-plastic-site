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
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/:locale/wholesale", destination: "/:locale", permanent: true },
      { source: "/:locale/delivery", destination: "/:locale/how-it-works", permanent: true },
      { source: "/:locale/products/category/:slug", destination: "/:locale/products?category=:slug", permanent: true },
    ];
  },
};

export default nextConfig;
