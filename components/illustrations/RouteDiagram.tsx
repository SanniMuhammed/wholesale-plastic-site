import type { SVGProps } from "react";

/**
 * Abstract sourcing-to-destination route: a filled origin marker, a drawn
 * route line with one waypoint, and a hollow destination marker. Deliberately
 * schematic (an architecture/logistics drawing, not a map) so it never
 * implies a specific country, city, or distance -- only that supply moves
 * from one coordinated point to another.
 *
 * `active` controls the one-time draw-in: false renders the line collapsed
 * to zero length and the destination marker faint, true transitions both to
 * their resting state. Driven by the parent's scroll-into-view state rather
 * than an internal hook, so this stays a plain presentational component.
 */
export function RouteDiagram({
  active,
  ...props
}: { active: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 100" fill="none" aria-hidden="true" {...props}>
      <path
        d="M34 60 Q200 24 366 60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: active ? 0 : 1,
          transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* Waypoint -- the coordination step midway along the route. */}
      <rect
        x="196"
        y="34"
        width="8"
        height="8"
        transform="rotate(45 200 38)"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        style={{
          opacity: active ? 0.6 : 0,
          transition: "opacity 0.5s ease 0.9s",
        }}
      />

      {/* Origin marker. */}
      <circle cx="30" cy="60" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="30" cy="60" r="4.5" fill="currentColor" />

      {/* Destination marker. */}
      <circle
        cx="370"
        cy="60"
        r="5.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        style={{
          opacity: active ? 1 : 0.3,
          transition: "opacity 0.5s ease 0.9s",
        }}
      />
    </svg>
  );
}
