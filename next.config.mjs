/** @type {import('next').NextConfig} */

// Derived from NEXT_PUBLIC_SUPABASE_URL when set (e.g. in CI without real
// secrets, this falls back to the wildcard pattern below so the build
// still succeeds -- see ADMIN_SETUP.md).
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

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
