import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-only Supabase client.
 * Use ONLY in Client Components ('use client') for interactive operations like notifications.
 * Never import this in Server Components, Server Actions, or route handlers.
 */
export function createBrowserClientInstance() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Alias for backwards compatibility in client components
export const createClient = createBrowserClientInstance
