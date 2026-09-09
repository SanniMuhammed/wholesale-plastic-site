# Sherinab Venture — Wholesale Plastic Website

Bilingual English/French B2B website for Sherinab Venture, a Nigerian wholesale plastic-products business serving customers in Nigeria and across West Africa.

The site is built with Next.js, TypeScript, Tailwind CSS, Supabase and WhatsApp-based ordering. It is designed for wholesale enquiries rather than retail checkout.

## What the site does

- English and French routes under `/en` and `/fr`.
- Language switching without losing the current page.
- Product catalogue with search and category filters.
- Product detail pages with galleries, specifications, pricing status and reviews.
- Wholesale order list stored in the browser and kept while customers move around the site.
- Order summary with a WhatsApp hand-off and a fallback quote form.
- Delivery, About, Contact and How It Works pages.
- Responsive navigation, product cards and order UI for mobile and desktop.
- Admin dashboard for products, categories, colours, reviews, FAQs, company details, homepage content and delivery content.
- Supabase-backed CMS and storage for site content and images.
- Editable homepage and delivery-page images, including the delivery process images.
- Product image management from the admin dashboard.
- Business contact details managed from the CMS.

## Current site structure

```text
app/
  [locale]/
    page.tsx                    Homepage
    products/                   Product catalogue
    products/[slug]/            Product detail
    how-it-works/               Ordering process
    wholesale/                  Wholesale information
    delivery/                   Delivery information
    about/                      Company information
    contact/                    Contact information
    order-summary/              Customer order summary
  admin/                        Admin dashboard and authentication
  api/                          Public API routes

components/
  Nav.tsx                       Site navigation
  Footer.tsx                    Site footer
  Hero.tsx                      Homepage hero
  ProductCard.tsx               Product card
  ProductGallery.tsx            Product image gallery
  HowItWorksSection.tsx         Homepage ordering steps
  DeliveryTeaser.tsx            Homepage delivery section
  FinalCta.tsx                  Homepage final CTA
  admin/                        CMS controls
  cart/                         Wholesale order UI

lib/
  cms/                          Supabase CMS access and types
  i18n/                         English/French dictionaries
  catalog/                      Catalogue helpers
  supabase/                     Supabase clients
  whatsapp.ts                   WhatsApp message builders

supabase/
  migrations/                   Database changes
  seed/                         Development seed data

public/
  images/                       Site images
  product-images/               Product image assets
```

## CMS

The public site reads editable business content from Supabase. The `/admin` dashboard is the place to manage that content.

The CMS currently covers:

- Homepage sections and visibility.
- Homepage hero images, including a mobile image.
- Homepage section images where an image slot exists.
- Homepage final CTA image.
- Delivery page images.
- Delivery process step images.
- Products, product images and pricing.
- Product reviews and moderation.
- Categories and category images.
- Colours.
- FAQs.
- Company information and business hours.

The delivery page's approved image-rich layout is kept in the code. CMS controls change its content and images without changing that layout.

## Images

Images can come from the public `public/` directory or Supabase storage. The CMS image helpers understand both public paths and full image URLs.

Image uploads use Server Actions. `next.config.mjs` allows uploads up to 10 MB because Next.js defaults Server Action request bodies to 1 MB.

Do not replace product images unless the product itself is being updated. Product photography is managed separately from the homepage and delivery-page artwork.

## Ordering

The site uses a wholesale order list rather than a normal retail shopping cart.

Customers can:

1. Add products and quantities.
2. Review the order summary.
3. Add their name, business and notes if needed.
4. Send the order through WhatsApp.
5. Use the fallback quote form when WhatsApp is not available.

The public order path records the order in Supabase and sends the customer to WhatsApp with a pre-filled message.

## Local development

Create `.env.local` from `.env.example`, then install dependencies and start Next.js:

```bash
npm install
npm run dev
```

The development site is available at `http://localhost:3000`.

For this project, do not use `npm run build` in the Android/Termux environment. Production builds are checked through GitHub Actions and Vercel.

## Environment variables

The application uses the following Supabase variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Keep `.env.local` out of Git. Never put service-role credentials in client-side code.

## Database

Supabase migrations live in `supabase/migrations/` and are applied in filename order. The current migration set includes the CMS schema, storage policies, product pricing and reviews, business hours, company address, delivery-page images and expanded CMS image slots.

The production company address is:

**Oke Sunnah, Saki, Oyo State, Nigeria**

## Deployment

The GitHub repository is connected to Vercel. Changes merged into `main` are picked up by the production project automatically.

Before merging a larger change:

1. Check the changed files and database migrations.
2. Let the GitHub production-build workflow finish.
3. Review the Vercel deployment.
4. Test the affected page on both mobile and desktop.
5. Check both `/en` and `/fr` when the change is user-facing.

Avoid manual duplicate Vercel deployments when a GitHub deployment is already running.

## Documentation

- `ADMIN_SETUP.md` — admin, Supabase and CMS setup.
- `CHANGES.md` — project history and notable changes.
- `docs/homepage-redesign-plan.md` — current homepage design decisions.

## Notes for contributors

Keep the code straightforward. Prefer small components, clear names and simple data flow over abstractions that do not solve a real problem. Keep business copy in the dictionaries or CMS instead of scattering it through components.

When changing the UI, preserve the existing responsive behaviour and accessibility attributes. When changing an image, check its mobile crop as well as its desktop presentation.
