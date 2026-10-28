-- ==============================================================
-- FLASHGROUP V4 – RESET DEMO PUBLIC DATA
-- --------------------------------------------------------------
-- This script removes all demo application data that references the
-- four hard‑coded UUIDs which were erroneously inserted into the
-- Supabase auth tables.
--
-- It ONLY touches tables in the public schema and respects all foreign
-- key constraints by deleting child rows before parents.
-- --------------------------------------------------------------
-- List of invalid demo UUIDs (hard‑coded previously)
--   00000000-0000-0000-0000-000000000001
--   00000000-0000-0000-0000-000000000002
--   00000000-0000-0000-0000-000000000003
--   00000000-0000-0000-0000-000000000004
-- --------------------------------------------------------------
BEGIN;

-- 1️⃣  Refund requests (child of orders)
DELETE FROM public.refund_requests rr
USING public.orders o
WHERE rr.order_id = o.id
  AND o.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );

-- 2️⃣  Reviews (may reference users, suppliers or orders)
DELETE FROM public.reviews r
WHERE r.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  )
   OR r.supplier_id IN (
     SELECT s.id FROM public.suppliers s
     WHERE s.user_id IN (
       '00000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-000000000004'
     )
   )
   OR r.order_id IN (
     SELECT o.id FROM public.orders o
     WHERE o.user_id IN (
       '00000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-000000000004'
     )
   );

-- 3️⃣  Notifications (user, room or order reference)
DELETE FROM public.notifications n
WHERE n.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  )
   OR n.room_id IN (
     SELECT gr.id FROM public.group_rooms gr
     WHERE gr.supplier_id IN (
       SELECT s.id FROM public.suppliers s
       WHERE s.user_id IN (
         '00000000-0000-0000-0000-000000000001',
         '00000000-0000-0000-0000-000000000002',
         '00000000-0000-0000-0000-000000000003',
         '00000000-0000-0000-0000-000000000004'
       )
     )
   )
   OR n.order_id IN (
     SELECT o.id FROM public.orders o
     WHERE o.user_id IN (
       '00000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-000000000004'
     )
   );

-- 4️⃣  Favorites (user or room reference)
DELETE FROM public.favorites f
WHERE f.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  )
   OR f.room_id IN (
     SELECT gr.id FROM public.group_rooms gr
     WHERE gr.supplier_id IN (
       SELECT s.id FROM public.suppliers s
       WHERE s.user_id IN (
         '00000000-0000-0000-0000-000000000001',
         '00000000-0000-0000-0000-000000000002',
         '00000000-0000-0000-0000-000000000003',
         '00000000-0000-0000-0000-000000000004'
       )
     )
   );

-- 5️⃣  Orders (direct user reference)
DELETE FROM public.orders o
WHERE o.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );

-- 6️⃣  Group participations (direct user reference)
DELETE FROM public.group_participations gp
WHERE gp.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );

-- 7️⃣  Price tiers (child of group_rooms)
DELETE FROM public.price_tiers pt
WHERE pt.room_id IN (
  SELECT gr.id FROM public.group_rooms gr
  WHERE gr.supplier_id IN (
    SELECT s.id FROM public.suppliers s
    WHERE s.user_id IN (
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000003',
      '00000000-0000-0000-0000-000000000004'
    )
  )
);

-- 8️⃣  Group rooms (references product_id & supplier_id)
DELETE FROM public.group_rooms gr
WHERE gr.supplier_id IN (
  SELECT s.id FROM public.suppliers s
  WHERE s.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  )
);

-- 9️⃣  Products (references supplier_id)
DELETE FROM public.products p
WHERE p.supplier_id IN (
  SELECT s.id FROM public.suppliers s
  WHERE s.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  )
);

-- 🔟  Suppliers (references profiles.id)
DELETE FROM public.suppliers s
WHERE s.user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );

-- 1️⃣1️⃣  Profiles (the demo rows themselves)
DELETE FROM public.profiles p
WHERE p.id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );

COMMIT;