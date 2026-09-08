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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/:locale/wholesale", destination: "/:locale", permanent: true },
      { source: "/:locale/delivery", destination: "/:locale/how-it-works", permanent: true },
    ];
  },
};

export default nextConfig;
