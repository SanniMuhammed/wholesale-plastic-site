"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export function ProductGallery({ images, name, locale }: { images: string[]; name: string; locale: Locale }) {
  const [active, setActive] = useState(0);
  const safeImages = images.filter(Boolean);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    thumbnailRefs.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  if (safeImages.length === 0) return null;

  const photoLabel = locale === "fr" ? "photo" : "photo";
  const alt = `${name} — ${locale === "fr" ? "photo du produit" : "product photo"}`;

  function previous() {
    setActive((current) => (current - 1 + safeImages.length) % safeImages.length);
  }

  function next() {
    setActive((current) => (current + 1) % safeImages.length);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="relative aspect-square">
          <Image
            src={safeImages[active] ?? safeImages[0]}
            alt={alt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label={locale === "fr" ? "Photo précédente" : "Previous photo"}
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={locale === "fr" ? "Photo suivante" : "Next photo"}
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <ChevronRight size={19} />
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] font-medium text-white backdrop-blur-sm">
                {active + 1} / {safeImages.length}
              </span>
            </>
          )}
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 -mx-1 overflow-x-auto px-1 pb-1">
          <div className="flex w-max gap-2">
            {safeImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
                ref={(node) => {
                  thumbnailRefs.current[index] = node;
                }}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${name} ${photoLabel} ${index + 1}`}
                aria-current={active === index ? "true" : undefined}
                className={cx(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-surface transition sm:h-24 sm:w-24",
                  active === index
                    ? "border-brand ring-2 ring-brand ring-offset-1"
                    : "border-border opacity-80 hover:border-brand/40 hover:opacity-100"
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
