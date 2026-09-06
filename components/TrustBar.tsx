import { MapPin, Package, Truck, MessageCircle } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const ICONS = [MapPin, Package, Truck, MessageCircle];

export function TrustBar({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-content grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
        {dict.trustBar.items.map((item, i) => {
          const Icon = ICONS[i] ?? Package;
          return (
            <div
              key={item}
              className="flex items-center gap-3 border-b border-border px-4 py-5 sm:border-b-0 sm:px-6"
            >
              <Icon size={20} strokeWidth={1.5} className="shrink-0 text-brand" />
              <span className="text-sm font-medium text-ink-soft">{item}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
