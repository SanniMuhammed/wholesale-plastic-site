# Admin dashboard setup

The `/admin` dashboard is the management area for Sherinab Venture's website. It uses Supabase for authentication, database content and image storage.

## What the admin controls

From the dashboard you can manage:

- Products, product details, pricing and product images.
- Product reviews and publication status.
- Categories and category images.
- Product colours.
- FAQs.
- Homepage section copy and visibility.
- Homepage hero and section images.
- Homepage final CTA image.
- Delivery-page copy and images.
- Delivery process step images.
- Company contact details and business hours.

The public website reads the CMS content directly. If a field is editable in the dashboard, its public counterpart should use that value rather than a separate hard-coded copy.

## 1. Create or connect a Supabase project

Create a Supabase project, then open **Project Settings → API** and copy:

- Project URL
- Anon/public key

The application uses the anon key with Supabase Row Level Security. Do not put a service-role key in browser code or commit one to the repository.

## 2. Set environment variables

Create `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Set the same variables in the Vercel project's environment settings.

Never commit `.env.local`.

## 3. Apply the database migrations

The database changes are in `supabase/migrations/`. They are numbered so they can be applied in order.

The current migration set covers:

- Initial CMS tables and Row Level Security.
- Supabase storage and storage policies.
- Category and homepage image fields.
- RLS and database performance fixes.
- Product pricing and reviews.
- Business hours.
- Company address.
- Delivery-page image fields.
- Expanded CMS image slots.

When using the Supabase CLI:

```bash
supabase db push
```

Use the SQL files directly in the Supabase SQL Editor only when you need to apply a migration manually. Keep the migration files in Git so the database history remains reproducible.

## 4. Seed development data

The seed file is:

```text
supabase/seed/seed.sql
```

Run it only when you want the seed categories/colours in a development database. Do not blindly run seed data against production.

## 5. Create the first admin account

There is no public `/admin` sign-up page.

1. Open **Authentication → Users** in Supabase.
2. Create or invite the admin user.
3. Copy the user's UUID.
4. Add the user to `admin_profiles` in the SQL Editor:

```sql
insert into admin_profiles (id, full_name, role)
values ('USER_UUID', 'Your Name', 'owner');
```

The account can then sign in at `/admin/login`.

Additional staff accounts can be given the `staff` role. The role is stored in the profile and can be used for more granular permissions as the admin system grows.

## 6. Run the application

```bash
npm install
npm run dev
```

Open `/admin/login` and sign in.

## 7. Product migration

The old product catalogue migration script is still available for importing products from `lib/products.ts`:

```bash
MIGRATION_ADMIN_EMAIL=you@example.com \
MIGRATION_ADMIN_PASSWORD=your-password \
npm run migrate:products
```

Imported products are created as drafts. Review the products and upload the correct photography before publishing them.

## Image uploads

The admin image controls support the site's CMS image slots. A control can upload, preview and remove an image where that slot exists.

The delivery page has three main image slots plus five optional process-step images:

- Hero image.
- Nigeria Deliveries image.
- Delivery Support image.
- Process steps 1–5.

If a process-step image is removed, the delivery page falls back to its built-in step illustration.

Homepage image controls cover the hero, final CTA and other sections that expose an image slot. Product images are managed separately from these site-section images.

Image uploads are handled through Server Actions. The project allows request bodies up to 10 MB in `next.config.mjs`, which is above Next.js's 1 MB default and prevents normal CMS photo uploads from failing because of the default limit.

## Company information

Keep the production address as:

**Oke Sunnah, Saki, Oyo State, Nigeria**

Update company details through the CMS rather than hard-coding them into individual pages.

## Troubleshooting

### Admin login fails

Check that the Supabase Auth user exists and that the same UUID has a row in `admin_profiles`.

### RLS error

A missing or incorrect `admin_profiles` row is the first thing to check. If the account was just created, sign out and back in so the session is refreshed.

### An uploaded image is rejected

Check the file size. Server Actions are configured for uploads up to 10 MB. Also check that the Supabase URL and storage policies are correct.

### The admin value saves but the public page does not change

The page may still be using a dictionary value or hard-coded value instead of the CMS field. Check the corresponding public component and make the CMS value the source of truth.

### An image uploads but does not appear

Check the stored image path, the storage bucket/policy and the image URL returned by the CMS helper. Then check the browser cache and the Vercel deployment serving the latest code.
