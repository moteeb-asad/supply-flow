-- Ensure category names cannot be duplicated.
-- This prevents duplicates even if casing or surrounding spaces differ.
-- Examples blocked:
-- 'Dairy', 'dairy', 'DAIRY', ' Dairy ', 'dairy '

create unique index if not exists categories_name_normalized_unique
on public.categories (lower(trim(name)));