-- Keep product photography one-to-one across the catalogue.
-- Shared image URLs were being assigned to many unrelated products, creating
-- misleading duplicate photos. Products without a trustworthy unique image
-- intentionally fall back to the category illustration in the frontend.
delete from public.product_images pi
where pi.storage_path in (
  select storage_path
  from public.product_images
  group by storage_path
  having count(distinct product_id) > 1
);
