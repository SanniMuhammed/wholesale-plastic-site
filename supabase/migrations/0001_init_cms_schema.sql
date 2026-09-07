-- ============================================================================
-- Wholesale Plastic Site — CMS/Admin schema (Claude #2 workstream)
-- ============================================================================
-- This migration is additive only. It does not touch anything the public
-- site currently reads (lib/products.ts, lib/i18n/*.json stay exactly as
-- they are). It creates a parallel set of tables that the /admin dashboard
-- reads and writes. Wiring the public site to read from these tables is a
-- separate, later migration (Phase 5) once Claude #1's redesign has landed
-- and this data has been reviewed.
--
-- Run against a fresh Supabase project with the SQL editor, or via the
-- Supabase CLI: `supabase db push` (see ADMIN_SETUP.md).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Shared helpers
-- ----------------------------------------------------------------------------

-- Every mutable table gets an `updated_at` that maintains itself.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin/staff accounts. Rows here are created by inviting a user via
-- Supabase Auth and then inserting a matching row (see ADMIN_SETUP.md) --
-- there is no public self-signup for /admin.
create table admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now()
);

-- True for any signed-in user with an admin_profiles row, regardless of
-- role. All three roles get full CMS access for now -- role is stored for
-- future refinement, not enforced yet (see brief: "do not overbuild role
-- management if it isn't necessary for the first implementation").
create or replace function is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_profiles where id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- Categories
-- ----------------------------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_fr text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Colours (owner-editable palette, referenced by products via a join table)
-- ----------------------------------------------------------------------------

create table colors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_en text not null,
  label_fr text not null,
  hex text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger colors_set_updated_at
  before update on colors
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Products
-- ----------------------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references categories (id) on delete set null,

  name_en text not null,
  name_fr text not null,
  short_description_en text not null default '',
  short_description_fr text not null default '',
  description_en text not null default '',
  description_fr text not null default '',

  capacity text,
  material_en text not null default '',
  material_fr text not null default '',
  packaging_en text not null default '',
  packaging_fr text not null default '',
  use_case_en text not null default '',
  use_case_fr text not null default '',

  wholesale_only boolean not null default true,
  availability_status text not null default 'in_stock'
    check (availability_status in ('in_stock', 'limited', 'out_of_stock')),
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,

  -- Ties a migrated row back to its lib/products.ts entry, so the import
  -- script is safely re-runnable (upsert on this column) without creating
  -- duplicates. Null for products created directly in the admin.
  legacy_slug text unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products (category_id);
create index products_status_idx on products (status);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- Product <-> colour, many-to-many.
create table product_colors (
  product_id uuid not null references products (id) on delete cascade,
  color_id uuid not null references colors (id) on delete cascade,
  primary key (product_id, color_id)
);

-- Product photos. `storage_path` is the object path inside the
-- `product-images` Storage bucket (e.g. "{product_id}/{filename}.webp"),
-- not a full URL -- the admin/public code builds the public URL from it.
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  is_main boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx on product_images (product_id);

-- Only one main image per product.
create unique index product_images_one_main_per_product
  on product_images (product_id)
  where is_main;

-- ----------------------------------------------------------------------------
-- FAQs
-- ----------------------------------------------------------------------------

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question_en text not null,
  question_fr text not null,
  answer_en text not null,
  answer_fr text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger faqs_set_updated_at
  before update on faqs
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Singleton content tables (company info, delivery copy, wholesale copy)
-- ----------------------------------------------------------------------------
-- Each of these holds exactly one row (id fixed at 1). This is simpler than
-- a generic key/value settings table and matches how these are consumed:
-- one company info block, one delivery-info block, one wholesale-info block.

create table company_settings (
  id smallint primary key default 1 check (id = 1),
  company_name text not null default '',
  email text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  address text not null default '',
  countries_served text[] not null default '{}',
  social_links jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
insert into company_settings (id) values (1);

create trigger company_settings_set_updated_at
  before update on company_settings
  for each row execute function set_updated_at();

create table delivery_content (
  id smallint primary key default 1 check (id = 1),
  body_en text not null default '',
  body_fr text not null default '',
  updated_at timestamptz not null default now()
);
insert into delivery_content (id) values (1);

create trigger delivery_content_set_updated_at
  before update on delivery_content
  for each row execute function set_updated_at();

create table wholesale_content (
  id smallint primary key default 1 check (id = 1),
  body_en text not null default '',
  body_fr text not null default '',
  updated_at timestamptz not null default now()
);
insert into wholesale_content (id) values (1);

create trigger wholesale_content_set_updated_at
  before update on wholesale_content
  for each row execute function set_updated_at();

-- Homepage is a fixed, known set of sections (hero, trust bar, etc.) with
-- editable text -- not a generic block builder. `key` identifies which
-- section a row is; the admin UI lists these by name, not as "entries".
create table homepage_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique
    check (key in (
      'hero', 'trust_bar', 'how_it_works', 'start_business',
      'travel', 'delivery_teaser', 'final_cta'
    )),
  title_en text not null default '',
  title_fr text not null default '',
  body_en text not null default '',
  body_fr text not null default '',
  is_visible boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create trigger homepage_sections_set_updated_at
  before update on homepage_sections
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Orders (a log of what customers sent to WhatsApp / the fallback form --
-- see ADMIN_SETUP.md and README notes: the sale itself is still negotiated
-- and closed in WhatsApp, this table exists so the owner can see and track
-- what came in)
-- ----------------------------------------------------------------------------

create table orders (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('whatsapp', 'fallback_form')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled')),

  customer_name text,
  business_name text,
  contact text,
  country text,
  city text,
  note text,
  locale text not null default 'en',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on orders (status);
create index orders_created_at_idx on orders (created_at desc);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  -- Snapshotted at submission time, not a live FK to products: the
  -- catalog can change after an order is placed, and this table must
  -- keep showing exactly what the customer saw and sent.
  product_slug text not null,
  product_name text not null,
  capacity text,
  quantity int not null check (quantity > 0)
);

create index order_items_order_id_idx on order_items (order_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Pattern used throughout:
--   - Public (anon + authenticated) can SELECT only published/active rows.
--   - Only admin_profiles members can INSERT/UPDATE/DELETE, or SELECT
--     unpublished rows.
--   - Orders are the one write-heavy public exception: anyone can INSERT
--     an order (that's how the site records one), nobody outside the
--     admin can ever read, update, or delete them.

alter table admin_profiles enable row level security;
alter table categories enable row level security;
alter table colors enable row level security;
alter table products enable row level security;
alter table product_colors enable row level security;
alter table product_images enable row level security;
alter table faqs enable row level security;
alter table company_settings enable row level security;
alter table delivery_content enable row level security;
alter table wholesale_content enable row level security;
alter table homepage_sections enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- admin_profiles: admins can see the list (for future role management UI);
-- nobody can self-insert.
create policy admin_profiles_select on admin_profiles
  for select using (is_admin_user());
create policy admin_profiles_all_admin on admin_profiles
  for all using (is_admin_user()) with check (is_admin_user());

-- categories
create policy categories_public_select on categories
  for select using (is_active or is_admin_user());
create policy categories_admin_write on categories
  for insert with check (is_admin_user());
create policy categories_admin_update on categories
  for update using (is_admin_user()) with check (is_admin_user());
create policy categories_admin_delete on categories
  for delete using (is_admin_user());

-- colors
create policy colors_public_select on colors
  for select using (is_active or is_admin_user());
create policy colors_admin_write on colors
  for insert with check (is_admin_user());
create policy colors_admin_update on colors
  for update using (is_admin_user()) with check (is_admin_user());
create policy colors_admin_delete on colors
  for delete using (is_admin_user());

-- products
create policy products_public_select on products
  for select using (status = 'published' or is_admin_user());
create policy products_admin_write on products
  for insert with check (is_admin_user());
create policy products_admin_update on products
  for update using (is_admin_user()) with check (is_admin_user());
create policy products_admin_delete on products
  for delete using (is_admin_user());

-- product_colors (visibility follows the parent product)
create policy product_colors_public_select on product_colors
  for select using (
    is_admin_user() or exists (
      select 1 from products p
      where p.id = product_colors.product_id and p.status = 'published'
    )
  );
create policy product_colors_admin_write on product_colors
  for all using (is_admin_user()) with check (is_admin_user());

-- product_images (visibility follows the parent product)
create policy product_images_public_select on product_images
  for select using (
    is_admin_user() or exists (
      select 1 from products p
      where p.id = product_images.product_id and p.status = 'published'
    )
  );
create policy product_images_admin_write on product_images
  for all using (is_admin_user()) with check (is_admin_user());

-- faqs
create policy faqs_public_select on faqs
  for select using (is_published or is_admin_user());
create policy faqs_admin_write on faqs
  for insert with check (is_admin_user());
create policy faqs_admin_update on faqs
  for update using (is_admin_user()) with check (is_admin_user());
create policy faqs_admin_delete on faqs
  for delete using (is_admin_user());

-- singleton content tables: public read, admin update (nobody inserts or
-- deletes the single row after this migration seeds it)
create policy company_settings_public_select on company_settings for select using (true);
create policy company_settings_admin_update on company_settings
  for update using (is_admin_user()) with check (is_admin_user());

create policy delivery_content_public_select on delivery_content for select using (true);
create policy delivery_content_admin_update on delivery_content
  for update using (is_admin_user()) with check (is_admin_user());

create policy wholesale_content_public_select on wholesale_content for select using (true);
create policy wholesale_content_admin_update on wholesale_content
  for update using (is_admin_user()) with check (is_admin_user());

create policy homepage_sections_public_select on homepage_sections
  for select using (is_visible or is_admin_user());
create policy homepage_sections_admin_update on homepage_sections
  for update using (is_admin_user()) with check (is_admin_user());

-- orders / order_items: anyone can create one (that's how the public site
-- records an order), only admins can ever read or change one afterwards.
create policy orders_public_insert on orders
  for insert with check (true);
create policy orders_admin_select on orders
  for select using (is_admin_user());
create policy orders_admin_update on orders
  for update using (is_admin_user()) with check (is_admin_user());
create policy orders_admin_delete on orders
  for delete using (is_admin_user());

create policy order_items_public_insert on order_items
  for insert with check (true);
create policy order_items_admin_select on order_items
  for select using (is_admin_user());
create policy order_items_admin_delete on order_items
  for delete using (is_admin_user());
