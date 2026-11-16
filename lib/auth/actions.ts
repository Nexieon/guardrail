'use server'

import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

export interface SignUpInput {
  email: string
  password: string
  companyName: string
  slug?: string
  agencyType: string
  industry: string
  tier: string
}

export async function registerAgency(data: SignUpInput) {
  try {
    const supabase = await createClient()

    // 1. Sign up user with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Failed to create user account' }
    }

    const userId = authData.user.id
    const baseSlug = generateSlug(data.slug || data.companyName || 'agency')
    const finalSlug = baseSlug || `agency-${Math.random().toString(36).substring(2, 7)}`

    // 2. Insert into the agencies table
    const { error: dbError } = await supabase
      .from('agencies')
      .insert({
        user_id: userId,
        company_name: data.companyName,
        slug: finalSlug,
        agency_type: data.agencyType,
        industry: data.industry,
        subscription_tier: data.tier || 'free'
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database Insert Error:", dbError.message)
      return { success: false, error: dbError.message }
    }

    return { success: true, slug: finalSlug }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during signup.'
    return { success: false, error: message }
  }
}
