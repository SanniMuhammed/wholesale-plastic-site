create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null check (action in ('INSERT','UPDATE','DELETE')),
  table_name text not null,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log(created_at desc);
create index if not exists admin_audit_log_table_record_idx on public.admin_audit_log(table_name, record_id, created_at desc);

alter table public.admin_audit_log enable row level security;
drop policy if exists "Admins can read audit log" on public.admin_audit_log;
create policy "Admins can read audit log" on public.admin_audit_log for select using (public.is_admin_user());

create or replace function public.log_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_old jsonb;
  v_new jsonb;
  v_record_id text;
begin
  if v_uid is null or not public.is_admin_user() then
    return coalesce(new, old);
  end if;
  if tg_op = 'DELETE' then
    v_old := to_jsonb(old); v_new := null;
  elsif tg_op = 'INSERT' then
    v_old := null; v_new := to_jsonb(new);
  else
    v_old := to_jsonb(old); v_new := to_jsonb(new);
  end if;
  v_record_id := coalesce(v_new->>'id', v_old->>'id');
  insert into public.admin_audit_log(admin_user_id, action, table_name, record_id, old_data, new_data)
  values (v_uid, tg_op, tg_table_name, v_record_id, v_old, v_new);
  return coalesce(new, old);
end;
$$;

revoke all on function public.log_admin_change() from public;

do $$
declare t text;
begin
  foreach t in array array['products','product_images','product_colors','categories','colors','product_reviews','faqs','company_settings','delivery_content','homepage_sections','site_settings','orders'] loop
    execute format('drop trigger if exists audit_admin_%I on public.%I', t, t);
    execute format('create trigger audit_admin_%I after insert or update or delete on public.%I for each row execute function public.log_admin_change()', t, t);
  end loop;
end $$;
