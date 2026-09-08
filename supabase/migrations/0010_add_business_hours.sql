alter table public.company_settings
  add column if not exists business_hours_en text not null default '',
  add column if not exists business_hours_fr text not null default '';
