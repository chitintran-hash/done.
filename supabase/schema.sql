-- ====================================================================
-- FLASHGROUP V4 — COMPLETE DATABASE SCHEMA
-- PostgreSQL / Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ====================================================================

-- ─── EXTENSIONS ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TABLES ───────────────────────────────────────────────────────────────────

-- 1. PROFILES (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  text        NOT NULL,
  email                 text,
  phone                 text,
  role                  text        NOT NULL CHECK (role IN ('buyer','supplier','admin')),
  preferred_pickup_point text,
  status                text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 2. SUPPLIERS
CREATE TABLE IF NOT EXISTS public.suppliers (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name         text        NOT NULL,
  supplier_type         text        NOT NULL
                          CHECK (supplier_type IN ('manufacturer','official_distributor','local_retailer','wholesaler')),
  verification_status   text        NOT NULL DEFAULT 'pending'
                          CHECK (verification_status IN ('pending','verified','rejected','suspended')),
  business_registration text,
  contact_phone         text,
  location              text,
  source_description    text,
  rating                numeric     NOT NULL DEFAULT 0,
  total_reviews         integer     NOT NULL DEFAULT 0,
  is_demo               boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id              uuid        NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  name                     text        NOT NULL,
  category                 text        NOT NULL,
  brand                    text,
  unit                     text        NOT NULL,
  description              text,
  image                    text,
  origin                   text,
  stock_quantity           integer     NOT NULL DEFAULT 0,
  minimum_order_quantity   integer     NOT NULL DEFAULT 1,
  warranty                 text,
  source_note              text,
  status                   text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  is_demo                  boolean     NOT NULL DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- 4. GROUP ROOMS
CREATE TABLE IF NOT EXISTS public.group_rooms (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  supplier_id       uuid        NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  participant_count integer     NOT NULL DEFAULT 0,
  total_quantity    integer     NOT NULL DEFAULT 0,
  max_participants  integer     NOT NULL,
  max_quantity      integer     NOT NULL,
  total_shipping_fee numeric    NOT NULL DEFAULT 0,
  pickup_point      text        NOT NULL,
  pickup_address    text,
  start_at          timestamptz NOT NULL,
  end_at            timestamptz NOT NULL,
  status            text        NOT NULL DEFAULT 'active'
                      CHECK (status IN ('draft','active','full','closed','successful','cancelled')),
  final_price       numeric,
  final_quantity    integer,
  closed_at         timestamptz,
  distance_meters   integer     NOT NULL DEFAULT 500,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- 5. PRICE TIERS
CREATE TABLE IF NOT EXISTS public.price_tiers (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      uuid    NOT NULL REFERENCES public.group_rooms(id) ON DELETE CASCADE,
  min_quantity integer NOT NULL,
  max_quantity integer,
  price        numeric NOT NULL
);

-- 6. GROUP PARTICIPATIONS
CREATE TABLE IF NOT EXISTS public.group_participations (
  id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id   uuid        NOT NULL REFERENCES public.group_rooms(id) ON DELETE CASCADE,
  user_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity  integer     NOT NULL CHECK (quantity > 0),
  status    text        NOT NULL DEFAULT 'reserved'
              CHECK (status IN ('reserved','awaiting_payment','paid','cancelled')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id          uuid        NOT NULL REFERENCES public.group_rooms(id) ON DELETE CASCADE,
  participation_id uuid        NOT NULL UNIQUE REFERENCES public.group_participations(id) ON DELETE CASCADE,
  user_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity         integer     NOT NULL CHECK (quantity > 0),
  unit_price       numeric     NOT NULL,
  product_subtotal numeric     NOT NULL,
  shipping_fee     numeric     NOT NULL,
  total_amount     numeric     NOT NULL,
  pickup_point     text,
  pickup_address   text,
  pickup_code      text,
  status           text        NOT NULL DEFAULT 'awaiting_payment'
                     CHECK (status IN (
                       'awaiting_payment','paid','preparing','in_transit',
                       'ready_for_pickup','picked_up','cancelled','refunded'
                     )),
  payment_method   text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  paid_at          timestamptz,
  picked_up_at     timestamptz
);

-- 8. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id    uuid        NOT NULL REFERENCES public.group_rooms(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, room_id)
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  title      text        NOT NULL,
  message    text        NOT NULL,
  room_id    uuid,
  order_id   uuid,
  read       boolean     NOT NULL DEFAULT false,
  event_key  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid    NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id         uuid    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  supplier_id     uuid    NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  product_rating  integer NOT NULL CHECK (product_rating  BETWEEN 1 AND 5),
  delivery_rating integer NOT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
  service_rating  integer NOT NULL CHECK (service_rating  BETWEEN 1 AND 5),
  comment         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 11. REFUND REQUESTS
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid        NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason      text        NOT NULL,
  details     text,
  status      text        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','rejected')),
  admin_note  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_group_rooms_status       ON public.group_rooms (status);
CREATE INDEX IF NOT EXISTS idx_group_rooms_end_at       ON public.group_rooms (end_at);
CREATE INDEX IF NOT EXISTS idx_group_rooms_supplier     ON public.group_rooms (supplier_id);
CREATE INDEX IF NOT EXISTS idx_price_tiers_room         ON public.price_tiers (room_id);
CREATE INDEX IF NOT EXISTS idx_participations_room      ON public.group_participations (room_id);
CREATE INDEX IF NOT EXISTS idx_participations_user      ON public.group_participations (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user              ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_room              ON public.orders (room_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user       ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_event_key  ON public.notifications (event_key);

-- ─── TRIGGERS ─────────────────────────────────────────────────────────────────

-- Trigger: auto-create profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role   text;
  v_name   text;
  v_phone  text;
  v_pickup text;
BEGIN
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'buyer');
  IF v_role NOT IN ('buyer','supplier','admin') THEN
    v_role := 'buyer';
  END IF;

  v_name   := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email,'@',1));
  v_phone  := new.raw_user_meta_data->>'phone';
  v_pickup := new.raw_user_meta_data->>'preferred_pickup_point';

  INSERT INTO public.profiles
    (id, name, email, phone, role, preferred_pickup_point, status, created_at)
  VALUES
    (new.id, v_name, new.email, v_phone, v_role, v_pickup, 'active', now())
  ON CONFLICT (id) DO UPDATE
    SET name                  = EXCLUDED.name,
        phone                 = COALESCE(EXCLUDED.phone,  public.profiles.phone),
        preferred_pickup_point= COALESCE(EXCLUDED.preferred_pickup_point,
                                         public.profiles.preferred_pickup_point);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger: recalculate supplier rating after a new review
CREATE OR REPLACE FUNCTION public.handle_new_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_avg   numeric;
  v_total integer;
BEGIN
  SELECT
    ROUND(AVG((product_rating + delivery_rating + service_rating) / 3.0), 1),
    COUNT(*)
  INTO v_avg, v_total
  FROM public.reviews
  WHERE supplier_id = new.supplier_id;

  UPDATE public.suppliers
  SET rating       = COALESCE(v_avg,   0),
      total_reviews= COALESCE(v_total, 0)
  WHERE id = new.supplier_id;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_review();

-- ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

-- Returns true when the calling session belongs to an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ─── RPC: join_group_room ──────────────────────────────────────────────────────
-- Atomically joins a buyer into a group room, updates counts/price, and emits a notification.
CREATE OR REPLACE FUNCTION public.join_group_room(p_room_id uuid, p_quantity integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id             uuid;
  v_room                record;
  v_old_price           numeric;
  v_new_price           numeric;
  v_new_participant_count integer;
  v_new_total_quantity  integer;
  v_participation_id    uuid;
  v_price_unlocked      boolean := false;
  v_room_status         text;
  v_final_price         numeric := null;
  v_final_quantity      integer := null;
  v_closed_at           timestamptz := null;
BEGIN
  -- Identify authenticated user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Vui lòng đăng nhập để tham gia phòng gom.';
  END IF;

  IF p_quantity <= 0 OR p_quantity > 5 THEN
    RAISE EXCEPTION 'Số lượng mỗi lượt gom phải từ 1 đến 5 đơn vị.';
  END IF;

  -- Lock room row to prevent race conditions
  SELECT * INTO v_room
  FROM public.group_rooms
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Phòng gom không tồn tại.';
  END IF;

  -- Validate room state
  IF v_room.status <> 'active' THEN
    RAISE EXCEPTION 'Phòng gom không còn nhận đơn (trạng thái: %).', v_room.status;
  END IF;

  IF v_room.end_at <= now() THEN
    RAISE EXCEPTION 'Phòng gom đã hết hạn đăng ký.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.group_participations
    WHERE room_id = p_room_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Bạn đã tham gia phòng gom này rồi.';
  END IF;

  IF v_room.participant_count >= v_room.max_participants THEN
    RAISE EXCEPTION 'Phòng gom đã đủ số người tối đa (%).', v_room.max_participants;
  END IF;

  IF v_room.total_quantity + p_quantity > v_room.max_quantity THEN
    RAISE EXCEPTION 'Số lượng vượt quá giới hạn còn lại (còn % đơn vị).',
      (v_room.max_quantity - v_room.total_quantity);
  END IF;

  -- Current price (before join)
  SELECT price INTO v_old_price
  FROM public.price_tiers
  WHERE room_id = p_room_id AND min_quantity <= v_room.total_quantity
  ORDER BY min_quantity DESC
  LIMIT 1;

  IF v_old_price IS NULL THEN
    SELECT price INTO v_old_price
    FROM public.price_tiers
    WHERE room_id = p_room_id
    ORDER BY min_quantity ASC
    LIMIT 1;
  END IF;

  -- Insert participation
  INSERT INTO public.group_participations (room_id, user_id, quantity, status, joined_at)
  VALUES (p_room_id, v_user_id, p_quantity, 'reserved', now())
  RETURNING id INTO v_participation_id;

  -- New totals
  v_new_participant_count := v_room.participant_count + 1;
  v_new_total_quantity    := v_room.total_quantity    + p_quantity;

  -- New price tier
  SELECT price INTO v_new_price
  FROM public.price_tiers
  WHERE room_id = p_room_id AND min_quantity <= v_new_total_quantity
  ORDER BY min_quantity DESC
  LIMIT 1;

  IF v_new_price IS NULL THEN
    v_new_price := v_old_price;
  END IF;

  IF v_new_price < v_old_price THEN
    v_price_unlocked := true;
  END IF;

  v_room_status := v_room.status;

  -- Auto-finalize when room is full
  IF v_new_total_quantity >= v_room.max_quantity
     OR v_new_participant_count >= v_room.max_participants THEN
    v_room_status    := 'successful';
    v_final_price    := v_new_price;
    v_final_quantity := v_new_total_quantity;
    v_closed_at      := now();
  END IF;

  -- Update room counters
  UPDATE public.group_rooms
  SET participant_count = v_new_participant_count,
      total_quantity    = v_new_total_quantity,
      status            = v_room_status,
      final_price       = COALESCE(v_final_price,    final_price),
      final_quantity    = COALESCE(v_final_quantity, final_quantity),
      closed_at         = COALESCE(v_closed_at,      closed_at)
  WHERE id = p_room_id;

  -- Push notification to participant
  INSERT INTO public.notifications (user_id, type, title, message, room_id, event_key)
  VALUES (
    v_user_id,
    CASE WHEN v_price_unlocked THEN 'price_unlock' ELSE 'system' END,
    CASE WHEN v_price_unlocked THEN 'Mở khóa mức giá ưu đãi mới!'
                               ELSE 'Tham gia nhóm gom thành công' END,
    'Bạn đã đặt ' || p_quantity || ' đơn vị. Đơn giá hiện tại: '
      || to_char(v_new_price, 'FM999,999,999') || 'đ.',
    p_room_id,
    'join-' || p_room_id || '-' || v_user_id
  );

  RETURN json_build_object(
    'participation_id',   v_participation_id,
    'participant_count',  v_new_participant_count,
    'total_quantity',     v_new_total_quantity,
    'old_price',          v_old_price,
    'new_price',          v_new_price,
    'price_unlocked',     v_price_unlocked,
    'saved_per_unit',     v_old_price - v_new_price,
    'room_status',        v_room_status,
    'final_price',        v_final_price
  );
END;
$$;

-- ─── RPC: finalize_group_room ──────────────────────────────────────────────────
-- Manually finalize a single room (supplier / admin action).
CREATE OR REPLACE FUNCTION public.finalize_group_room(p_room_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room        record;
  v_final_price numeric;
BEGIN
  SELECT * INTO v_room
  FROM public.group_rooms
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Phòng gom không tồn tại.';
  END IF;

  IF v_room.status IN ('successful','closed','cancelled') THEN
    RETURN json_build_object('success', false, 'message', 'Phòng đã được chốt trước đó.');
  END IF;

  -- Determine final price from price tiers
  SELECT price INTO v_final_price
  FROM public.price_tiers
  WHERE room_id = p_room_id AND min_quantity <= v_room.total_quantity
  ORDER BY min_quantity DESC
  LIMIT 1;

  IF v_final_price IS NULL THEN
    SELECT price INTO v_final_price
    FROM public.price_tiers
    WHERE room_id = p_room_id
    ORDER BY min_quantity ASC
    LIMIT 1;
  END IF;

  UPDATE public.group_rooms
  SET status         = CASE WHEN v_room.total_quantity > 0 THEN 'successful' ELSE 'cancelled' END,
      final_price    = v_final_price,
      final_quantity = total_quantity,
      closed_at      = now()
  WHERE id = p_room_id;

  -- Move all reserved participations to awaiting_payment
  UPDATE public.group_participations
  SET status = 'awaiting_payment'
  WHERE room_id = p_room_id AND status = 'reserved';

  RETURN json_build_object(
    'success',         true,
    'room_id',         p_room_id,
    'status',          CASE WHEN v_room.total_quantity > 0 THEN 'successful' ELSE 'cancelled' END,
    'final_price',     v_final_price,
    'final_quantity',  v_room.total_quantity
  );
END;
$$;

-- ─── RPC: finalize_expired_rooms ─────────────────────────────────────────────
-- Sweeps all active rooms whose end_at has passed and finalizes them.
CREATE OR REPLACE FUNCTION public.finalize_expired_rooms()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_r     record;
  v_count integer := 0;
BEGIN
  FOR v_r IN
    SELECT id FROM public.group_rooms
    WHERE status = 'active' AND end_at <= now()
  LOOP
    PERFORM public.finalize_group_room(v_r.id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_rooms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_tiers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests      ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "profiles_select"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin"   ON public.profiles;

CREATE POLICY "profiles_select"  ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update"  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_admin"   ON public.profiles FOR ALL    TO authenticated
  USING (public.is_admin());

-- suppliers
DROP POLICY IF EXISTS "suppliers_select" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_update" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_admin"  ON public.suppliers;

CREATE POLICY "suppliers_select" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "suppliers_update" ON public.suppliers FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "suppliers_admin"  ON public.suppliers FOR ALL    TO authenticated
  USING (public.is_admin());

-- products
DROP POLICY IF EXISTS "products_select" ON public.products;
DROP POLICY IF EXISTS "products_insert" ON public.products;
DROP POLICY IF EXISTS "products_update" ON public.products;

CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON public.products FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_id AND user_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY "products_update" ON public.products FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_id AND user_id = auth.uid())
    OR public.is_admin()
  );

-- group_rooms
DROP POLICY IF EXISTS "rooms_select" ON public.group_rooms;
DROP POLICY IF EXISTS "rooms_insert" ON public.group_rooms;
DROP POLICY IF EXISTS "rooms_update" ON public.group_rooms;

CREATE POLICY "rooms_select" ON public.group_rooms FOR SELECT USING (true);
CREATE POLICY "rooms_insert" ON public.group_rooms FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_id AND user_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY "rooms_update" ON public.group_rooms FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_id AND user_id = auth.uid())
    OR public.is_admin()
  );

-- price_tiers
DROP POLICY IF EXISTS "tiers_select" ON public.price_tiers;
DROP POLICY IF EXISTS "tiers_write"  ON public.price_tiers;

CREATE POLICY "tiers_select" ON public.price_tiers FOR SELECT USING (true);
CREATE POLICY "tiers_write"  ON public.price_tiers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_rooms r
      JOIN public.suppliers s ON r.supplier_id = s.id
      WHERE r.id = room_id AND (s.user_id = auth.uid() OR public.is_admin())
    )
  );

