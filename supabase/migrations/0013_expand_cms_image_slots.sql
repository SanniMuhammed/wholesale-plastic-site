alter table public.delivery_content
  add column if not exists step_1_image_path text,
  add column if not exists step_2_image_path text,
  add column if not exists step_3_image_path text,
  add column if not exists step_4_image_path text,
  add column if not exists step_5_image_path text;
