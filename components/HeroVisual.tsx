// A deliberately simple stand-in for real product photography: a loose
// grid of solid color blocks in the hues the actual buckets/basins come in.
// Swap this whole component out once real photography is available.
const SWATCHES: { color: string; size: string }[] = [
  { color: "#C0392B", size: "h-24 w-24" },
  { color: "#1C4632", size: "h-16 w-16" },
  { color: "#2E5C8A", size: "h-20 w-20" },
  { color: "#D4A017", size: "h-14 w-14" },
  { color: "#BE7332", size: "h-16 w-16" },
  { color: "#3A3A33", size: "h-12 w-12" },
];

export function HeroVisual() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center rounded border border-border bg-surface p-8">
      <div className="grid grid-cols-3 gap-5">
        {SWATCHES.map((s, i) => (
          <div
            key={i}
            className={`${s.size} rounded-full`}
            style={{ backgroundColor: s.color }}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="sr-only">Wholesale plastic products in a range of colors</span>
    </div>
  );
}
