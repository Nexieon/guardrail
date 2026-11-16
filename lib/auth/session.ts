import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface Agency {
  id: string
  user_id: string
  company_name: string | null
  agency_type: string | null
  industry: string | null
  subscription_tier: string | null
  slug: string | null
  custom_domain: string | null
  created_at: string | null
}

/**
 * Ensures the user has an active Supabase session.
 * If not authenticated, redirects to /login on the current host.
 */
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return { user, supabase }
}

/**
 * Returns the currently authenticated user's agency, or null if none exists.
 */
export async function getCurrentAgency(): Promise<Agency | null> {
  const { user, supabase } = await requireUser()

  const { data: agency, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !agency) {
    return null
  }

  return agency as Agency
}

/**
 * Verifies the user is authenticated and has an agency.
 * Optionally validates that the agency matches the expected subdomain slug.
 */
export async function requireAgency(expectedSlug?: string): Promise<Agency> {
  const agency = await getCurrentAgency()

  if (!agency) {
    redirect('/signup')
  }

  // If user is accessing an explicit agency subdomain, prevent cross-tenant access
  if (expectedSlug && agency.slug && agency.slug !== expectedSlug) {
    redirect('/dashboard')
  }

  return agency
}
