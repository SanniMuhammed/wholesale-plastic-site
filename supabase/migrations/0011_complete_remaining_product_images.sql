-- Continue product-specific catalogue image mappings.
-- These are only added where the product has no existing image.
with image_map(slug, storage_path) as (values
('1-6l-indomie-pet-jar','https://thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/rs_quotation_api/lgppqiww/99a47373691f4618a33b636f0f5a3772.jpg'),
('5l-round-bucket','https://m.media-amazon.com/images/I/71v-kHl7v7L.jpg'),
('small-food-bowl-with-lid','https://image.made-in-china.com/2f0j00TYvfObuthdqZ/500ml-Round-Base-Plastic-Take-out-Bowl-with-Clear-Lid.jpg'),
('300ml-pet-jar','https://static.wixstatic.com/media/98738c_e85af7d042884d0fbb5745780171bcfd~mv2.jpg/v1/fill/w_480%2Ch_534%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/98738c_e85af7d042884d0fbb5745780171bcfd~mv2.jpg'),
('deep-round-bowl','https://cdn.27.ua/sc--media--prod/default/db/29/a3/db29a336-09c3-41c7-a52d-7b6c7b5bca8c.jpg'),
('angel-basket','https://livingut.info/images/maker_tsfact1/481921-1.jpg'),
('500ml-round-food-bucket','https://www.rulydaplastic.com/uploads/202114710/plastic-bucket-for-tomato-sauce20247067634.jpg'),
('plastic-mug-set','https://static.platform.michaels.com/2c-prd/en_US/6917584780375092400.jpeg'),
('4-compartment-food-container','https://dorinstore.com/limera-4-bolmeli-kebap-kabi-ve-kapagi-siyah-100lu-gida-kabi-mikrodalga-yemek-kap-kapak-limera-35290-29-K.jpg'),
('1-5l-serving-bowl','https://petropavlovsk.zeta.kz/uploads/product_images/830/60ab3ca745823.jpg'),
('apple-basket','https://i5.walmartimages.com/seo/KQJQS-Plastic-Storage-Basket-Multipurpose-Rectangular-Organizer-for-Desktop-Cabinet-Bathroom-Easy-Clean-Durable_1245e9b6-01f5-41e5-a816-7afa5da6009a.e3cafddefee532ba903969358e5e182.jpeg'),
('flower-basket','https://tiimg.tistatic.com/fp/1/009/152/flora-basket-775.jpg'),
('3l-mixing-bowl','https://i5.walmartimages.com/asr/f916d422-ae94-44d2-a682-9765b34181a4.148c8863815fc708baefddb63766ab8a.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768'),
('45l-rectangular-basin','https://cdn.idealo.com/folder/Product/204656/3/204656361/s1_produktbild_max/lockweiler-wanne-eckig-62-cm-45-l-blau-l30061.jpg'),
('1-5l-pet-jar','https://zetazapad.kz/image/cache/catalog/prod/2023/06/21/33183-1-600x600.jpg'),
('medium-food-bowl-with-lid','https://orion91.com/99468-home_default/bol-mediano-redondo-con-tapa-hermetica-colores-surtidos-o245x12cm-7house.jpg'),
('1l-supreme-container','https://www.luembalagensplasticas.com/_jbloja/imagens/miniatura/20200311_5e69843d2108b-bfec2622cf055ca7c45d5af4db15573c2f53f395.jpg'),
('12l-round-basin','https://img.drz.lazcdn.com/static/lk/p/f7391e02f3624b27fabc9ecadb68a242.png_720x720q80.png'),
('1l-serving-bowl','https://www.posuda.ru/upload/iblock/9cd/9cd679bdd20ba8bb029d9e20a7f4b031.jpg'),
('clear-round-food-container','https://cpimg.tistatic.com/06254103/b/4/1-KG-Plastic-Food-Container.jpg'),
('stackable-storage-bin','https://cdn.bodanius.com/media/1/482218846_tayg-magazijnbox-14.5l-storage-solution_x.jpg'),
('clear-rect-food-container','https://cpimg.tistatic.com/06254103/b/4/1-KG-Plastic-Food-Container.jpg'),
('1l-pet-food-jar','https://ikrorwxhijilll5q.leadongcdn.com/cloud/poBpmKmmRliSpimmppljn/HTB1o7ZAsuGSBuNjSspbq6AiipXa51-800-800.jpg'),
('4-piece-mixing-bowl-set','https://i5.walmartimages.com/asr/f916d422-ae94-44d2-a682-9765b34181a4.148c8863815fc708baefddb63766ab8a.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768')
)
insert into public.product_images(product_id, storage_path, sort_order, is_main)
select p.id, m.storage_path, 0, true
from image_map m
join public.products p on p.slug = m.slug
where not exists (select 1 from public.product_images pi where pi.product_id = p.id);
