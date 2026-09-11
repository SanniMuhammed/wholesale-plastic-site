import Image from "next/image";
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
      <div className="absolute inset-0 overflow-hidden rounded-none border-0 shadow-none" aria-hidden="true">
        <picture className="block h-full w-full">
          <source media="(max-width: 639px)" srcSet={mobile ?? desktop ?? ""} />
          <Image
            src={desktop ?? ""}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] transition-transform duration-700 min-[640px]:object-[68%_center]"
          />
        </picture>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,245,239,0.98)_0%,rgba(247,245,239,0.9)_28%,rgba(247,245,239,0.58)_50%,rgba(247,245,239,0.18)_72%,rgba(247,245,239,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_44%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,27,23,0.03)_0%,rgba(27,27,23,0)_62%,rgba(27,27,23,0.2)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent" />
        <span className="sr-only">Wholesale plastic products in Nigeria</span>
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
