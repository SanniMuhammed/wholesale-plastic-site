"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export function ProductGallery({ images, name, locale }: { images: string[]; name: string; locale: Locale }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<number[]>([]);
  const safeImages = images.filter(Boolean);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    thumbnailRefs.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  if (safeImages.length === 0) return null;

  const available = safeImages
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => !failed.includes(index));
  const activeAvailableIndex = available.findIndex(({ index }) => index === active);
  const current = available[activeAvailableIndex >= 0 ? activeAvailableIndex : 0];

  if (!current) return null;

  const photoLabel = locale === "fr" ? "photo" : "photo";
  const alt = `${name} — ${locale === "fr" ? "photo du produit" : "product photo"}`;

  function markFailed(index: number) {
    setFailed((currentFailed) => currentFailed.includes(index) ? currentFailed : [...currentFailed, index]);
    setActive((currentActive) => {
      if (currentActive !== index) return currentActive;
      const nextAvailable = safeImages.findIndex((_, candidate) => candidate !== index && !failed.includes(candidate));
      return nextAvailable >= 0 ? nextAvailable : currentActive;
    });
  }

  function previous() {
    if (available.length < 2) return;
    const currentPosition = Math.max(0, activeAvailableIndex);
    setActive(available[(currentPosition - 1 + available.length) % available.length].index);
  }

  function next() {
    if (available.length < 2) return;
    const currentPosition = Math.max(0, activeAvailableIndex);
    setActive(available[(currentPosition + 1) % available.length].index);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="relative aspect-square sm:aspect-[4/3]">
          <img
            src={current.src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => markFailed(current.index)}
          />
          {available.length > 1 && <>
            <button type="button" onClick={previous} aria-label={locale === "fr" ? "Photo précédente" : "Previous photo"} className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"><ChevronLeft size={18} /></button>
            <button type="button" onClick={next} aria-label={locale === "fr" ? "Photo suivante" : "Next photo"} className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"><ChevronRight size={18} /></button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] font-medium text-white backdrop-blur-sm">{activeAvailableIndex + 1} / {available.length}</span>
          </>}
        </div>
      </div>

      {available.length > 1 && <div className="mt-3 -mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><div className="flex w-max gap-2">
        {available.map(({ src, index }, position) => <button key={`${src}-${index}`} ref={(node) => { thumbnailRefs.current[index] = node; }} type="button" onClick={() => setActive(index)} aria-label={`${name} ${photoLabel} ${position + 1}`} aria-current={active === index ? "true" : undefined} className={cx("relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-surface transition sm:h-20 sm:w-20", active === index ? "border-brand ring-2 ring-brand ring-offset-1" : "border-border opacity-75 hover:border-brand/40 hover:opacity-100")}><img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => markFailed(index)} /></button>)}
      </div></div>}
    </div>
  );
}
