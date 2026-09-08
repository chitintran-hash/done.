-- RUN THIS IN SUPABASE SQL EDITOR TO UPGRADE TO PHASE 7

-- 1. Add technical_specs JSONB column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS technical_specs jsonb DEFAULT '{}'::jsonb;

-- (Optional) If you want to clean up old specific columns, you can drop them, but keeping them doesn't hurt.
-- ALTER TABLE public.products DROP COLUMN IF EXISTS width, depth, height, max_load, vesa_supported, supported_monitor_size, clamp_thickness_max, desk_thickness, style;

-- 2. Storage Bucket (Run this only if you haven't created the bucket in the Dashboard)
-- IMPORTANT: It is HIGHLY recommended to create the bucket 'done-products' manually via the Supabase Dashboard -> Storage -> New Bucket
-- to ensure the underlying S3 backend creates it properly.

-- 3. Fix Profiles Trigger (Ensure it's robust and handles all Seller fields)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, role, status, 
    store_name, store_description, phone_number, address, pickup_address
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'buyer'),
    CASE WHEN new.raw_user_meta_data->>'role' = 'seller' THEN 'pending' ELSE 'active' END,
    new.raw_user_meta_data->>'store_name',
    new.raw_user_meta_data->>'store_description',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'pickup_address'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    store_name = EXCLUDED.store_name,
    store_description = EXCLUDED.store_description,
    phone_number = EXCLUDED.phone_number,
    address = EXCLUDED.address,
    pickup_address = EXCLUDED.pickup_address;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
