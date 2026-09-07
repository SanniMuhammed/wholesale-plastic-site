import type { Dictionary } from "@/lib/getDictionary";
import { CategoryIllustration } from "@/components/illustrations/CategoryIllustration";

const PIECES: { category: "basins" | "buckets" | "bowls"; tint: string; ink: string; wrapperClass: string; fallbackImage?: string }[] = [
  { category: "basins", tint: "bg-clay-light", ink: "text-clay", wrapperClass: "h-40 w-40 sm:h-56 sm:w-56", fallbackImage: "/product-images/40l-large-basin.jpg" },
  { category: "buckets", tint: "bg-brand-light", ink: "text-brand", wrapperClass: "h-28 w-28 sm:h-36 sm:w-36 -ml-8 -mt-16 sm:-ml-12 sm:-mt-24", fallbackImage: "/product-images/15l-bucket-with-lid.jpg" },
  { category: "bowls", tint: "bg-ochre-light", ink: "text-ochre", wrapperClass: "h-20 w-20 sm:h-28 sm:w-28 ml-24 -mt-6 sm:ml-32 sm:-mt-10" },
];

export function HeroVisual({ dict, categoryImages, heroImage, mobileHeroImage }: { dict: Dictionary; categoryImages?: Record<string, string>; heroImage?: string | null; mobileHeroImage?: string | null }) {
  if (heroImage || mobileHeroImage) {
    const desktop = heroImage ?? mobileHeroImage;
    const mobile = mobileHeroImage ?? heroImage;
    return (
      <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-lg border border-border shadow-lifted aspect-[4/3] lg:aspect-[16/6]">
        <picture>
          <source media="(max-width: 1023px)" srcSet={mobile ?? desktop ?? ""} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={desktop ?? ""} alt="" className="h-full w-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="eyebrow absolute bottom-4 left-4 rounded border border-white/40 bg-black/25 px-2 py-1 text-[10px] text-white backdrop-blur-sm">{dict.categories.buckets}, {dict.categories.basins} &amp; {dict.categories.bowls}</span>
        <span className="sr-only">Wholesale plastic products</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center overflow-visible">
      <div className="relative flex items-center justify-center">
        {PIECES.map((piece, i) => {
          const photoUrl = categoryImages?.[piece.category] ?? piece.fallbackImage;
          return <div key={piece.category} className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${piece.tint} ${piece.wrapperClass}`} style={{ zIndex: i }}>{photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : <CategoryIllustration category={piece.category} className={`h-[55%] w-[55%] ${piece.ink}`} />}</div>;
        })}
        <span className="eyebrow absolute -right-2 top-1 rotate-3 rounded border border-border bg-surface px-2 py-1 text-[10px] sm:-right-4 sm:top-4">{dict.categories.bowls}</span>
        <span className="eyebrow absolute -left-2 bottom-2 -rotate-2 rounded border border-border bg-surface px-2 py-1 text-[10px] sm:-left-4 sm:bottom-6">{dict.categories.buckets}</span>
      </div>
      <span className="sr-only">Wholesale plastic buckets, basins and bowls</span>
    </div>
  );
}
