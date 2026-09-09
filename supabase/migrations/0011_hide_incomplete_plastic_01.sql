-- Keep the incomplete placeholder product out of the public catalog until
-- real product information is supplied through the CMS.
update public.products
set status = 'draft', is_featured = false
where slug = 'plastic-01';
