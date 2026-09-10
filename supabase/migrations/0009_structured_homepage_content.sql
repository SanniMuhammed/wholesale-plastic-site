alter table public.homepage_sections add column if not exists structured_content jsonb not null default '{}';
