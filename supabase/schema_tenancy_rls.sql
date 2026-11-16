-- ==============================================================================
-- Guardrail: Production Tenancy & Row-Level Security (RLS) Migration
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor.
-- It is safe, idempotent (can be re-run without errors), and handles existing data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADD TENANCY COLUMNS TO AGENCIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.agencies 
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS custom_domain text;

-- Backfill slugs for any pre-existing agency rows where slug is null
UPDATE public.agencies
SET slug = LOWER(
  REGEXP_REPLACE(
    COALESCE(NULLIF(company_name, ''), 'agency'), 
    '[^a-zA-Z0-9]+', 
    '-', 
    'g'
  )
) || '-' || SUBSTRING(id::text, 1, 6)
WHERE slug IS NULL;

-- Make slug non-nullable once backfilled
ALTER TABLE public.agencies 
  ALTER COLUMN slug SET NOT NULL;

-- Enforce unique constraints if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agencies_slug_key'
  ) THEN
    ALTER TABLE public.agencies ADD CONSTRAINT agencies_slug_key UNIQUE (slug);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agencies_custom_domain_key'
  ) THEN
    ALTER TABLE public.agencies ADD CONSTRAINT agencies_custom_domain_key UNIQUE (custom_domain);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. CREATE PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_agencies_user_id ON public.agencies(user_id);
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON public.agencies(slug);
CREATE INDEX IF NOT EXISTS idx_agencies_custom_domain ON public.agencies(custom_domain);
CREATE INDEX IF NOT EXISTS idx_clients_agency_id ON public.clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_id ON public.notifications(client_id);

-- ------------------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4. POLICIES: AGENCIES
-- ------------------------------------------------------------------------------
-- Agency owners can view only their own agency
DROP POLICY IF EXISTS "Agency owners can select their agency" ON public.agencies;
CREATE POLICY "Agency owners can select their agency"
  ON public.agencies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert an agency record bound to their auth user id
DROP POLICY IF EXISTS "Users can insert their agency" ON public.agencies;
CREATE POLICY "Users can insert their agency"
  ON public.agencies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Agency owners can update only their own agency profile
DROP POLICY IF EXISTS "Agency owners can update their agency" ON public.agencies;
CREATE POLICY "Agency owners can update their agency"
  ON public.agencies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. POLICIES: CLIENTS
-- ------------------------------------------------------------------------------
-- Scopes ALL client operations (SELECT, INSERT, UPDATE, DELETE) to the agency owner
DROP POLICY IF EXISTS "Users can manage clients of their agency" ON public.clients;
CREATE POLICY "Users can manage clients of their agency"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- 6. POLICIES: NOTIFICATIONS
-- ------------------------------------------------------------------------------
-- Users can only read and update notifications sent to their auth user id
DROP POLICY IF EXISTS "Users can manage their notifications" ON public.notifications;
CREATE POLICY "Users can manage their notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. POLICIES: PRICING TIERS
-- ------------------------------------------------------------------------------
-- Active pricing tiers are publicly readable (used by landing & signup wizard)
DROP POLICY IF EXISTS "Active pricing tiers are publicly readable" ON public.pricing_tiers;
CREATE POLICY "Active pricing tiers are publicly readable"
  ON public.pricing_tiers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
