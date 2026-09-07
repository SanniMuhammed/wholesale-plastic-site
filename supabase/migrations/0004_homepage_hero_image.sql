-- Adds one optional photo for the homepage hero visual.
-- The existing illustrated hero remains the fallback when this is empty.

alter table homepage_sections add column hero_image_path text;
