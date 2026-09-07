import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Editorial display serif for headlines, section titles and the wordmark --
// used via the `display` font-family token, so it cascades to every
// existing `font-display` class without touching each component.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// A "manifest" monospace, reserved for data-like content: capacities, SKU
// specs, quantities and the printable order receipt -- the typographic
// nod to a trade/shipping document rather than decorative labelling.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wholesale Plastic Products",
  description: "Wholesale plastic products from Nigeria to West Africa.",
};

// This is the one root layout Next.js allows to render <html>/<body>.
// Locale-specific content (nav, footer, per-page metadata) lives in
// app/[locale]/layout.tsx and below; see components/HtmlLangSync.tsx for
// how `lang` gets synced once the locale is known.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${spaceMono.variable}`}>
      <body className="bg-background font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
