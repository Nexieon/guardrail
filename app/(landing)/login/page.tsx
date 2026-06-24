import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/navbar'
import Footer from '@/components/ui/footer'

export default function LoginPage() {
  
  // The secure Server Action that runs when the form is submitted
  const login = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Note: Adjust the import path if your server client is in @/lib/supabase/server
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      redirect('/login?message=Could not authenticate user')
    }
    
    // Successful login pushes them to the main app interface
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-offwhite">
      <Navbar />
      
      <main className="flex flex-1 items-center justify-center p-4">
        {/* Subtle slide-up animation to match the smooth feel of the app */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          
          <div className="rounded-2xl border border-brand-divider bg-white p-8 shadow-card overflow-hidden">
            
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-black">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                Log in to manage your active projects.
              </p>
            </div>
            
            {/* Standard HTML Form powered by Next.js Server Actions */}
            <form action={login} className="flex flex-col gap-5">
              
              <Input
                label="Work Email"
                id="email"
                name="email" // Required for formData.get('email')
                type="email"
                icon={<Mail className="h-5 w-5" />}
                placeholder="you@agency.com"
                required
              />
              
              <div>
                <Input
                  label="Password"
                  id="password"
                  name="password" // Required for formData.get('password')
                  type="password"
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                  required
                />
                {/* Standard forgot password escape hatch */}
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
              Don't have an account?{' '}
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