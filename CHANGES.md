# Project change log

This file records the important changes that shaped the current site. It is intentionally kept practical: the README describes how the project works today, while this file explains why the major pieces are here.

## Current baseline

The site is a bilingual wholesale catalogue and ordering site for Sherinab Venture. The public pages use the editorial visual language established during the redesign: strong serif headings, restrained colours, mono labels, numbered sections and simple rules instead of a page full of generic cards and icons.

The approved Delivery page keeps its image-rich layout. Its images are now editable through the admin dashboard without changing the layout itself.

## Content and CMS

The original catalogue and translation dictionaries were gradually supplemented by a Supabase-backed CMS.

The admin dashboard now covers:

- Products and product images.
- Pricing and reviews.
- Categories and category images.
- Colours and FAQs.
- Company details and business hours.
- Homepage section content and visibility.
- Homepage hero and final CTA images.
- Delivery-page images.
- Delivery process step images.

The CMS image helpers accept both public paths and full image URLs. Uploaded images are stored through Supabase storage and exposed to the public pages through the CMS helpers.

## Delivery page

The Delivery page was redesigned around a clear customer journey:

1. Tell us your destination.
2. We confirm your order.
3. We arrange logistics.
4. You receive delivery details.
5. Your order is delivered.

The page also explains the factors that affect delivery, separates Nigeria deliveries from international orders and ends with a support CTA.

The design is responsive and image-led. The hero, Nigeria delivery image and support image can be changed from the admin dashboard. Each of the five process steps also has an optional image slot; removing one restores the built-in illustration.

## Homepage

The homepage was consolidated so the main journey is easier to follow:

- Hero.
- Trust information.
- Product categories and featured products.
- Business entry points.
- How It Works.
- Delivery information.
- Wholesale quote CTA.
- Final order CTA.

The CMS is the source of truth for editable homepage content. Public components should not duplicate an editable value with a second hard-coded version.

## Navigation

The site navigation was tightened for smaller screens and the mobile cart was given its own touch target.

The brand link has a specific behaviour:

- On another page, it navigates to the localized homepage.
- On the homepage, it smoothly returns the current page to the top without reloading the document.

This keeps the interaction fast while still making the brand mark a reliable “back to top/home” control.

## Product and ordering improvements

Product pages now support:

- Product galleries with all available images.
- Product-specific reviews.
- Review photos where supplied.
- Fixed, starting-from and request-pricing states.
- Quantity selection and wholesale ordering.
- Related products.

The order summary shows unit prices, line totals and the complete order total. WhatsApp remains the main hand-off for confirming a wholesale order and delivery details.

## Production hardening

Several production fixes were added as the site moved from prototype to a working CMS:

- Public order creation no longer depends on a public order `SELECT` after insertion.
- Orders use a generated UUID and canonical published product data.
- Locale pages use localized canonical URLs and language alternates where appropriate.
- The order summary is marked `noindex, nofollow`.
- The sitemap includes the localized public pages and published products.
- Company information is read from the CMS.
- The production company address is **Oke Sunnah, Saki, Oyo State, Nigeria**.
- Server Action request bodies allow image uploads up to 10 MB instead of Next.js's 1 MB default.

## Responsive fixes

The redesign also addressed several real-device issues:

- The mobile cart drawer no longer leaves an unwanted side gap.
- The footer follows short pages naturally instead of being forced to the bottom with a large empty area.
- Desktop navigation waits until the `lg` breakpoint so tablet widths do not become cramped.
- The homepage hero visual is bounded so its illustration does not create excessive empty space.
- Featured-product catalogue numbers use the same stable numbering as the main catalogue.

## Accessibility and interaction

Existing keyboard and focus behaviour in the cart and navigation has been preserved. Interactive controls keep semantic buttons/links and accessible labels where needed. Motion follows the existing reduced-motion handling.

## Database migrations

The migration history currently includes the original CMS schema, storage policies, category and homepage image fields, RLS/performance fixes, product pricing and reviews, business hours, company address, incomplete-product handling, delivery images and expanded CMS image slots.

New database changes should always be added as a new migration rather than editing an old migration that may already have been applied to production.

## Development and verification

The repository uses GitHub Actions and Vercel for production build verification. The Android/Termux environment is not the place to run the full Next.js production build because its dependency/network setup is not reliable for this project.

For changes that affect the public site, check both English and French routes and test the affected mobile and desktop layouts.

## Code style

The codebase should read like a maintained application, not a generated code dump.

Prefer:

- Clear names over clever abstractions.
- Small functions that do one job.
- Existing project patterns instead of introducing a new pattern for every feature.
- Comments only where they explain a decision that is not obvious from the code.
- Business copy in dictionaries or CMS data.
- Straightforward conditionals over deeply nested helper layers.
- Types that describe the actual data rather than broad `any` escapes.

Avoid comments that merely narrate the next line of code, repeated boilerplate explanations and unnecessary wrappers. Keep error handling useful and specific.
