-- Adds an optional photo per category, so the homepage/category art can
-- show a real product photo instead of the placeholder line illustration
-- (see components/illustrations/CategoryIllustration.tsx). Nullable and
-- additive only -- existing rows, policies, and the illustration fallback
-- all keep working unchanged when this is left empty.

alter table categories add column cover_image_path text;
