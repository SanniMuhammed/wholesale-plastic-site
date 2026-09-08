alter table public.products
  add column if not exists pricing_mode text not null default 'quote',
  add column if not exists price numeric(12,2),
  add column if not exists price_unit text;

alter table public.products
  add constraint products_pricing_mode_check
  check (pricing_mode = any (array['fixed'::text, 'starting_from'::text, 'quote'::text]));

alter table public.products
  add constraint products_price_nonnegative_check
  check (price is null or price >= 0);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null,
  business_name text,
  location text,
  rating integer not null default 5 check (rating between 1 and 5),
  review_en text not null default '',
  review_fr text not null default '',
  customer_photo_path text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_reviews_product_idx
  on public.product_reviews(product_id, is_published, sort_order, created_at desc);

alter table public.product_reviews enable row level security;

create policy product_reviews_public_read
  on public.product_reviews for select to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

create policy product_reviews_admin_manage
  on public.product_reviews for all to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());
