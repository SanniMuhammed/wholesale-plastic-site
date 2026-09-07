# Admin dashboard setup

This covers getting the `/admin` dashboard running. It assumes the rest of
the site (the part Claude #1 has been redesigning) already works -- this
only adds the business-management layer on top.

## What this is, and isn't, wired up to yet

The public site (`/en`, `/fr`, the product catalogue, the cart, the
WhatsApp hand-off) still reads from `lib/products.ts` and
`lib/i18n/*.json`, exactly as before. **Nothing about the public site's
data source has changed.** `/admin` reads and writes a separate set of
database tables. Once the catalogue in `/admin` has been reviewed and is
ready, a later change will point the public site at it (see "Staged
migration" in the project brief) -- that's a deliberate follow-up, not
something this setup is missing.

The one place the public site *was* touched: clicking "Continue on
WhatsApp" now also quietly logs a copy of the order to the database, so it
shows up under `/admin/orders`. The WhatsApp link itself is unchanged --
same message, same behavior.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once it's provisioned, go to **Project Settings -> API**. You'll need:
   - **Project URL**
   - **anon / public key**

   You will *not* need the service-role key anywhere in this app -- it's
   never generated or stored. Admin access is enforced by Row Level
   Security policies instead (see the migration files), the same way for
   the dashboard, the API routes, and the migration script.

## 2. Set environment variables

Add to `.env.local` (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

On Vercel (or wherever this deploys), add the same two variables in the
project's environment variable settings.

## 3. Run the database migrations

In the Supabase dashboard, go to **SQL Editor** and run these two files,
in order, exactly as they are:

1. `supabase/migrations/0001_init_cms_schema.sql` -- all tables, triggers,
   and Row Level Security policies.
2. `supabase/migrations/0002_storage.sql` -- the `product-images` storage
   bucket and its access policies.

Then run `supabase/seed/seed.sql` to populate the categories and colours
that the current site already uses (Buckets, Basins, Bowls... / red,
blue, green...), so the admin doesn't start with empty pickers.

If you have the Supabase CLI linked to this project instead, the
equivalent is:

```
supabase db push
supabase db execute -f supabase/seed/seed.sql
```

## 4. Create the first admin account

There's no public sign-up page for `/admin` on purpose. To create the
first account:

1. In the Supabase dashboard: **Authentication -> Users -> Add user**.
   Set an email and password (or send an invite email, if you've
   configured SMTP).
2. Copy that user's UUID from the users table.
3. In the **SQL Editor**, run:

   ```sql
   insert into admin_profiles (id, full_name, role)
   values ('paste-the-user-uuid-here', 'Your Name', 'owner');
   ```

That's it -- that account can now sign in at `/admin/login`. Repeat step 3
(with a different role, e.g. `'staff'`) for any additional accounts; the
role is stored for future use but every role currently has the same
access.

## 5. Install and run

```
npm install
npm run dev
```

Visit `/admin/login` and sign in with the account from step 4.

## 6. (Optional) Import the existing placeholder catalogue

`lib/products.ts` is explicitly labeled as placeholder data to be
replaced before launch, but importing it gives the admin something to
look at immediately, and doubles as a real test of the whole pipeline:

```
MIGRATION_ADMIN_EMAIL=you@example.com \
MIGRATION_ADMIN_PASSWORD=your-password \
npm run migrate:products
```

This upserts every product from `lib/products.ts` into the database as a
**draft** (nothing goes live automatically) and reports which ones still
need a photo uploaded before they can be published. It's safe to run more
than once -- it updates the same rows rather than duplicating them.

## Troubleshooting

- **"Could not sign in" from the migration script** -- the account needs
  both a real Supabase Auth login (step 4.1) *and* a row in
  `admin_profiles` (step 4.3). Missing either one fails the same way.
- **Uploaded photos don't show up** -- check that
  `NEXT_PUBLIC_SUPABASE_URL` is set at build time, not just at runtime;
  `next.config.mjs` reads it to allow-list the image domain.
- **RLS errors ("new row violates row-level security policy")** -- almost
  always means the signed-in user doesn't have an `admin_profiles` row
  yet (step 4.3), or the session cookie didn't refresh -- try signing out
  and back in.
