"use client";

import Image from "next/image";
import { useState } from "react";
import { cx } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export function ProductGallery({ images, name, locale }: { images: string[]; name: string; locale: Locale }) {
  const [active, setActive] = useState(0);
  const safeImages = images.filter(Boolean);
  if (safeImages.length === 0) return null;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="relative aspect-square">
          <Image src={safeImages[active] ?? safeImages[0]} alt={`${name} — ${locale === "fr" ? "photo du produit" : "product photo"}`} fill priority className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
        </div>
      </div>
      {safeImages.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {safeImages.slice(0, 5).map((src, index) => (
            <button key={`${src}-${index}`} type="button" onClick={() => setActive(index)} aria-label={`${name} ${locale === "fr" ? "photo" : "photo"} ${index + 1}`} aria-pressed={active === index} className={cx("relative aspect-square overflow-hidden rounded-lg border bg-surface transition", active === index ? "border-brand ring-1 ring-brand" : "border-border hover:border-brand/40")}>
              <Image src={src} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
