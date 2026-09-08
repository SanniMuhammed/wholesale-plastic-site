-- Keep the admin self-read policy sargable and avoid re-evaluating auth.uid()
-- for every row during RLS checks.

drop policy if exists admin_profiles_select_self on public.admin_profiles;

create policy admin_profiles_select_self
  on public.admin_profiles
  for select
  to authenticated
  using (id = (select auth.uid()));
