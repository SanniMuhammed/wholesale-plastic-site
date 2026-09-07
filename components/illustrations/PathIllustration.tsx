import type { SVGProps } from "react";

type IllustrationProps = SVGProps<SVGSVGElement>;

/**
 * Motifs for the three business-path panels (Start / Restock / Distribute).
 * Same hand-drawn, single-weight line language as CategoryIllustration --
 * currentColor strokes, slightly irregular paths, secondary detail lines at
 * reduced opacity -- but each one is a scale/quantity motif rather than a
 * product silhouette, so it reads as "how much" rather than "what".
 */

function StartMotif(props: IllustrationProps) {
  // A single crate, just placed -- with a small radiating mark above it
  // standing in for "new" / "first order", not a generic sparkle icon.
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <rect x="38" y="54" width="44" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M38 54 L60 42 L82 54"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M60 42 L60 54" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M60 25 L60 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M49 31 L55 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M71 31 L65 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function RestockMotif(props: IllustrationProps) {
  // Two crates offset like an actual stack, plus a small cycle arrow --
  // replenishment as a repeating motion rather than a single delivery.
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <rect x="28" y="62" width="38" height="30" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="54" y="38" width="38" height="30" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M28 62 L47 53 L66 62" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M54 38 L73 29 L92 38" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path
        d="M78 20 Q92 21 91 35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M85 33 L91 35 L94 29"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

function DistributeMotif(props: IllustrationProps) {
  // A pallet-like grid of units on a baseline, fading at the edge to
  // suggest scale extending beyond the frame -- warehouse quantity rather
  // than a single named product.
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <path d="M18 94 L102 94" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="24" y="68" width="24" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="52" y="68" width="24" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="80" y="68" width="16" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" opacity="0.5" />
      <rect x="38" y="42" width="24" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="66" y="42" width="24" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" opacity="0.5" />
    </svg>
  );
}

export type BusinessPath = "start" | "restock" | "distribute";

const PATH_ILLUSTRATIONS: Record<BusinessPath, (props: IllustrationProps) => JSX.Element> = {
  start: StartMotif,
  restock: RestockMotif,
  distribute: DistributeMotif,
};

export function PathIllustration({
  path,
  ...props
}: { path: BusinessPath } & IllustrationProps) {
  const Illustration = PATH_ILLUSTRATIONS[path];
  return <Illustration {...props} />;
}
