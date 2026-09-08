-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Profiles Table (Update/Create)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'buyer',
  status text DEFAULT 'active', -- active, suspended, pending, rejected
  
  -- Seller specific
  store_name text,
  store_description text,
  phone_number text,
  address text,
  pickup_address text,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, status, store_name, store_description, phone_number, address, pickup_address)
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
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  brand text,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  description text,
  image_url text,
  stock integer DEFAULT 0,
  delivery_days integer DEFAULT 1,
  
  -- Admin control
  is_available boolean DEFAULT false,
  approval_status text DEFAULT 'pending', -- pending, active, rejected, hidden
  rejection_reason text,

  -- Compatibility Fields
  width numeric,
  depth numeric,
  height numeric,
  max_load numeric,
  vesa_supported text[],
  supported_monitor_size numeric,
  clamp_thickness_max numeric,
  desk_thickness numeric,
  style text[],

  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);


-- 3. Orders Table (Master Order)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- SET NULL to keep order when user is deleted
  buyer_name_snapshot text,
  buyer_email_snapshot text,
  total_price numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending', -- pending, paid, completed, cancelled
  shipping_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);


-- 4. Order Items Table (Sub-orders for Sellers)
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  status text DEFAULT 'pending', -- pending, preparing, shipped, cancelled
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);
CREATE POLICY "Buyers can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);
CREATE POLICY "Sellers can view their order items" ON public.order_items FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their order items status" ON public.order_items FOR UPDATE USING (auth.uid() = seller_id);

-- Storage bucket for products (if not exists)
insert into storage.buckets (id, name, public)
values ('done-products', 'done-products', true)
on conflict do nothing;

create policy "Product images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'done-products' );

create policy "Anyone can upload product images."
  on storage.objects for insert
  with check ( bucket_id = 'done-products' );
