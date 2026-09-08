-- 1. Bổ sung field cho Store Branding vào bảng profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS store_email text;

-- (Optional) Hỗ trợ Product Gallery tương lai (nhiều ảnh)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}'::text[];

-- 2. Tạo Bucket 'done-stores' cho logo và cover
INSERT INTO storage.buckets (id, name, public) 
VALUES ('done-stores', 'done-stores', true) 
ON CONFLICT (id) DO NOTHING;

-- Xóa Policy cũ nếu có
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;

-- 3. Tạo RLS Policies cho Bucket 'done-stores'
CREATE POLICY "Public Access Stores" ON storage.objects FOR SELECT USING (bucket_id = 'done-stores');
CREATE POLICY "Auth Upload Stores" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'done-stores' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update Stores" ON storage.objects FOR UPDATE USING (bucket_id = 'done-stores' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Stores" ON storage.objects FOR DELETE USING (bucket_id = 'done-stores' AND auth.role() = 'authenticated');

-- Nhắc lại Policy cho Bucket 'done-products' (Tránh lỡ tay bị mất)
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'done-products');
CREATE POLICY "Auth Upload Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'done-products' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update Products" ON storage.objects FOR UPDATE USING (bucket_id = 'done-products' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Products" ON storage.objects FOR DELETE USING (bucket_id = 'done-products' AND auth.role() = 'authenticated');
