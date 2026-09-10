-- Site-wide controls for non-technical administration.
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  navigation jsonb not null default '{}',
  footer jsonb not null default '{}',
  translations jsonb not null default '{}',
  seo jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function set_updated_at();
alter table public.site_settings enable row level security;
create policy site_settings_public_select on public.site_settings for select using (true);
create policy site_settings_admin_update on public.site_settings for update using (public.is_admin_user()) with check (public.is_admin_user());

alter table public.orders add column if not exists internal_note text;
alter table public.orders add column if not exists quote_amount numeric(12,2);
alter table public.orders add column if not exists quote_currency text not null default 'NGN';
alter table public.orders add column if not exists payment_status text not null default 'pending' check (payment_status in ('pending','partial','paid','refunded'));
alter table public.orders add column if not exists delivery_status text not null default 'pending' check (delivery_status in ('pending','preparing','dispatched','delivered','not_required'));
alter table public.orders add column if not exists payment_note text;
alter table public.orders add column if not exists delivery_note text;
alter table public.orders add column if not exists assigned_to text;
