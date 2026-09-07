import type { Dictionary } from "@/lib/getDictionary";
import { CategoryIllustration } from "@/components/illustrations/CategoryIllustration";

// A deliberately simple stand-in for real product photography: an
// overlapping composition of actual product silhouettes (bucket, basin,
// bowl) rather than unlabeled color dots, so the visual explains what the
// business sells even before real photography is available.
const PIECES: {
  category: "buckets" | "basins" | "bowls";
  tint: string;
  ink: string;
  wrapperClass: string;
}[] = [
  {
    category: "basins",
    tint: "bg-clay-light",
    ink: "text-clay",
    wrapperClass: "h-40 w-40 sm:h-56 sm:w-56",
  },
  {
    category: "buckets",
    tint: "bg-brand-light",
    ink: "text-brand",
    wrapperClass: "h-28 w-28 sm:h-36 sm:w-36 -ml-8 -mt-16 sm:-ml-12 sm:-mt-24",
  },
  {
    category: "bowls",
    tint: "bg-ochre-light",
    ink: "text-ochre",
    wrapperClass: "h-20 w-20 sm:h-28 sm:w-28 ml-24 -mt-6 sm:ml-32 sm:-mt-10",
  },
];

export function HeroVisual({
  dict,
  categoryImages,
}: {
  dict: Dictionary;
  categoryImages?: Record<string, string>;
}) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center overflow-visible">
      <div className="relative flex items-center justify-center">
        {PIECES.map((piece, i) => {
          const photoUrl = categoryImages?.[piece.category];
          return (
            <div
              key={i}
              className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${piece.tint} ${piece.wrapperClass}`}
              style={{ zIndex: i }}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <CategoryIllustration category={piece.category} className={`h-[55%] w-[55%] ${piece.ink}`} />
              )}
            </div>
          );
        })}

        {/* Hand-labelled annotations, like a margin note on a catalogue
            plate -- reuses the same rotated-tag language as the hero
            eyebrow so the whole composition reads as one system. */}
        <span className="eyebrow absolute -right-2 top-1 rotate-3 rounded border border-border bg-surface px-2 py-1 text-[10px] sm:-right-4 sm:top-4">
          {dict.categories.bowls}
        </span>
        <span className="eyebrow absolute -left-2 bottom-2 -rotate-2 rounded border border-border bg-surface px-2 py-1 text-[10px] sm:-left-4 sm:bottom-6">
          {dict.categories.buckets}
        </span>
      </div>
      <span className="sr-only">Wholesale plastic buckets, basins and bowls</span>
    </div>
  );
}
