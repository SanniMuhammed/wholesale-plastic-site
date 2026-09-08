-- Keep public/anonymous reads independent of the admin-only helper function.
-- This prevents anon requests from needing EXECUTE on is_admin_user().

DROP POLICY IF EXISTS categories_public_select ON public.categories;
CREATE POLICY categories_public_select_anon
  ON public.categories FOR SELECT TO anon
  USING (is_active);
CREATE POLICY categories_public_select_authenticated
  ON public.categories FOR SELECT TO authenticated
  USING (is_active OR public.is_admin_user());

DROP POLICY IF EXISTS colors_public_select ON public.colors;
CREATE POLICY colors_public_select_anon
  ON public.colors FOR SELECT TO anon
  USING (is_active);
CREATE POLICY colors_public_select_authenticated
  ON public.colors FOR SELECT TO authenticated
  USING (is_active OR public.is_admin_user());

DROP POLICY IF EXISTS faqs_public_select ON public.faqs;
CREATE POLICY faqs_public_select_anon
  ON public.faqs FOR SELECT TO anon
  USING (is_published);
CREATE POLICY faqs_public_select_authenticated
  ON public.faqs FOR SELECT TO authenticated
  USING (is_published OR public.is_admin_user());

DROP POLICY IF EXISTS homepage_sections_public_select ON public.homepage_sections;
CREATE POLICY homepage_sections_public_select_anon
  ON public.homepage_sections FOR SELECT TO anon
  USING (is_visible);
CREATE POLICY homepage_sections_public_select_authenticated
  ON public.homepage_sections FOR SELECT TO authenticated
  USING (is_visible OR public.is_admin_user());

DROP POLICY IF EXISTS product_colors_public_select ON public.product_colors;
CREATE POLICY product_colors_public_select_anon
  ON public.product_colors FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_colors.product_id
      AND p.status = 'published'
  ));
CREATE POLICY product_colors_public_select_authenticated
  ON public.product_colors FOR SELECT TO authenticated
  USING (public.is_admin_user() OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_colors.product_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS product_images_public_select ON public.product_images;
CREATE POLICY product_images_public_select_anon
  ON public.product_images FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_images.product_id
      AND p.status = 'published'
  ));
CREATE POLICY product_images_public_select_authenticated
  ON public.product_images FOR SELECT TO authenticated
  USING (public.is_admin_user() OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_images.product_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS products_public_select ON public.products;
CREATE POLICY products_public_select_anon
  ON public.products FOR SELECT TO anon
  USING (status = 'published');
CREATE POLICY products_public_select_authenticated
  ON public.products FOR SELECT TO authenticated
  USING (status = 'published' OR public.is_admin_user());
