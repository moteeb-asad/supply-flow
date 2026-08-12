-- Add missing categories and descriptions for existing categories

-- 1. Update descriptions for existing categories
update public.categories
set description = case name
  when 'Personal Care' then 'Hygiene, grooming, and personal care products'
  when 'Dry Goods' then 'Shelf-stable pantry items such as rice, flour, grains, and pulses'
  when 'Frozen Foods' then 'Food items stored and managed in frozen condition'
  when 'Canned Goods' then 'Preserved food items packed in cans or tins'
  when 'Produce' then 'Fresh fruits, vegetables, and other perishable produce'
  when 'Beverages' then 'Bottled, canned, and packaged drinks'
  when 'Meat & Poultry' then 'Fresh, frozen, or packaged meat and poultry products'
  when 'Spices & Herbs' then 'Seasonings, dried herbs, spices, and spice blends'
  when 'Snacks' then 'Packaged snack foods and ready-to-eat light items'
  when 'Household Supplies' then 'General household utility and non-food supply items'
  when 'Seafood' then 'Fresh, frozen, or packaged fish and seafood products'
  when 'Bakery' then 'Bread, pastries, baked goods, and bakery-related items'
  when 'Condiments' then 'Sauces, spreads, pickles, dressings, and table condiments'
  when 'Dairy' then 'Milk, cheese, yogurt, butter, and other dairy products'
  else description
end
where name in (
  'Personal Care',
  'Dry Goods',
  'Frozen Foods',
  'Canned Goods',
  'Produce',
  'Beverages',
  'Meat & Poultry',
  'Spices & Herbs',
  'Snacks',
  'Household Supplies',
  'Seafood',
  'Bakery',
  'Condiments',
  'Dairy'
);


-- 2. Insert missing categories only if they do not already exist
insert into public.categories (
  name,
  description,
  created_by
)
select
  v.name,
  v.description,
  p.id as created_by
from (
  values
    (
      'Cleaning Supplies',
      'Cleaning products, detergents, sanitizers, and hygiene-related supplies'
    ),
    (
      'Packaging Supplies',
      'Bags, boxes, containers, labels, wraps, and other packaging materials'
    ),
    (
      'Oils & Fats',
      'Cooking oils, ghee, butter, margarine, shortening, and related fat-based products'
    )
) as v(name, description)
cross join public.profiles p
where p.email = '' // super_admin email here
  and not exists (
    select 1
    from public.categories c
    where lower(trim(c.name)) = lower(trim(v.name))
  );