-- ====================================================================
-- FLASHGROUP PHASE 5 — FINANCIAL & BUSINESS MODEL MIGRATION
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Idempotent & non-destructive migration
-- ====================================================================

-- 1. ADD PRIVATE UNIT COST TO PRODUCTS (Supplier Cost Estimator - Req 16)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS unit_cost numeric;

-- Populate demo unit_cost for the Strawberry product (65,000 VND) so Profitability Preview works out of the box
UPDATE public.products
SET unit_cost = 65000
WHERE (name ILIKE '%Dâu tây%' OR id::text = 'prod-01')
  AND unit_cost IS NULL;

-- 2. ADD FINANCIAL SNAPSHOT FIELDS TO ORDERS (Req 4 & Req 20)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 0.07;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS platform_commission numeric DEFAULT 0;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS supplier_gross numeric DEFAULT 0;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS supplier_net numeric DEFAULT 0;

-- Backfill existing paid/valid orders with financial snapshot if not yet populated
UPDATE public.orders
SET commission_rate     = COALESCE(commission_rate, 0.07),
    supplier_gross      = product_subtotal,
    platform_commission = ROUND(product_subtotal * COALESCE(commission_rate, 0.07)),
    supplier_net        = product_subtotal - ROUND(product_subtotal * COALESCE(commission_rate, 0.07))
WHERE COALESCE(supplier_gross, 0) = 0
  AND status NOT IN ('cancelled', 'refunded');

-- Ensure cancelled or refunded orders have 0 platform revenue / supplier net
UPDATE public.orders
SET platform_commission = 0,
    supplier_gross      = 0,
    supplier_net        = 0
WHERE status IN ('cancelled', 'refunded');

-- 3. CREATE SUPPLIER PAYOUTS TABLE (Req 5)
CREATE TABLE IF NOT EXISTS public.supplier_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  supplier_id uuid NOT NULL
    REFERENCES public.suppliers(id)
    ON DELETE CASCADE,

  amount numeric NOT NULL,

  status text NOT NULL DEFAULT 'pending'
    CHECK (
      status IN (
        'pending',
        'approved',
        'paid',
        'rejected'
      )
    ),

  order_count integer NOT NULL DEFAULT 0,

  period_start timestamptz,
  period_end timestamptz,

  requested_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz,

  note text
);

CREATE INDEX IF NOT EXISTS idx_supplier_payouts_supplier
  ON public.supplier_payouts (supplier_id);

CREATE INDEX IF NOT EXISTS idx_supplier_payouts_status
  ON public.supplier_payouts (status);

-- 4. CREATE PAYOUT ORDERS JUNCTION TABLE TO PREVENT DOUBLE PAYOUT (Req 11)
CREATE TABLE IF NOT EXISTS public.payout_orders (
  payout_id uuid
    REFERENCES public.supplier_payouts(id)
    ON DELETE CASCADE,

  order_id uuid
    REFERENCES public.orders(id)
    ON DELETE CASCADE,

  PRIMARY KEY (
    payout_id,
    order_id
  )
);

CREATE INDEX IF NOT EXISTS idx_payout_orders_order
  ON public.payout_orders (order_id);

-- 5. CREATE PLATFORM SETTINGS TABLE & SEED DEFAULT 7% COMMISSION (Req 21 & 22)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.platform_settings (key, value)
VALUES ('commission_rate', '{"rate":0.07}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES (Req 30)
ALTER TABLE public.supplier_payouts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- supplier_payouts policies:
-- Supplier may view own payouts; Admin may view all payouts; Buyer cannot access.
DROP POLICY IF EXISTS "supplier_payouts_select" ON public.supplier_payouts;
CREATE POLICY "supplier_payouts_select"
  ON public.supplier_payouts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers s
      WHERE s.id = supplier_id AND s.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Supplier may create own pending payout requests; Admin may insert any.
DROP POLICY IF EXISTS "supplier_payouts_insert" ON public.supplier_payouts;
CREATE POLICY "supplier_payouts_insert"
  ON public.supplier_payouts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      EXISTS (
        SELECT 1 FROM public.suppliers s
        WHERE s.id = supplier_id AND s.user_id = auth.uid()
      )
      AND status = 'pending'
    )
    OR public.is_admin()
  );

-- Only Admin may approve, reject, or mark payouts as paid.
DROP POLICY IF EXISTS "supplier_payouts_update" ON public.supplier_payouts;
CREATE POLICY "supplier_payouts_update"
  ON public.supplier_payouts
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- payout_orders policies:
DROP POLICY IF EXISTS "payout_orders_select" ON public.payout_orders;
CREATE POLICY "payout_orders_select"
  ON public.payout_orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_payouts sp
      JOIN public.suppliers s ON s.id = sp.supplier_id
      WHERE sp.id = payout_id AND s.user_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "payout_orders_insert" ON public.payout_orders;
CREATE POLICY "payout_orders_insert"
  ON public.payout_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.supplier_payouts sp
      JOIN public.suppliers s ON s.id = sp.supplier_id
      WHERE sp.id = payout_id AND s.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- platform_settings policies:
-- Authenticated users can read platform commission rate for order creation; only Admin can modify.
DROP POLICY IF EXISTS "platform_settings_select" ON public.platform_settings;
CREATE POLICY "platform_settings_select"
  ON public.platform_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "platform_settings_admin_write" ON public.platform_settings;
CREATE POLICY "platform_settings_admin_write"
  ON public.platform_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. REALTIME SUBSCRIPTIONS (Req 31)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'orders', 'supplier_payouts', 'payout_orders', 'platform_settings'
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
