import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { PathIllustration, type BusinessPath } from "@/components/illustrations/PathIllustration";
import { cx } from "@/lib/utils";

// Each customer path gets its own tint and ink colour, reusing the same
// three accent hues HeroVisual already uses for basins/buckets/bowls --
// so the distinction reads as "three different swatches" rather than
// three arbitrary new colours. Scale runs light-to-deep with the path:
// a first order (Start), a repeat cycle (Restock), then the deepest,
// most established relationship (Distribute) in the brand colour itself.
const PATHS: { key: BusinessPath; tint: string; ink: string }[] = [
  { key: "start", tint: "bg-clay-light", ink: "text-clay" },
  { key: "restock", tint: "bg-ochre-light", ink: "text-ochre" },
  { key: "distribute", tint: "bg-brand-light", ink: "text-brand" },
];

export function StartBusinessSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  const segments = dict.startBusiness.segments;

  return (
    <section className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
      {/* The "you don't need to travel to Nigeria" pitch already runs in
          TravelSection just above this on the homepage, so this section
          opens straight into the title and the Start/Restock/Distribute
          panels instead of making the same case a second time. */}
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {dict.startBusiness.title}
        </h2>
        <p className="mt-3 text-muted">{dict.startBusiness.body}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
        {PATHS.map(({ key, tint, ink }, i) => {
          const segment = segments[key];
          return (
            <div key={key} className={cx("flex flex-col px-5 py-6 sm:px-6 sm:py-7", tint)}>
              <div className="flex items-start justify-between gap-3">
                <span className={cx("font-mono text-xs font-bold", ink)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <PathIllustration path={key} className={cx("h-10 w-10 shrink-0 sm:h-11 sm:w-11", ink)} />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-ink sm:text-2xl">
                {segment.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{segment.description}</p>
            </div>
          );
        })}
      </div>

      <Link
        href={`${base}/order-summary`}
        className="mt-10 inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark"
      >
        {dict.startBusiness.cta}
      </Link>
    </section>
  );
}
