-- ============================================================================
-- Seed data -- mirrors the categories and colours already used in
-- lib/products.ts, so the admin starts with the same options the current
-- site already relies on instead of an empty picker.
--
-- Safe to re-run: every insert is keyed on the unique `slug` column.
-- ============================================================================

insert into categories (slug, name_en, name_fr, sort_order) values
  ('buckets',    'Buckets',            'Seaux',              1),
  ('basins',     'Basins',             'Bassines',           2),
  ('bowls',      'Bowls',              'Bols',               3),
  ('containers', 'Containers',         'Récipients',         4),
  ('household',  'Household Products', 'Articles ménagers',  5),
  ('other',      'Other Products',     'Autres produits',    6)
on conflict (slug) do nothing;

insert into colors (slug, label_en, label_fr, hex, sort_order) values
  ('red',      'Red',      'Rouge',    '#C0392B', 1),
  ('blue',     'Blue',     'Bleu',     '#2E5C8A', 2),
  ('green',    'Green',    'Vert',     '#3D7A4F', 3),
  ('yellow',   'Yellow',   'Jaune',    '#D4A017', 4),
  ('white',    'White',    'Blanc',    '#F3F1EA', 5),
  ('black',    'Black',    'Noir',     '#232320', 6),
  ('orange',   'Orange',   'Orange',   '#C97A2B', 7),
  ('gray',     'Gray',     'Gris',     '#8B897E', 8),
  ('assorted', 'Assorted', 'Assortis', '#A8492E', 9)
on conflict (slug) do nothing;

insert into homepage_sections (key, sort_order) values
  ('hero', 1),
  ('trust_bar', 2),
  ('how_it_works', 3),
  ('start_business', 4),
  ('travel', 5),
  ('delivery_teaser', 6),
  ('final_cta', 7)
on conflict (key) do nothing;
