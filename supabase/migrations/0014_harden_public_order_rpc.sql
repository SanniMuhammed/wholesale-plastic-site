create or replace function public.create_wholesale_order(p_order jsonb, p_items jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_order_id uuid := coalesce(nullif(p_order->>'id','')::uuid, gen_random_uuid());
  v_item_count integer;
  v_product_count integer;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 100 then raise exception 'Order must contain between 1 and 100 items'; end if;
  if p_order->>'locale' not in ('en','fr') then raise exception 'Invalid order locale'; end if;
  if p_order->>'channel' not in ('whatsapp','fallback_form') then raise exception 'Invalid order channel'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) x where coalesce(length(trim(x->>'product_slug')),0)=0 or length(x->>'product_slug') > 160 or coalesce((x->>'quantity')::integer,0) < 1 or coalesce((x->>'quantity')::integer,0) > 1000000) then raise exception 'Invalid order item'; end if;
  if exists (select 1 from jsonb_each_text(p_order) kv where kv.key in ('customer_name','business_name','contact','country','city','note') and length(kv.value) > 500) then raise exception 'Order text field is too long'; end if;
  select count(*) into v_item_count from (select value->>'product_slug' slug, sum((value->>'quantity')::integer) quantity from jsonb_array_elements(p_items) group by value->>'product_slug') q where q.quantity <= 1000000;
  if v_item_count <> (select count(distinct value->>'product_slug') from jsonb_array_elements(p_items)) then raise exception 'Combined quantity is too large'; end if;
  select count(*) into v_product_count from public.products pr join (select distinct value->>'product_slug' slug from jsonb_array_elements(p_items)) x on x.slug=pr.slug where pr.status='published';
  if v_product_count <> (select count(distinct value->>'product_slug') from jsonb_array_elements(p_items)) then raise exception 'One or more products are unavailable'; end if;

  insert into public.orders(id,channel,customer_name,business_name,contact,country,city,note,locale)
  values(v_order_id,p_order->>'channel',nullif(trim(p_order->>'customer_name'),''),nullif(trim(p_order->>'business_name'),''),nullif(trim(p_order->>'contact'),''),nullif(trim(p_order->>'country'),''),nullif(trim(p_order->>'city'),''),nullif(trim(p_order->>'note'),''),p_order->>'locale');

  insert into public.order_items(order_id,product_slug,product_name,capacity,quantity)
  select v_order_id,p.slug,case when p_order->>'locale'='fr' then pr.name_fr else pr.name_en end,pr.capacity,p.quantity
  from (select value->>'product_slug' slug, sum((value->>'quantity')::integer)::integer quantity from jsonb_array_elements(p_items) group by value->>'product_slug') p
  join public.products pr on pr.slug=p.slug and pr.status='published';

  if (select count(*) from public.order_items where order_id=v_order_id) <> v_product_count then raise exception 'Order item validation failed'; end if;
  return v_order_id;
end;
$$;
