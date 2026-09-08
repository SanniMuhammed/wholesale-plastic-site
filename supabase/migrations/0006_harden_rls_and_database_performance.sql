-- Harden admin helper functions.
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

DROP POLICY IF EXISTS admin_profiles_all_admin ON public.admin_profiles;
DROP POLICY IF EXISTS admin_profiles_select ON public.admin_profiles;
CREATE POLICY admin_profiles_select_self
  ON public.admin_profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS categories_admin_delete ON public.categories;
DROP POLICY IF EXISTS categories_admin_update ON public.categories;
DROP POLICY IF EXISTS categories_admin_write ON public.categories;
DROP POLICY IF EXISTS categories_public_select ON public.categories;
CREATE POLICY categories_public_select ON public.categories FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin_user());
CREATE POLICY categories_admin_insert ON public.categories FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());
CREATE POLICY categories_admin_update ON public.categories FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY categories_admin_delete ON public.categories FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS colors_admin_delete ON public.colors;
DROP POLICY IF EXISTS colors_admin_update ON public.colors;
DROP POLICY IF EXISTS colors_admin_write ON public.colors;
DROP POLICY IF EXISTS colors_public_select ON public.colors;
CREATE POLICY colors_public_select ON public.colors FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin_user());
CREATE POLICY colors_admin_insert ON public.colors FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());
CREATE POLICY colors_admin_update ON public.colors FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY colors_admin_delete ON public.colors FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS company_settings_admin_update ON public.company_settings;
DROP POLICY IF EXISTS company_settings_public_select ON public.company_settings;
CREATE POLICY company_settings_public_select ON public.company_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY company_settings_admin_update ON public.company_settings FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS delivery_content_admin_update ON public.delivery_content;
DROP POLICY IF EXISTS delivery_content_public_select ON public.delivery_content;
CREATE POLICY delivery_content_public_select ON public.delivery_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY delivery_content_admin_update ON public.delivery_content FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS faqs_admin_delete ON public.faqs;
DROP POLICY IF EXISTS faqs_admin_update ON public.faqs;
DROP POLICY IF EXISTS faqs_admin_write ON public.faqs;
DROP POLICY IF EXISTS faqs_public_select ON public.faqs;
CREATE POLICY faqs_public_select ON public.faqs FOR SELECT TO anon, authenticated USING (is_published OR public.is_admin_user());
CREATE POLICY faqs_admin_insert ON public.faqs FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());
CREATE POLICY faqs_admin_update ON public.faqs FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY faqs_admin_delete ON public.faqs FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS homepage_sections_admin_update ON public.homepage_sections;
DROP POLICY IF EXISTS homepage_sections_public_select ON public.homepage_sections;
CREATE POLICY homepage_sections_public_select ON public.homepage_sections FOR SELECT TO anon, authenticated USING (is_visible OR public.is_admin_user());
CREATE POLICY homepage_sections_admin_update ON public.homepage_sections FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS product_colors_admin_write ON public.product_colors;
DROP POLICY IF EXISTS product_colors_public_select ON public.product_colors;
CREATE POLICY product_colors_public_select ON public.product_colors FOR SELECT TO anon, authenticated
  USING (public.is_admin_user() OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_colors.product_id AND p.status = 'published'));
CREATE POLICY product_colors_admin_insert ON public.product_colors FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());
CREATE POLICY product_colors_admin_update ON public.product_colors FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY product_colors_admin_delete ON public.product_colors FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS product_images_admin_write ON public.product_images;
DROP POLICY IF EXISTS product_images_public_select ON public.product_images;
CREATE POLICY product_images_public_select ON public.product_images FOR SELECT TO anon, authenticated
  USING (public.is_admin_user() OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_images.product_id AND p.status = 'published'));
CREATE POLICY product_images_admin_insert ON public.product_images FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());
CREATE POLICY product_images_admin_update ON public.product_images FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY product_images_admin_delete ON public.product_images FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS products_admin_delete ON public.products;
DROP POLICY IF EXISTS products_admin_update ON public.products;
DROP POLICY IF EXISTS products_admin_write ON public.products;
DROP POLICY IF EXISTS products_public_select ON public.products;
CREATE POLICY products_public_select ON public.products FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin_user());
CREATE POLICY products_admin_insert ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());
CREATE POLICY products_admin_update ON public.products FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY products_admin_delete ON public.products FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS wholesale_content_admin_update ON public.wholesale_content;
DROP POLICY IF EXISTS wholesale_content_public_select ON public.wholesale_content;
CREATE POLICY wholesale_content_public_select ON public.wholesale_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY wholesale_content_admin_update ON public.wholesale_content FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS orders_admin_delete ON public.orders;
DROP POLICY IF EXISTS orders_admin_select ON public.orders;
DROP POLICY IF EXISTS orders_admin_update ON public.orders;
DROP POLICY IF EXISTS orders_public_insert ON public.orders;
CREATE POLICY orders_public_insert ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY orders_admin_select ON public.orders FOR SELECT TO authenticated USING (public.is_admin_user());
CREATE POLICY orders_admin_update ON public.orders FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY orders_admin_delete ON public.orders FOR DELETE TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS order_items_admin_delete ON public.order_items;
DROP POLICY IF EXISTS order_items_admin_select ON public.order_items;
DROP POLICY IF EXISTS order_items_public_insert ON public.order_items;
CREATE POLICY order_items_public_insert ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY order_items_admin_select ON public.order_items FOR SELECT TO authenticated USING (public.is_admin_user());
CREATE POLICY order_items_admin_delete ON public.order_items FOR DELETE TO authenticated USING (public.is_admin_user());

CREATE INDEX IF NOT EXISTS product_colors_color_id_idx ON public.product_colors(color_id);
