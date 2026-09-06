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
    wrapperClass: "h-40 w-40 sm:h-48 sm:w-48",
  },
  {
    category: "buckets",
    tint: "bg-brand-light",
    ink: "text-brand",
    wrapperClass: "h-28 w-28 sm:h-32 sm:w-32 -ml-8 -mt-16 sm:-ml-10 sm:-mt-20",
  },
  {
    category: "bowls",
    tint: "bg-ochre-light",
    ink: "text-ochre",
    wrapperClass: "h-20 w-20 sm:h-24 sm:w-24 ml-24 -mt-6 sm:ml-28 sm:-mt-8",
  },
];

export function HeroVisual() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative flex items-center justify-center">
        {PIECES.map((piece, i) => (
          <div
            key={i}
            className={`relative flex shrink-0 items-center justify-center rounded-full ${piece.tint} ${piece.wrapperClass}`}
            style={{ zIndex: i }}
          >
            <CategoryIllustration category={piece.category} className={`h-[55%] w-[55%] ${piece.ink}`} />
          </div>
        ))}
      </div>
      <span className="sr-only">Wholesale plastic buckets, basins and bowls</span>
    </div>
  );
}
