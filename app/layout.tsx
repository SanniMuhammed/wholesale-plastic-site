import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Sherinab Venture — Wholesale Plastic Products in Nigeria & Beyond",
  description: "Sherinab Venture supplies wholesale plastic products to businesses anywhere in Nigeria and to customers beyond Nigeria.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${spaceMono.variable}`}>
      <body className="bg-background font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
