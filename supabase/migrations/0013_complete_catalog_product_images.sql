-- Complete the remaining published-product image assignments.
-- Keep each catalogue item on its own image URL; do not reuse one photo
-- for unrelated products.

-- Rebuild the affected image rows so this migration is safe after the
-- duplicate-image cleanup migration and on a fresh database.
delete from public.product_images pi
using public.products p
where pi.product_id = p.id
  and p.slug in (
    'round-serving-bowl-set',
    '8l-round-bucket',
    '2l-round-food-bucket',
    'plastic-colander',
    'collapsible-utility-bucket',
    'clear-rect-food-container',
    '4-piece-mixing-bowl-set',
    '1l-serving-bowl'
  );

insert into public.product_images (product_id, storage_path, sort_order, is_main)
select p.id, v.storage_path, 0, true
from public.products p
join (
  values
    (
      'round-serving-bowl-set',
      'https://i5.walmartimages.com/seo/DecorRack-Serving-Bowls-with-Lids-1-Gallon-Random-Colors-3-Bowls_3da9203f-c14a-4a4b-adcc-77f03c1979d8.23abc07760fb03b1a24d366322d760b8.jpeg'
    ),
    (
      '8l-round-bucket',
      'https://pictures-nigeria.jijistatic.net/130001602_NjIwLTYyMC05ZDFjMTU1MWYy.webp'
    ),
    (
      '2l-round-food-bucket',
      'https://www.plasticstore.ng/wp-content/uploads/2026/07/2litre-round-bucket.jpg?x60797='
    ),
    (
      'plastic-colander',
      'https://upload.wikimedia.org/wikipedia/commons/1/11/Yellow_plastic_colander_2017_-_C.jpg'
    ),
    (
      'collapsible-utility-bucket',
      'https://cpimg.tistatic.com/09479603/b/4/EXCLUZO-Collapsible-Plastic-Bucket-Flexible-Cleaning-Bucket-Space-Saving-10L-BPA-Free-Outdoor-Waterpot-with-Handle-for-Garden-Camping-for-House-Cleaning.jpg'
    ),
    (
      'clear-rect-food-container',
      'https://www.monouso.de/59091-large_default/plastikdose-rechteckig-pp-mit-deckel-1000ml-50-stueck.jpg'
    ),
    (
      '4-piece-mixing-bowl-set',
      'https://i5.walmartimages.com/seo/Bowls-Lids-Set-Plastic-Mixing-Bowls-Kitchen-Preparing-Serving-Storing-Set-4-Includes-4-Bowls-4-Kids-Beat-Nesting-Bowls-Sealing-Lids_eb89e62d-907d-4258-adaf-b2df46d49c1b.8b2533f7c3fc18bdad6d8875702c6e55.jpeg'
    ),
    (
      '1l-serving-bowl',
      'https://mugiss.com/Images/product/mugiss-lunar-kase-1-lt-m-kal-0001-turkuaz-0-01.jpg'
    )
) as v(slug, storage_path) on p.slug = v.slug
where p.status = 'published';
