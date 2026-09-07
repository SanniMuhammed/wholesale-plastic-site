/** @type {import('next').NextConfig} */

// Derived from NEXT_PUBLIC_SUPABASE_URL when set. Keep the config resilient to
// an unset or temporarily malformed Vercel environment variable so a deploy
// cannot fail before the application code is even built.
let supabaseHostname = "*.supabase.co";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  try {
    supabaseHostname = new URL(supabaseUrl).hostname;
  } catch {
    // Keep the safe wildcard fallback; runtime Supabase access will surface
    // any genuinely invalid configuration instead of breaking the build.
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
};

export default nextConfig;
