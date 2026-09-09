-- Production readiness data cleanup.
-- Keep incomplete catalog placeholders out of the public storefront until their
-- real product information is supplied through the CMS.
update public.products
set status = 'draft', is_featured = false
where slug = 'plastic-01'
  and (name_en = 'Plastic 01' or short_description_en = '' or description_en = '');

-- Seed the business contact details already configured for the production site.
update public.company_settings
set company_name = 'Sherinab Venture LTD',
    email = 'young.muhammedd@gmail.com',
    phone = '08132652625',
    address = 'Herbert Macaulay Street, Ebute Metta, Lagos State',
    whatsapp_number = '08132652625'
where id = 1;
