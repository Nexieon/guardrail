'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Mail, Lock, Building, Briefcase, Factory, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TierSelection, Tier } from '@/components/ui/tierselection'
import Navbar from '@/components/navbar'
import Footer from '@/components/ui/footer'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/browser'
import { registerAgency } from '@/lib/auth/actions'
import { generateSlug } from '@/lib/utils'
import { useAlert } from '@/components/util/alertprovider'
import Link from 'next/link'

const AGENCY_TYPES = [
  { value: "solo_freelancer", label: "Solo Freelancer" },
  { value: "small_agency", label: "Small Agency (2-10 members)" },
  { value: "enterprise", label: "Enterprise (11+ members)" },
]

const INDUSTRIES = [
  { value: "web_design", label: "Web Design & Development" },
  { value: "accounting", label: "Accounting & Finance" },
  { value: "creative", label: "Video & Graphic Design" },
  { value: "physical_service", label: "Contractors & Home Services" },
  { value: "other", label: "Other" },
]

export default function SignupWizard() {
  const [step, setStep] = useState(1)
  const [dbTiers, setDbTiers] = useState<Tier[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCustomSlug, setIsCustomSlug] = useState(false)
  const { showAlert } = useAlert()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    slug: '',
    agencyType: '',
    industry: '',
    tier: 'free'
  })

  useEffect(() => {
    const fetchTiers = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        setDbTiers(data as unknown as Tier[])
      }
    }

    fetchTiers()
  }, [])

  const updateForm = (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value }
      // Auto-suggest slug from company name unless user explicitly edited the slug
      if (field === 'companyName' && !isCustomSlug) {
        next.slug = generateSlug(value)
      }
      return next
    })
  }

  const handleCompleteRegistration = async () => {
    setIsSubmitting(true)
    const result = await registerAgency(formData)
    setIsSubmitting(false)

    if (!result.success) {
      showAlert({
        title: "Registration Error",
        message: result.error || "Could not complete registration.",
        confirmText: "Ok",
        icon: "wrong"
      })
      return
    }

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'guardrail.com'
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))

    // Seamless redirect to their agency workspace
    if (isLocal) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = `https://${result.slug}.${rootDomain}/dashboard`
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col bg-brand-offwhite">
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                <span>Account</span>
                <span>Workspace</span>
                <span>Plan</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full bg-brand-primary transition-all duration-700 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Container */}
            <div className="rounded-2xl border border-brand-divider bg-white p-8 shadow-card overflow-hidden">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-black">Create your workspace</h1>
                    <p className="mt-2 text-sm text-zinc-500">Enter your credentials to get started.</p>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <Input
                      label="Work Email"
                      type="email"
                      icon={<Mail className="h-5 w-5" />}
                      placeholder="you@agency.com"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      required
                    />
                    <Input
                      label="Password"
                      type="password"
                      icon={<Lock className="h-5 w-5" />}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateForm('password', e.target.value)}
                      required
                    />
                    <Button 
                      variant="primary" 
                      className="mt-4 w-full"
                      onClick={() => setStep(2)}
                      disabled={!formData.email || !formData.password}
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="text-center text-sm text-zinc-500 mt-2">
                      Already have an account?{' '}
                      <Link href="/login" className="font-semibold text-brand-primary hover:text-brand-primary-hover">
                        Log in
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-black">Workspace details</h1>
                    <p className="mt-2 text-sm text-zinc-500">How should clients address your agency?</p>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <Input
                      label="Company Name"
                      type="text"
                      icon={<Building className="h-5 w-5" />}
                      placeholder="Acme Studio"
                      value={formData.companyName}
                      onChange={(e) => updateForm('companyName', e.target.value)}
                      required
                    />

                    {/* Workspace URL with suggested default */}
                    <div>
                      <Input
                        label="Workspace Subdomain"
                        type="text"
                        icon={<Globe className="h-5 w-5" />}
                        placeholder="acme-studio"
                        value={formData.slug}
                        onChange={(e) => {
                          setIsCustomSlug(true)
                          updateForm('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                        }}
                      />
                      <p className="text-xs text-zinc-400 mt-1">
                        Your portal will be reachable at: <span className="font-semibold text-zinc-700">{formData.slug || 'your-agency'}.guardrail.com</span>
                      </p>
                    </div>

                    <Select
                      label="Workspace Type"
                      icon={<Briefcase className="h-5 w-5" />}
                      placeholder="Select your setup..."
                      options={AGENCY_TYPES}
                      value={formData.agencyType}
                      onChange={(e) => updateForm('agencyType', e.target.value)}
                    />

                    <Select
                      label="Primary Industry"
                      icon={<Factory className="h-5 w-5" />}
                      placeholder="Select your industry..."
                      options={INDUSTRIES}
                      value={formData.industry}
                      onChange={(e) => updateForm('industry', e.target.value)}
                    />
                    
                    <div className="mt-4 flex gap-3">
                      <Button variant="ghost" className="px-4 border border-brand-divider" onClick={() => setStep(1)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => setStep(3)}
                        disabled={!formData.companyName}
                      >
                        Select Plan <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-black">Choose your plan</h1>
                    <p className="mt-2 text-sm text-zinc-500">Pick the tier that fits your agency size.</p>
                  </div>
                  
                  <TierSelection 
                    tiers={dbTiers}
                    selectedTier={formData.tier}
                    onSelect={(slug: string) => updateForm('tier', slug)}
                  />

                  <div className="mt-8 flex gap-3">
                    <Button variant="ghost" className="px-4 border border-brand-divider" onClick={() => setStep(2)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="primary" 
                      className="flex-1" 
                      onClick={handleCompleteRegistration}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Workspace...' : 'Complete & Launch'}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
