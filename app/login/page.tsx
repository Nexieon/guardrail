import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/navbar'
import Footer from '@/components/ui/footer'
import { parseTenantHost } from '@/lib/tenants/host'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const message = typeof resolvedParams.message === 'string' ? resolvedParams.message : null
  const headersList = await headers()
  const host = headersList.get('host')
  const tenant = parseTenantHost(host)

  const login = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    // Direct login on current host if already on a subdomain or localhost
    if (!tenant.isApex) {
      redirect('/dashboard')
    }

    // Apex login handoff: redirect the agency owner to their dedicated subdomain
    const { data: agency } = await supabase
      .from('agencies')
      .select('slug')
      .eq('user_id', authData.user.id)
      .single()

    if (agency?.slug) {
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'guardrail.com'
      redirect(`https://${agency.slug}.${rootDomain}/dashboard`)
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-offwhite">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <div className="rounded-2xl border border-brand-divider bg-white p-8 shadow-card overflow-hidden">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-black">
                Welcome back
              </h1>
              <p className={`mt-2 text-sm ${message ? "text-red-500" : "text-zinc-500"}`}>
                {message ? message : "Log in to manage your active client projects."}
              </p>
            </div>

            <form action={login} className="flex flex-col gap-5">
              <Input
                label="Work Email"
                id="email"
                name="email"
                type="email"
                icon={<Mail className="h-5 w-5" />}
                placeholder="you@agency.com"
                required
              />

              <div>
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                  required
                />
                <div className="mt-2 text-right">
                  <Link href="/forgot-password" className="text-xs font-semibold text-zinc-500 hover:text-brand-primary transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" variant="primary" className="mt-4 w-full group">
                Log In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
