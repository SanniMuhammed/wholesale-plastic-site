-- Visitors may submit reviews without an account.
-- New submissions are always pending so public visitors cannot publish content directly.
DROP POLICY IF EXISTS product_reviews_public_insert ON public.product_reviews;

CREATE POLICY product_reviews_public_insert
  ON public.product_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    is_published = false
    AND rating BETWEEN 1 AND 5
    AND length(trim(customer_name)) BETWEEN 2 AND 80
    AND length(trim(review_en)) BETWEEN 10 AND 1200
    AND length(trim(review_fr)) BETWEEN 10 AND 1200
    AND EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.id = product_id
        AND p.status = 'published'
    )
  );
