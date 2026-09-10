import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`),
  title: "Sherinab Venture — Wholesale Plastic Products in Nigeria & Beyond",
  description: "Sherinab Venture supplies wholesale plastic products to businesses anywhere in Nigeria and to customers beyond Nigeria.",
  applicationName: "Sherinab Venture",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Sherinab Venture",
    title: "Sherinab Venture — Wholesale Plastic Products in Nigeria & Beyond",
    description: "Wholesale plastic products for businesses in Nigeria and beyond.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Sherinab Venture — Wholesale Plastic Products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherinab Venture — Wholesale Plastic Products in Nigeria & Beyond",
    description: "Wholesale plastic products for businesses in Nigeria and beyond.",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${spaceMono.variable}`}>
      <body className="bg-background font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
