import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

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
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-background font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
