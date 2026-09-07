import type { Dictionary } from "@/lib/getDictionary";

export function TrustBar({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-content grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-border">
        {dict.trustBar.items.map((item, i) => (
          <div
            key={item}
            className="flex items-baseline gap-2.5 border-b border-border px-4 py-5 sm:border-b-0 sm:px-6"
          >
            <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium text-ink-soft">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