-- group_participations
DROP POLICY IF EXISTS "parts_select" ON public.group_participations;
DROP POLICY IF EXISTS "parts_insert" ON public.group_participations;

CREATE POLICY "parts_select" ON public.group_participations FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_rooms r
      JOIN public.suppliers s ON r.supplier_id = s.id
      WHERE r.id = room_id AND s.user_id = auth.uid()
    )
    OR public.is_admin()
  );
CREATE POLICY "parts_insert" ON public.group_participations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- orders
DROP POLICY IF EXISTS "orders_select" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;

CREATE POLICY "orders_select" ON public.orders FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_rooms r
      JOIN public.suppliers s ON r.supplier_id = s.id
      WHERE r.id = room_id AND s.user_id = auth.uid()
    )
    OR public.is_admin()
  );
CREATE POLICY "orders_insert" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_update" ON public.orders FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_rooms r
      JOIN public.suppliers s ON r.supplier_id = s.id
      WHERE r.id = room_id AND s.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- favorites
DROP POLICY IF EXISTS "favs_all" ON public.favorites;
CREATE POLICY "favs_all" ON public.favorites FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- notifications
DROP POLICY IF EXISTS "notifs_all" ON public.notifications;
CREATE POLICY "notifs_all" ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- reviews
DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert" ON public.reviews;

CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid() AND status = 'picked_up'
    )
  );

-- refund_requests
DROP POLICY IF EXISTS "refunds_select" ON public.refund_requests;
DROP POLICY IF EXISTS "refunds_insert" ON public.refund_requests;
DROP POLICY IF EXISTS "refunds_update" ON public.refund_requests;

CREATE POLICY "refunds_select" ON public.refund_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "refunds_insert" ON public.refund_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "refunds_update" ON public.refund_requests FOR UPDATE TO authenticated
  USING (public.is_admin());

-- ─── REALTIME ─────────────────────────────────────────────────────────────────
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'group_rooms','group_participations','orders','notifications','products'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND tablename = t
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.' || t;
    END IF;
  END LOOP;
END;
$$;
