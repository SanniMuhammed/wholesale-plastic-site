-- Make the approved delivery-page photos editable from the admin CMS.
alter table public.delivery_content
  add column if not exists hero_image_path text,
  add column if not exists nigeria_image_path text,
  add column if not exists truck_image_path text;

update public.delivery_content
set
  hero_image_path = coalesce(hero_image_path, 'https://images.unsplash.com/photo-1779517225996-d5b751f80f48?auto=format&fit=crop&fm=jpg&q=82&w=1800'),
  nigeria_image_path = coalesce(nigeria_image_path, 'https://images.unsplash.com/photo-1713859272775-2e1cf7d777a1?auto=format&fit=crop&fm=jpg&q=82&w=1400'),
  truck_image_path = coalesce(truck_image_path, 'https://images.unsplash.com/photo-1620455800201-7f00aeef12ed?auto=format&fit=crop&fm=jpg&q=82&w=1400')
where id = 1;
