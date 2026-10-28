-- ==============================================================
-- FLASHGROUP V4 – POST‑AUTH SEED (Idempotent)
-- --------------------------------------------------------------
-- Run THIS script AFTER you have manually created the demo
-- Auth users in the Supabase dashboard (buyer, supplier, admin,
-- supplier2). The `handle_new_user` trigger (defined in schema.sql)
-- will automatically create matching rows in `public.profiles`.
-- --------------------------------------------------------------
-- This script populates the remaining tables using only
-- look‑ups on `public.profiles.email`, ensuring every INSERT is
-- guarded by a NOT EXISTS check so the script can be run multiple
-- times without creating duplicate rows.
-- ==============================================================

/* --------------------------------------------------------------
   1️⃣  Update profile details (name, phone, preferred pickup)
   -------------------------------------------------------------- */
UPDATE public.profiles
   SET name = 'Nguyễn Minh Anh',
       phone = '0912345678',
       preferred_pickup_point = 'Locker KTX Khu A – ĐHQG'
 WHERE email = 'buyer@flashgroup.demo';

UPDATE public.profiles
   SET name = 'Nhà phân phối Nông sản A',
       phone = '0987654321'
 WHERE email = 'supplier@flashgroup.demo';

UPDATE public.profiles
   SET name = 'FlashGroup Admin',
       phone = '0900000000'
 WHERE email = 'admin@flashgroup.demo';

UPDATE public.profiles
   SET name = 'Nhà phân phối Gia dụng B',
       phone = '0901234567'
 WHERE email = 'supplier2@flashgroup.demo';

/* --------------------------------------------------------------
   2️⃣  Insert supplier rows (one per supplier profile)
   -------------------------------------------------------------- */
INSERT INTO public.suppliers (user_id, business_name, supplier_type,
                              verification_status, is_demo, created_at)
SELECT p.id,
       CASE p.email
         WHEN 'supplier@flashgroup.demo'  THEN 'Nhà phân phối Nông sản A – Demo'
         WHEN 'supplier2@flashgroup.demo' THEN 'Nhà phân phối Gia dụng B – Demo'
       END,
       CASE p.email
         WHEN 'supplier@flashgroup.demo'  THEN 'official_distributor'
         WHEN 'supplier2@flashgroup.demo' THEN 'manufacturer'
       END,
       'verified',
       true,
       now()
FROM public.profiles p
WHERE p.email IN ('supplier@flashgroup.demo', 'supplier2@flashgroup.demo')
  AND NOT EXISTS (
        SELECT 1 FROM public.suppliers s WHERE s.user_id = p.id
      );

/* --------------------------------------------------------------
   3️⃣  Insert demo products (linked to the first supplier)
   -------------------------------------------------------------- */
INSERT INTO public.products (supplier_id, name, category, brand, unit,
                             description, origin, stock_quantity,
                             minimum_order_quantity, warranty,
                             source_note, status, is_demo, created_at,
                             updated_at)
SELECT s.id,
       'Dâu tây Đà Lạt giống Nhật VietGAP'          AS name,
       'Nông sản tươi'                              AS category,
       'HTX Đà Lạt'                                 AS brand,
       'Hộp 500g'                                   AS unit,
       'Dâu tây giống Nhật trồng theo tiêu chuẩn VietGAP, quả đều, ngọt thanh, hái mới trong ngày.' AS description,
       'Đà Lạt, Lâm Đồng'                          AS origin,
       100                                          AS stock_quantity,
       1                                            AS minimum_order_quantity,
       'Đổi trả trong 24h nếu dập nát'              AS warranty,
       'Thu hoạch sáng sớm, xe lạnh chuyển thẳng đến trạm' AS source_note,
       'active'                                     AS status,
       true                                         AS is_demo,
       now()                                        AS created_at,
       now()                                        AS updated_at
FROM public.suppliers s
JOIN public.profiles p ON p.id = s.user_id
WHERE p.email = 'supplier@flashgroup.demo'
  AND NOT EXISTS (
        SELECT 1 FROM public.products pr
        WHERE pr.supplier_id = s.id AND pr.name = 'Dâu tây Đà Lạt giống Nhật VietGAP'
      );

/* --------------------------------------------------------------
   4️⃣  Create the “strawberry” group room (the demo room)
   -------------------------------------------------------------- */
WITH demo_product AS (
  SELECT id FROM public.products
  WHERE name = 'Dâu tây Đà Lạt giống Nhật VietGAP'
), demo_supplier AS (
  SELECT s.id FROM public.suppliers s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE p.email = 'supplier@flashgroup.demo'
)
INSERT INTO public.group_rooms
        (product_id, supplier_id, participant_count, total_quantity,
         max_participants, max_quantity, total_shipping_fee,
         pickup_point, start_at, end_at, status, created_at)
SELECT p.id,
       s.id,
       19,                     -- participant_count (already 19)
       19,                     -- total_quantity  (already 19)
       20,                     -- max_participants
       20,                     -- max_quantity
       60000,                  -- total_shipping_fee (VND)
       'Locker KTX Khu A – ĐHQG',
       now() - interval '1 day',   -- start_at (past)
       now() + interval '1 day',   -- end_at   (future)
       'active',
       now()
FROM demo_product p, demo_supplier s
WHERE NOT EXISTS (
        SELECT 1 FROM public.group_rooms gr
        WHERE gr.product_id = p.id AND gr.supplier_id = s.id
      );

/* --------------------------------------------------------------
   5️⃣  Price tiers for the demo room
   -------------------------------------------------------------- */
WITH demo_room AS (
  SELECT gr.id FROM public.group_rooms gr
  JOIN public.products pr ON pr.id = gr.product_id
  WHERE pr.name = 'Dâu tây Đà Lạt giống Nhật VietGAP'
)
INSERT INTO public.price_tiers (room_id, min_quantity, max_quantity, price)
SELECT dr.id, v.min_quantity, v.max_quantity, v.price
FROM demo_room dr
CROSS JOIN (
  VALUES (1,  4, 120000),
         (5,  9, 110000),
         (10,19,  99000),
         (20,NULL,89000)
) AS v(min_quantity, max_quantity, price)
WHERE NOT EXISTS (
        SELECT 1 FROM public.price_tiers pt WHERE pt.room_id = dr.id
      );

/* --------------------------------------------------------------
   6️⃣  Optional demo data – favorites, notifications, etc.
   -------------------------------------------------------------- */
-- Favorite (idempotent via primary key conflict)
INSERT INTO public.favorites (user_id, room_id, created_at)
SELECT (SELECT id FROM public.profiles WHERE email = 'buyer@flashgroup.demo'),
       (SELECT gr.id FROM public.group_rooms gr
        JOIN public.products pr ON pr.id = gr.product_id
        WHERE pr.name = 'Dâu tây Đà Lạt giống Nhật VietGAP'),
       now()
ON CONFLICT (user_id, room_id) DO NOTHING;

-- Welcome notifications (idempotent via primary key conflict – generate a constant UUID)
INSERT INTO public.notifications (id, user_id, type, title, message, created_at)
SELECT gen_random_uuid(), p.id, 'welcome', 'Welcome to FlashGroup!',
       'Your demo account is ready. Enjoy grouping!', now()
FROM public.profiles p
WHERE p.email IN ('buyer@flashgroup.demo',
                  'supplier@flashgroup.demo',
                  'admin@flashgroup.demo',
                  'supplier2@flashgroup.demo')
ON CONFLICT DO NOTHING;

-- End of seed script
