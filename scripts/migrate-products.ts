/**
 * One-off import: copies every entry in lib/products.ts into the `products`
 * table, so the admin dashboard starts with the current catalogue instead
 * of an empty list.
 *
 * Safe to re-run: every row is upserted on `legacy_slug`, so running this
 * twice updates the same rows instead of creating duplicates.
 *
 * What this does NOT do: touch lib/products.ts, or make the public site
 * read from the database. The public site keeps reading the static file
 * exactly as it does today until a separate, later change switches it
 * over (Phase 5) -- this script only populates the admin's copy of the
 * data so it can be reviewed there first.
 *
 * Every migrated product lands as `status: "draft"` on purpose -- nothing
 * goes live until someone reviews it in /admin/products and publishes it.
 * None of these placeholder entries have a photo (see the comment in
 * lib/products.ts), so every one will need at least one uploaded before
 * it makes sense to publish.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... \
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
 *   MIGRATION_ADMIN_EMAIL=you@example.com \
 *   MIGRATION_ADMIN_PASSWORD=... \
 *   npx tsx scripts/migrate-products.ts
 *
 * The admin email/password must belong to an existing admin_profiles user
 * (see ADMIN_SETUP.md) -- this script authenticates as that user and
 * relies on the same Row Level Security policies as the dashboard itself,
 * rather than needing a separate service-role key.
 */

import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../lib/products";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.MIGRATION_ADMIN_EMAIL;
  const password = process.env.MIGRATION_ADMIN_PASSWORD;

  if (!url || !anonKey || !email || !password) {
    console.error(
      "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, " +
        "MIGRATION_ADMIN_EMAIL, MIGRATION_ADMIN_PASSWORD."
    );
    process.exit(1);
  }

  const supabase = createClient(url, anonKey);

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    console.error(`Could not sign in as ${email}: ${signInError.message}`);
    console.error("Make sure this account exists and has a row in admin_profiles (see ADMIN_SETUP.md).");
    process.exit(1);
  }

  const [{ data: categories, error: categoriesError }, { data: colors, error: colorsError }] =
    await Promise.all([
      supabase.from("categories").select("id, slug"),
      supabase.from("colors").select("id, slug"),
    ]);

  if (categoriesError || colorsError) {
    console.error(categoriesError?.message || colorsError?.message);
    process.exit(1);
  }

  const categoryIdBySlug = new Map((categories ?? []).map((c) => [c.slug, c.id]));
  const colorIdBySlug = new Map((colors ?? []).map((c) => [c.slug, c.id]));

  let created = 0;
  let updated = 0;
  const warnings: string[] = [];

  for (const [index, product] of PRODUCTS.entries()) {
    const categoryId = categoryIdBySlug.get(product.category);
    if (!categoryId) {
      warnings.push(`"${product.slug}": category "${product.category}" not found -- left uncategorized.`);
    }

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("legacy_slug", product.slug)
      .maybeSingle();

    const { data: saved, error: upsertError } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          legacy_slug: product.slug,
          category_id: categoryId ?? null,
          name_en: product.name.en,
          name_fr: product.name.fr,
          short_description_en: product.shortDescription.en,
          short_description_fr: product.shortDescription.fr,
          description_en: product.description.en,
          description_fr: product.description.fr,
          capacity: product.capacity ?? null,
          material_en: product.material.en,
          material_fr: product.material.fr,
          packaging_en: product.packaging.en,
          packaging_fr: product.packaging.fr,
          use_case_en: product.useCase.en,
          use_case_fr: product.useCase.fr,
          wholesale_only: product.wholesaleOnly,
          availability_status: "in_stock",
          is_featured: Boolean(product.featured),
          status: "draft",
          sort_order: index + 1,
        },
        { onConflict: "legacy_slug" }
      )
      .select("id")
      .single();

    if (upsertError || !saved) {
      warnings.push(`"${product.slug}": failed to save -- ${upsertError?.message}`);
      continue;
    }

    existing ? updated++ : created++;

    const colorIds = product.colors
      .map((slug) => colorIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    await supabase.from("product_colors").delete().eq("product_id", saved.id);
    if (colorIds.length > 0) {
      await supabase
        .from("product_colors")
        .insert(colorIds.map((color_id) => ({ product_id: saved.id, color_id })));
    }

    if (!product.image) {
      warnings.push(`"${product.slug}": no photo yet -- add one in /admin before publishing.`);
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated, all as drafts.`);
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} note(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
