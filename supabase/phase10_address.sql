-- Phase 10 & 11: Vietnam Address & Buyer Saved Addresses with Strict RLS Security

CREATE TABLE IF NOT EXISTS public.buyer_addresses (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'home', -- 'home', 'office', 'dorm', 'other'
  custom_label TEXT,
  recipient_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  province_code TEXT NOT NULL,
  province_name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  ward_code TEXT NOT NULL,
  ward_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  house_number TEXT,
  formatted_address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid user lookup
CREATE INDEX IF NOT EXISTS idx_buyer_addresses_user_id ON public.buyer_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_addresses_default ON public.buyer_addresses(user_id, is_default);

-- 1. ENABLE ROW LEVEL SECURITY (MANDATORY)
ALTER TABLE public.buyer_addresses ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES:
-- Policy A: Buyer only reads their OWN private addresses
CREATE POLICY "buyer_addresses_select_own"
ON public.buyer_addresses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy B: Buyer only inserts addresses for THEMSELVES
CREATE POLICY "buyer_addresses_insert_own"
ON public.buyer_addresses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy C: Buyer only updates their OWN addresses
CREATE POLICY "buyer_addresses_update_own"
ON public.buyer_addresses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy D: Buyer only deletes their OWN addresses
CREATE POLICY "buyer_addresses_delete_own"
ON public.buyer_addresses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Policy E: Admin can read addresses ONLY for dispute/complaint investigation
CREATE POLICY "buyer_addresses_admin_investigate"
ON public.buyer_addresses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
