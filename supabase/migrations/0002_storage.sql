-- ============================================================================
-- Storage bucket for product photos
-- ============================================================================
-- Public bucket (photos are shown on the eventual public site) with
-- admin-only writes. Objects are keyed as "{product_id}/{filename}", which
-- is how lib/cms/products.ts and the admin uploader organize them.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy product_images_bucket_public_read
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy product_images_bucket_admin_write
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin_user());

create policy product_images_bucket_admin_update
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin_user())
  with check (bucket_id = 'product-images' and is_admin_user());

create policy product_images_bucket_admin_delete
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin_user());
