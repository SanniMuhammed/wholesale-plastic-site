# Editorial Redesign — Summary

## 1. Design direction
The existing site already had good bones for this (Fraunces serif + Inter +
Space Mono, restrained green/clay/ochre palette, hand-drawn category line
art). The redesign pushes the same language further rather than replacing
it: bigger typographic contrast, a numbered/rule-based vocabulary
("01 / 02 / 03", hairline dividers, mono eyebrow labels) used consistently
across every page instead of icon boxes and bordered cards, and a catalogue
plate treatment for products ("Nº 07 / Buckets"). Nothing here invents
business copy, stats, or claims — every string still comes from the
existing `en.json` / `fr.json` dictionaries (two new keys were added:
`common.items` in both languages, for the cart drawer's item count).

## 2. The add-to-order interaction
Left completely untouched, as requested: `AddToOrderButton.tsx`,
`CartUIProvider.tsx` (the fly-to-cart arc + badge pop), `AddedToast.tsx`,
and `OrderProvider.tsx` are byte-for-byte identical to the original. It's
the one piece of motion design in the app that was already exactly right,
so it stays as the signature interaction the rest of the system defers to.

## 3. Major UI changes
- **Nav** — scroll-aware hairline shadow, uppercase editorial link style
  with an animated underline, larger touch target on the mobile cart icon.
- **Footer** — rebuilt as a closing composition: oversized wordmark
  signature, mono-labelled columns, hairline rules instead of a flat grid.
- **Hero** — the "Wholesale · Nigerian Supply · West Africa" tag moved
  above the headline as an intro eyebrow; headline size roughly doubled at
  desktop width; `HeroVisual` no longer sits in a bordered card — the
  product-silhouette composition now bleeds into the page with two
  hand-labelled annotations ("Buckets", "Bowls").
- **TrustBar** — generic icon-in-a-row swapped for a numbered mono strip
  (icons removed entirely, per the brief's note on generic icon boxes).
- **TravelSection** ("You don't need to travel to Nigeria") — the
  box-and-arrow flow became a numbered rule sequence.
- **StartBusinessSection** — same numbered-rule treatment, replacing plain
  bordered boxes.
- **Product catalog & detail page** — every product now carries a stable
  catalogue number (its fixed position in the full product list, so "Nº
  07" always means the same product whether you're looking at the grid,
  a filtered view, or the detail page). The detail page's spec block is
  now a divided list ("Capacity / 25 L" style) instead of a two-column
  grid of stacked labels.
- **Wholesale / Delivery / Contact / About pages** — bordered-box lists
  replaced with the same numbered/rule list language; headings brought up
  to the same type scale as the homepage sections. About's placeholder
  copy is untouched — only the structure around it changed.

## 4. New components
None — the redesign works entirely within the existing component
architecture. `HeroVisual` and `ProductCard` gained new (optional) props
rather than new files.

## 5. Components significantly redesigned
`Nav`, `Footer`, `Hero`, `HeroVisual`, `TrustBar`, `TravelSection`,
`StartBusinessSection`, `ProductCategories`, `ProductCard`, `CatalogClient`,
`CartDrawer`, the product listing and detail pages, and the About /
Wholesale / Delivery / Contact pages.

## 6. Mobile improvements
- **The reported cart drawer bug is fixed.** It was `w-full max-w-sm`
  unconditionally, which is exactly what produced the visible gap in your
  screenshots on any viewport wider than ~384px. It's now full-bleed below
  the `sm` breakpoint and a fixed 384px side panel from `sm:` up.
- Removed the `flex-1` forced footer-pinning in the locale layout — short
  pages (How It Works, About) were leaving a large dead gap of empty
  background between the content and the footer; the footer now follows
  the content directly.
- Nav's mobile cart icon is now a real standalone touch target rather than
  living only inside the collapsible menu.

## 7. Cart / order improvements
- Mobile full-bleed fix (above).
- Item rows in the drawer are now numbered, and a total item count now
  shows under the drawer title.
- Everything else — quantities, remove, the WhatsApp link generation, the
  "Continue on WhatsApp / View Full Order / Keep Browsing" hierarchy — is
  unchanged, since it was already doing the right thing.

## 8. Accessibility
No regressions intended: all existing `aria-*` attributes, focus
management (Escape-to-close, body scroll lock), and semantic structure in
the cart drawer, nav, and forms are preserved verbatim. New interactive
elements (nav underline states, card hover states) use color contrast
consistent with the existing palette and respect the project's existing
`prefers-reduced-motion` handling in `globals.css`.

## 9. Performance
No new dependencies. No new client components were introduced beyond what
was already client-side (Nav's mobile menu was already `"use client"`; the
one addition is a passive scroll listener for the header shadow, cleaned
up on unmount).

## 10. Files changed
```
app/[locale]/about/page.tsx
app/[locale]/contact/page.tsx
app/[locale]/delivery/page.tsx
app/[locale]/layout.tsx
app/[locale]/products/[slug]/page.tsx
app/[locale]/products/page.tsx
app/[locale]/wholesale/page.tsx
app/globals.css
components/CatalogClient.tsx
components/DeliveryTeaser.tsx
components/FeaturedProducts.tsx
components/Footer.tsx
components/Hero.tsx
components/HeroVisual.tsx
components/Nav.tsx
components/ProductCard.tsx
components/ProductCategories.tsx
components/StartBusinessSection.tsx
components/TravelSection.tsx
components/TrustBar.tsx
components/cart/CartDrawer.tsx
lib/i18n/en.json
lib/i18n/fr.json
```
Untouched (deliberately): `AddToOrderButton.tsx`, `CartUIProvider.tsx`,
`AddedToast.tsx`, `OrderProvider.tsx`, `CartTrigger.tsx`, `ProductImage.tsx`,
`ProductOrderPanel.tsx`, `CategoryIllustration.tsx`, `FinalCta.tsx`,
`OrderSummaryClient.tsx`, `lib/products.ts`, `lib/whatsapp.ts`,
`tailwind.config.ts`, `app/api/quote/route.ts`, and everything else not
listed above.

## 11. `npm run build` — not run, and here's why
This sandbox has no network access, so `npm install` fails immediately
(the project's `node_modules` wasn't part of the upload, and the registry
is unreachable). I could not produce an actual `npm run build` result.

What I did instead, since I take "no `@ts-ignore`, no broken build" seriously
even without a compiler on hand:
- Read every original file before touching it and cross-checked every
  prop name, dictionary key, and type (`CategorySlug`, `ColorKey`, the
  `Dictionary` type) against the real source rather than assuming.
- Ran every new/edited `.ts`/`.tsx` file (and, for a final sanity pass,
  all 45 source files in the project) through TypeScript's own parser in
  syntax-only mode — it catches malformed JSX, unbalanced braces, and
  other structural errors, though it can't do full type-checking or
  module resolution without the project's real dependencies installed.
- Validated both dictionary JSON files parse correctly and still have
  identical key sets between `en` and `fr`.
- Diffed the full tree against the original upload to confirm only the 22
  files listed above actually changed.

That's real verification, but it is not the same guarantee as a clean
`npm run build`. **Please run the build yourself before deploying** —
if anything doesn't compile, it's most likely to be a `Dictionary` type
mismatch, and I'd genuinely like to know if you hit one.

---

# Round 2 — QA fixes from live screenshots

Four issues, found by reviewing real screenshots of the deployed redesign.

## 1. `HeroVisual` dead-space bug
`components/HeroVisual.tsx` — the outer wrapper was `aspect-square w-full`
with no upper bound, so on any single-column layout (all of mobile, and
tablet widths before the `lg:` grid kicks in) its width tracked the full
content column — up to ~1000px+ on a wide phone — and `aspect-square`
forced the height to match, even though the actual composition (three
overlapping circles, max ~224px each) never got anywhere near that size.
Result: a mostly-empty square with the illustration floating in the
middle. Fixed by adding `max-w-[420px] mx-auto` so the square scales with
its content instead of with the column.

## 2. Homepage said the same thing four times
Four sections — `TravelSection`, `StartBusinessSection`, `DeliveryTeaser`,
`FinalCta` — each independently made the "you don't need to travel to /
be in Nigeria, we handle sourcing and delivery" case, and two adjacent
numbered sequences (`TravelSection`'s 4-stop You → Team → Products →
Business flow, immediately followed by `HowItWorksSection`'s 5-step
Choose → Build → WhatsApp → Confirm → Receive) covered overlapping
ground back to back.
- `TravelSection` — removed the 4-stop numbered flow grid entirely;
  the section is now just the title + problem/solution paragraph. The
  numbered walkthrough is left to `HowItWorksSection`, which does it
  properly (as an actual step-by-step process, not a supply-chain
  diagram).
- `StartBusinessSection` — removed the opening paragraph that re-made
  the same "you don't need to travel to Nigeria" case `TravelSection`
  had just made a few sections above; it now goes straight from the
  title into the Start / Restock / Distribute cards.
- `dict.travel.flow` and `dict.startBusiness.body` were left in both
  `en.json` and `fr.json` (unused, harmless) rather than deleted, so
  the copy isn't lost if either section wants it back later.
- `DeliveryTeaser` and `FinalCta` were left as-is — they sit at
  different points in the page and serve different jobs (a delivery-
  specific link mid-page, a final conversion CTA at the very bottom),
  so cutting them wasn't part of this round.

## 3. Featured-products numbering could disagree with the catalog
`components/FeaturedProducts.tsx` numbered each card by its position
within the featured row (`index={i + 1}`), while `CatalogClient.tsx`
numbers by fixed position in the full catalog (`catalogIndex` built from
`getAllProducts()`). Same product, two different "Nº" depending on which
page you were looking at. `FeaturedProducts` now builds the same kind of
`slug -> index` map from `getAllProducts()` and passes that, so a
product's number is identical everywhere it's shown.

## 4. Desktop nav was cramped between `md` and `lg`
`components/Nav.tsx` switched from the mobile hamburger to the full
desktop nav (5 links + divider + language switcher + WhatsApp icon +
the labelled "Review Order" cart button) at `md:` (768px) — not enough
room for all of that, so anything between ~768px and ~1024px looked
tight. Every `md:flex` / `md:hidden` pair governing that switch (desktop
links, the right-side control cluster, the hamburger button, and the
mobile dropdown panel) is now `lg:` instead, so the roomier mobile/
tablet layout holds until 1024px, where there's actually space for the
full bar.

## Files changed this round
```
components/FeaturedProducts.tsx
components/HeroVisual.tsx
components/Nav.tsx
components/StartBusinessSection.tsx
components/TravelSection.tsx
```

## Verification
Same constraint as Round 1 — no network, no `node_modules`, so
`npm run build` still couldn't be run directly. Ran the same
syntax-only TypeScript parse (`tsc --noEmit`, JSX mode, ignoring
module-resolution errors since no dependencies are installed) across
all five edited files and confirmed no structural/JSX errors. Cross-
checked `ProductCard`'s `index?: number` prop against
`catalogIndex.get()`'s `number | undefined` return type by hand — same
pattern already in use in `CatalogClient`, so it's a known-good shape.
**Please still run `npm run build` yourself before deploying.**
