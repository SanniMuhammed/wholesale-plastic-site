-- Applied to the connected production project.
-- Keep this migration in source control so new environments reproduce the same safeguards.

update public.products set minimum_order_quantity=1 where minimum_order_quantity is null;
alter table public.products alter column minimum_order_quantity set default 1;
alter table public.products alter column minimum_order_quantity set not null;
alter table public.products drop constraint if exists products_minimum_order_quantity_check;
alter table public.products add constraint products_minimum_order_quantity_check check (minimum_order_quantity >= 1);
alter table public.products drop constraint if exists products_price_check;
alter table public.products add constraint products_price_check check (price is null or price >= 0);

create or replace function public.create_wholesale_order(p_order jsonb, p_items jsonb)
returns uuid language plpgsql security invoker set search_path=public as $$
declare
  v_order_id uuid := coalesce(nullif(p_order->>'id','')::uuid, gen_random_uuid());
  v_item_count integer;
  v_product_count integer;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items)=0 then raise exception 'Order must contain at least one item'; end if;
  if coalesce(length(trim(p_order->>'locale')),0)=0 then raise exception 'Order locale is required'; end if;
  if p_order->>'channel' not in ('whatsapp','fallback_form') then raise exception 'Invalid order channel'; end if;
  if exists(select 1 from jsonb_array_elements(p_items) x where coalesce(length(trim(x->>'product_slug')),0)=0 or coalesce((x->>'quantity')::integer,0)<1) then raise exception 'Invalid order item'; end if;
  select count(*) into v_item_count from jsonb_array_elements(p_items);
  select count(*) into v_product_count from public.products pr join (select distinct value->>'product_slug' slug from jsonb_array_elements(p_items)) x on x.slug=pr.slug where pr.status='published';
  if v_product_count <> (select count(distinct value->>'product_slug') from jsonb_array_elements(p_items)) then raise exception 'One or more products are unavailable'; end if;
  insert into public.orders(id,channel,customer_name,business_name,contact,country,city,note,locale)
  values(v_order_id,p_order->>'channel',nullif(trim(p_order->>'customer_name'),''),nullif(trim(p_order->>'business_name'),''),nullif(trim(p_order->>'contact'),''),nullif(trim(p_order->>'country'),''),nullif(trim(p_order->>'city'),''),nullif(trim(p_order->>'note'),''),p_order->>'locale');
  insert into public.order_items(order_id,product_slug,product_name,capacity,quantity)
  select v_order_id,p->>'product_slug',case when p_order->>'locale'='fr' then pr.name_fr else pr.name_en end,pr.capacity,(p->>'quantity')::integer from jsonb_array_elements(p_items) p join public.products pr on pr.slug=p->>'product_slug' and pr.status='published';
  if (select count(*) from public.order_items where order_id=v_order_id) <> v_item_count then raise exception 'Order item validation failed'; end if;
  return v_order_id;
end; $$;
