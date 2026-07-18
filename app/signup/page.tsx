'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Mail, Lock, Building, Briefcase, Factory } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TierSelection } from '@/components/ui/tierselection'
import Navbar from '@/components/navbar'
import Footer from '@/components/ui/footer'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'

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
  
  // Added state to hold the database tiers
  const [dbTiers, setDbTiers] = useState<any[]>([])
  const [isLoadingTiers, setIsLoadingTiers] = useState(true)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    agencyType: '',
    industry: '',
    tier: 'free'
  })

  // The client-side database fetch
  useEffect(() => {
    const fetchTiers = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        setDbTiers(data)
      }
      setIsLoadingTiers(false)
    }

    fetchTiers()
  }, [])

  const updateForm = (field: string, value: string) => {
    console.log(field, value);
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCompleteRegistration = async () => {
    const supabase = await createClient()
    
    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp(formData);

    if (authError) {
      alert(authError.message);
      return; // Stop execution if auth fails
    }

    // Ensure we actually have a user ID before proceeding
    const userId = authData.user?.id;
    if (!userId) {
      alert("Sign up succeeded but no user ID was returned. Check email confirmation settings.");
      return;
    }
    
    // 2. Insert into the agencies table
    const { data: dbData, error: dbError } = await supabase
      .from('agencies')
      .insert([
        {
          user_id: userId,
          company_name: formData.companyName,
          agency_type: formData.agencyType,
          industry: formData.industry,
          subscription_tier: formData.tier
        }
      ])
      .select(); // Forces Supabase to return the row so you can verify it

    if (dbError) {
      console.error("Database Insert Error Details:", dbError);
      alert(`Database Error: ${dbError.message}`);
      return;
    }

    alert(`Signed up and profile created for: ${userId}`);
    // redirect('/account'); // Safe to redirect now
  }


  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col bg-brand-offwhite">

        {/* Main Wizard Container */}
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md">
            
            {/* Animated Progress Bar */}
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
                    <p className="mt-2 text-sm text-zinc-500">Enter your details to get started.</p>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <Input
                      label="Work Email"
                      type="email"
                      icon={<Mail className="h-5 w-5" />}
                      placeholder="you@agency.com"
                      value={formData.email}
                      onChange={(e: any) => updateForm('email', e.target.value)}
                    />
                    <Input
                      label="Password"
                      type="password"
                      icon={<Lock className="h-5 w-5" />}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e: any) => updateForm('password', e.target.value)}
                    />
                    <Button 
                      variant="primary" 
                      className="mt-4 w-full"
                      onClick={() => setStep(2)}
                      disabled={!formData.email || !formData.password}
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </Button>
                    <ButtonLink href="/login" variant="primary">
                      Have an Account? Log In Instead
                    </ButtonLink>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-black">Workspace details</h1>
                    <p className="mt-2 text-sm text-zinc-500">How should we configure your portal?</p>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <Input
                      label="Company Name"
                      type="text"
                      icon={<Building className="h-5 w-5" />}
                      placeholder="My Design Co."
                      value={formData.companyName}
                      onChange={(e: any) => updateForm('companyName', e.target.value)}
                    />

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
                      <Button variant="icon" className="px-4 border border-brand-divider" onClick={() => setStep(1)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => setStep(3)}
                        disabled={!formData.companyName || !formData.agencyType || !formData.industry}
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-black">Select your plan</h1>
                    <p className="mt-2 text-sm text-zinc-500">You can upgrade at any time.</p>
                  </div>
                  
                  {isLoadingTiers ? (
                    <div className="py-8 text-center text-sm text-zinc-500">Loading plans...</div>
                  ) : (
                    <TierSelection 
                      tiers={dbTiers} 
                      selectedTier={formData.tier}
                      onSelect={(slug: string) => updateForm('tier', slug)}
                    />
                  )}

                  <div className="mt-8 flex gap-3">
                    <Button variant="icon" className="px-4 border border-brand-divider" onClick={() => setStep(2)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={handleCompleteRegistration}
                    >
                      Complete Setup
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  )
}