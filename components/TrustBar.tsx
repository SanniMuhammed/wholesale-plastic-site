import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";

export function TrustBar({ dict, section, imageUrl, mobileImageUrl }: { dict: Dictionary; section?: HomepageSection; imageUrl?: string | null; mobileImageUrl?: string | null }) {
  if (section?.is_visible === false) return null;
  return (
    <section className="border-y border-border bg-surface">
      {imageUrl && <picture className="mx-auto block max-w-content overflow-hidden border-b border-border">{mobileImageUrl && <source media="(max-width: 640px)" srcSet={mobileImageUrl} />}<img src={imageUrl} alt="" className="h-auto max-h-48 w-full object-cover" loading="lazy" /></picture>}
      <div className="mx-auto grid max-w-content grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-border">
        {dict.trustBar.items.map((item, i) => <div key={item} className="flex items-baseline gap-2.5 border-b border-border px-4 py-5 sm:border-b-0 sm:px-6"><span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span><span className="text-sm font-medium text-ink-soft">{item}</span></div>)}
      </div>
    </section>
  );
}
