# Homepage design notes

These notes describe the homepage as it exists now, rather than the original redesign proposal.

## Page flow

The homepage is built around a simple wholesale journey:

1. **Hero** — explains what Sherinab Venture supplies and gives the customer a clear way into the catalogue/order flow.
2. **Trust bar** — short reasons to buy through the business.
3. **Product categories** — quick routes into the catalogue.
4. **Featured products** — selected products with a direct Add to Order action.
5. **Business entry points** — helps customers who are starting, restocking or distributing.
6. **How It Works** — explains the order process and reinforces that customers do not need to travel to Nigeria to source products.
7. **Delivery teaser** — points customers to the full delivery page.
8. **Wholesale quote CTA** — another route for customers who prefer to ask for a quote.
9. **Final CTA** — closes the page with a direct order/contact action and an editable image.

## Visual language

The homepage uses the site's editorial style:

- Serif display headings with a practical sans-serif body.
- Mono labels for small metadata and section markers.
- Numbered steps and thin rules where they help structure information.
- A restrained green/clay/ochre palette.
- Product photography and simple illustrations instead of decorative stock-card grids.
- Strong whitespace and clear hierarchy on mobile as well as desktop.

The design is intentionally straightforward. Sections should not compete with one another for attention.

## CMS rules

Homepage content that is editable in `/admin/content/homepage` should be read by the public homepage from the same CMS record.

The homepage currently supports editable images for the hero and final CTA, plus image slots exposed by the CMS for other sections. A mobile hero image can be provided separately when the crop needs to differ from desktop.

The CMS can hide a section without deleting its data. This makes it possible to take a section off the homepage and bring it back later.

## Image behaviour

Images should be useful to the section rather than decorative for its own sake. Keep the existing composition when replacing an approved image slot.

The Delivery page is managed separately because its approved image-rich layout has its own image slots and should not be rearranged as part of a homepage change.

## Content rules

- Keep English and French content in sync.
- Do not invent prices, delivery times, customer counts or business claims.
- Keep product facts in the product data/CMS rather than copying them into page components.
- Keep contact details in company settings.
- Use the existing WhatsApp message builders for order and enquiry links.

## Responsive behaviour

The mobile layout is not a reduced desktop layout. The same hierarchy should remain clear at small widths, with controls large enough to tap and images cropped without hiding the important subject.

When changing a homepage section, check:

- A narrow phone viewport.
- A tablet-width viewport.
- A normal desktop viewport.
- Both `/en` and `/fr`.

## Current design decisions

The original proposal to move every section into a single numbered flow was not kept. Numbering is used where it explains a process, while product and business sections keep their own layouts.

The How It Works sequence owns the main step-by-step explanation. Other sections should not repeat the same journey in a different format.
