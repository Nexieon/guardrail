-- ==============================================================================
-- GUARDRAIL: Projects Table & Row-Level Security (RLS)
-- ==============================================================================
-- Run this in your Supabase SQL Editor to support Epic 2: Global Projects.

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  budget numeric DEFAULT 0.00,
  currency text DEFAULT 'CAD' CHECK (currency IN ('CAD', 'USD')),
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in progress', 'on hold', 'completed')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date date,
  next_task text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_agency_id ON public.projects(agency_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- 3. Enable Row-Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Agency owners have full access to their agency's projects
DROP POLICY IF EXISTS "Agency owners can manage their projects" ON public.projects;

CREATE POLICY "Agency owners can manage their projects"
  ON public.projects
  FOR ALL
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
