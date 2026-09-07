-- Allow the homepage hero to use a dedicated mobile image while retaining
-- the desktop image as the fallback when no mobile image is configured.

alter table homepage_sections add column hero_mobile_image_path text;
