-- Migration script to add Gift Marketplace columns to products table

-- 1. Add new array columns for gift tags
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS recipient_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS occasion_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interest_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS style_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS zodiac_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS numerology_tags text[] DEFAULT '{}';

-- Notes:
-- We are keeping the old compatibility columns (width, depth, etc.) intact 
-- so that existing logic doesn't crash if it tries to read them, 
-- but they will be hidden from the UI.
