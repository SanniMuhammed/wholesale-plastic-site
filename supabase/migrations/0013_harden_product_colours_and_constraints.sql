create or replace function public.replace_product_colors(p_product_id uuid, p_color_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin_user() then raise exception 'Not authorized'; end if;
  if p_product_id is null then raise exception 'Product is required'; end if;
  if p_color_ids is null then p_color_ids := array[]::uuid[]; end if;
  if (select count(*) from unnest(p_color_ids) x) <> (select count(distinct x) from unnest(p_color_ids) x) then raise exception 'Duplicate colours are not allowed'; end if;
  if exists (select 1 from unnest(p_color_ids) x left join public.colors c on c.id=x where c.id is null) then raise exception 'One or more colours do not exist'; end if;
  delete from public.product_colors where product_id=p_product_id;
  insert into public.product_colors(product_id,color_id) select p_product_id,x from unnest(p_color_ids) x;
end;
$$;
revoke all on function public.replace_product_colors(uuid,uuid[]) from public;
grant execute on function public.replace_product_colors(uuid,uuid[]) to authenticated;

alter table public.products drop constraint if exists products_minimum_order_quantity_check;
alter table public.products add constraint products_minimum_order_quantity_check check (minimum_order_quantity >= 1);
alter table public.products drop constraint if exists products_price_nonnegative_check;
alter table public.products add constraint products_price_nonnegative_check check (price is null or price >= 0);
alter table public.product_reviews drop constraint if exists product_reviews_rating_check;
alter table public.product_reviews add constraint product_reviews_rating_check check (rating between 1 and 5);
