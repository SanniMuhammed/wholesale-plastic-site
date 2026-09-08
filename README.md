# Wholesale Plastic Products — Website

A bilingual (French/English) B2B wholesale sourcing platform for a Nigerian
plastic-products company, built with Next.js 14 (App Router), TypeScript and
Tailwind CSS. This is a fresh build — there was no pre-existing project to
audit, so everything here is new.

## What's here

- Bilingual routing (`/en`, `/fr`) with automatic language detection on first
  visit and a manual `FR | EN` switcher
- Homepage funnel: hero, trust bar, categories, featured products, "you don't
  need to travel to Nigeria", how-it-works, start-a-business, delivery
  teaser, final CTA
- Product catalog with search (matches English and French terms alike, e.g.
  "bucket" and "seau" both work) and category filters
- Product detail pages with a quantity picker
- A client-side **Wholesale Order** (deliberately not a retail cart) that
  persists across pages via `localStorage`
- Order Summary page (`/order-summary`): a receipt-styled view of the
  customer's order, with optional name/business/notes fields that enrich a
  pre-filled WhatsApp message -- the primary, zero-friction path to confirm
  pricing and delivery with a rep. A "Print / Save as PDF" action prints
  just the receipt (nav/footer/form hidden via Tailwind `print:` classes).
  A collapsed fallback form (`/api/quote`) remains for customers without
  WhatsApp
- Wholesale, Delivery, About and Contact pages
- WhatsApp deep-links throughout, with contextual pre-filled messages in the
  active language

No customer testimonials, stats, delivery times or prices are included
anywhere — the brief was explicit that none of that should be invented, so
those are left as clearly-marked placeholders instead (see below).

## Getting started

```
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/en` or `/fr` based on your
browser's language.

This project was written and syntax-checked in an environment with no
network access, so `npm install` / `npm run dev` haven't actually been run
against it yet. Everything follows standard, stable Next.js 14 App Router
patterns, but budget a first local run to catch anything that needs a tweak.

## What to fill in before launch

- **`.env.local`** — real WhatsApp number, email, phone, address (see
  `.env.example` for the exact keys)
- **`lib/products.ts`** — replace the sample catalog with the real product
  list, specs, and (once available) photo paths via each product's `image`
  field
- **Product photography** — until a product's `image` is set, the UI shows a
  plain color-block placeholder instead of a stock photo, on purpose; drop
  real photos under `/public` and point `image` at them
- **About page copy** — in `lib/i18n/en.json` and `fr.json`, under
  `aboutPage.sections`, replace the bracketed placeholder text with the
  company's real story
- **`app/api/quote/route.ts`** — the fallback-form endpoint (for customers
  without WhatsApp); currently only logs submissions to the server console.
  Wire it to email (e.g. Resend, Nodemailer) or a database/CRM before launch
- **`wholesalePage.whySection.points`** (`en.json` / `fr.json`) — confirm
  these capability claims match what the business actually offers before
  publishing them

## Structure

```
app/
  layout.tsx            root layout (fonts, <html>/<body>)
  [locale]/             all locale-prefixed routes (en/fr)
    layout.tsx           Nav + Footer + wholesale-order state
    page.tsx             Home
    products/            catalog (search + category filters)
    products/[slug]/     product detail
    how-it-works/, wholesale/, delivery/, about/, order-summary/, contact/
  api/quote/             fallback (no-WhatsApp) submission endpoint (stub — see above)
middleware.ts            redirects "/" to /en or /fr by Accept-Language
lib/
  i18n/                  en.json / fr.json dictionaries + locale config
  products.ts            product & category data model + sample catalog
  whatsapp.ts            wa.me link builders with pre-filled messages
  getDictionary.ts       loads the right dictionary for a locale
components/              UI, organized roughly by the section it renders
```

## Known limitations / next steps

- `<html lang>` lives on the root layout (above the `[locale]` segment) and
  is synced client-side once the locale is known
  (`components/HtmlLangSync.tsx`). Fine at this scale; worth revisiting with
  a library like `next-intl` if the site and its routes grow a lot.
- No PDF catalog download yet (brief section 30) — add a PDF-generation step
  once there's a real catalog to export.
- No CMS/admin. Products live in `lib/products.ts`. If non-developers need
  to edit the catalog directly, that's the natural next addition.
- Country-specific landing pages (`/locations/...`) were intentionally left
  out until there's enough real, country-specific content to justify them.

<!-- Deployment verification trigger: 2026-09-08 -->
