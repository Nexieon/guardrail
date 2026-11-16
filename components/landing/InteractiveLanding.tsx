'use client'

import { useState } from 'react'
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Globe, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  Lock
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

export interface PricingTier {
  id: string
  slug: string
  name: string
  price_monthly: number
  cta_text: string
  features: {
    highlight?: string
    bullets?: string[]
  }
  is_active?: boolean
  sort_order?: number
}

interface InteractiveLandingProps {
  tiers: PricingTier[]
}

export default function InteractiveLanding({ tiers }: InteractiveLandingProps) {
  // --- Hero Interactive: White-label customizer state ---
  const [agencySlug, setAgencySlug] = useState('lumina-studio')
  const [domainMode, setDomainMode] = useState<'subdomain' | 'custom'>('subdomain')
  const [accentColor, setAccentColor] = useState<'orange' | 'indigo' | 'emerald'>('orange')

  // --- Interactive Scope Guardrail State ---
  const [revisionCount, setRevisionCount] = useState<number>(2)

  // --- Perspective View Switcher: Agency vs Client ---
  const [perspective, setPerspective] = useState<'client' | 'agency'>('client')

  // --- Live Interactive Approval Checkbox in Demo ---
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({
    'brand-deck': true,
    'figma-prototype': false,
  })

  // --- Live Comment Thread ---
  const [comments, setComments] = useState<string[]>([
    'Love the color palette! Can we check contrast on mobile?',
  ])
  const [newComment, setNewComment] = useState('')

  // Color tokens mapping for dynamic demo
  const themeStyles = {
    orange: {
      primary: '#FD501D',
      bgLight: 'bg-orange-50',
      text: 'text-[#FD501D]',
      border: 'border-[#FD501D]',
      badge: 'bg-[#FD501D]/10 text-[#FD501D]',
      btn: 'bg-[#FD501D] hover:bg-[#e04516] text-white',
    },
    indigo: {
      primary: '#4F46E5',
      bgLight: 'bg-indigo-50',
      text: 'text-[#4F46E5]',
      border: 'border-[#4F46E5]',
      badge: 'bg-[#4F46E5]/10 text-[#4F46E5]',
      btn: 'bg-[#4F46E5] hover:bg-[#4338ca] text-white',
    },
    emerald: {
      primary: '#059669',
      bgLight: 'bg-emerald-50',
      text: 'text-[#059669]',
      border: 'border-[#059669]',
      badge: 'bg-[#059669]/10 text-[#059669]',
      btn: 'bg-[#059669] hover:bg-[#047857] text-white',
    },
  }[accentColor]

  const toggleApproval = (key: string) => {
    setApprovedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setComments(prev => [...prev, newComment.trim()])
    setNewComment('')
  }

  return (
    <div className="relative overflow-hidden bg-brand-offwhite text-zinc-900 selection:bg-brand-primary selection:text-white">
      
      {/* =========================================================================
          ATMOSPHERIC EDITORIAL BACKGROUND (Halo Lab / Senti inspired)
         ========================================================================= */}
      
      {/* Persistent vertical column gridlines across the entire page */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="mx-auto max-w-7xl h-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 border-x border-zinc-200/80">
          <div className="border-r border-zinc-200/50 h-full" />
          <div className="border-r border-zinc-200/50 h-full hidden sm:block" />
          <div className="border-r border-zinc-200/50 h-full" />
          <div className="border-r border-zinc-200/50 h-full hidden md:block" />
          <div className="border-r border-zinc-200/50 h-full hidden sm:block" />
        </div>
      </div>

      {/* Atmospheric Dawn Glow at Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(253,80,29,0.18),rgba(255,141,40,0.06)_55%,transparent_80%)] pointer-events-none z-0 blur-3xl" />

      {/* Concentric Architectural Horizon Circles */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[950px] h-[950px] border border-zinc-300/30 rounded-full pointer-events-none z-0 opacity-70" />
      <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[650px] h-[650px] border border-zinc-200/40 rounded-full pointer-events-none z-0 opacity-50" />

      {/* =========================================================================
          HERO SECTION: High-Impact, Minimalist & Atmospheric
         ========================================================================= */}
      <section className="relative z-10 px-4 pt-16 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Subtle Editorial Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs mb-8 transition-all hover:border-brand-primary/40">
          <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
          <span>The Client Operating System for Service Businesses</span>
        </div>

        {/* High-Impact Headline */}
        <h1 className="text-5xl font-black tracking-tight text-zinc-950 sm:text-7xl lg:text-8xl leading-[1.03]">
          Deliver like an agency. <br />
          <span className="bg-gradient-to-r from-brand-primary via-[#FF7033] to-brand-secondary bg-clip-text text-transparent">
            Scale without noise.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-zinc-600 sm:text-lg leading-relaxed">
          The white-labeled client portal that replaces endless email threads with 1-click approvals, automated scope boundaries, and custom domains.
        </p>

        {/* Action Hub */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink 
            href="/signup" 
            variant="primary" 
            className="w-full sm:w-auto text-base py-3.5 px-8 shadow-card group"
          >
            <span>Claim Your Workspace</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <a 
            href="#interactive-stage"
            className="inline-flex items-center justify-center gap-2 font-medium text-sm text-zinc-600 hover:text-zinc-950 px-6 py-3.5 transition-colors cursor-pointer"
          >
            <span>Explore Live Interactive Demo</span>
            <span className="text-zinc-400">↓</span>
          </a>
        </div>

        {/* Minimalist Proof Numbers */}
        <div className="mt-14 pt-8 border-t border-zinc-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">100%</div>
            <div className="text-xs text-zinc-500 mt-0.5">White-Labeled Portals</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">&lt; 60s</div>
            <div className="text-xs text-zinc-500 mt-0.5">Instant Setup</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">Free</div>
            <div className="text-xs text-zinc-500 mt-0.5">Custom Subdomains</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950">Zero</div>
            <div className="text-xs text-zinc-500 mt-0.5">Client Password Friction</div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          INTERACTIVE 1: THE LIVING WHITE-LABEL SIMULATOR
          Visitors can personalize the agency slug, domain mode, and theme color,
          and see the client portal instantly adapt in real-time.
         ========================================================================= */}
      <section id="interactive-stage" className="relative z-10 px-4 py-12 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Simulator Control Bar */}
        <div className="mb-6 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-md p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <Sliders className="h-4 w-4 text-brand-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">White-Label Simulator:</span>
            </div>
            <input 
              type="text" 
              value={agencySlug}
              onChange={(e) => setAgencySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="your-agency"
              className="bg-zinc-100/80 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold text-zinc-800 focus:outline-none focus:border-zinc-400 w-36"
            />
          </div>

          {/* Subdomain / Custom Domain Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg bg-zinc-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDomainMode('subdomain')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  domainMode === 'subdomain' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Free Subdomain
              </button>
              <button
                type="button"
                onClick={() => setDomainMode('custom')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  domainMode === 'custom' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Custom Domain (Plus/Pro)
              </button>
            </div>

            {/* Brand Accent Color Swatches */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setAccentColor('orange')}
                title="Sunset Orange"
                className={`h-6 w-6 rounded-md bg-[#FD501D] transition-transform cursor-pointer ${accentColor === 'orange' ? 'ring-2 ring-black scale-110' : 'opacity-70'}`}
              />
              <button
                type="button"
                onClick={() => setAccentColor('indigo')}
                title="Electric Indigo"
                className={`h-6 w-6 rounded-md bg-[#4F46E5] transition-transform cursor-pointer ${accentColor === 'indigo' ? 'ring-2 ring-black scale-110' : 'opacity-70'}`}
              />
              <button
                type="button"
                onClick={() => setAccentColor('emerald')}
                title="Forest Emerald"
                className={`h-6 w-6 rounded-md bg-[#059669] transition-transform cursor-pointer ${accentColor === 'emerald' ? 'ring-2 ring-black scale-110' : 'opacity-70'}`}
              />
            </div>
          </div>
        </div>

        {/* Live Mockup Window */}
        <div className="rounded-3xl border border-zinc-300 bg-white shadow-2xl overflow-hidden transition-all duration-300 ring-1 ring-black/5">
          
          {/* Mock Browser Header */}
          <div className="bg-zinc-100/90 border-b border-zinc-200 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-zinc-300" />
              <div className="h-3 w-3 rounded-full bg-zinc-200" />
              <div className="h-3 w-3 rounded-full bg-zinc-200" />
            </div>

            {/* Dynamic URL Bar */}
            <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-zinc-200 text-xs text-zinc-600 shadow-xs font-mono">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Lock className="h-3 w-3" /> https://
              </span>
              {domainMode === 'subdomain' ? (
                <>
                  <span className="text-zinc-900 font-bold">{agencySlug || 'agency'}</span>
                  <span>.guardrail.com</span>
                </>
              ) : (
                <span className="text-zinc-900 font-bold">portal.{agencySlug || 'agency'}.com</span>
              )}
              <span className="text-zinc-400">/c/acme-corp</span>
            </div>

            <div className="text-[11px] font-semibold text-zinc-400 hidden sm:block">
              Interactive Preview
            </div>
          </div>

          {/* Perspective Bar: Client Portal vs Agency Command Deck */}
          <div className="bg-zinc-50 border-b border-zinc-100 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPerspective('client')}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  perspective === 'client' ? `${themeStyles.border} ${themeStyles.text}` : 'border-transparent text-zinc-500'
                }`}
              >
                Client Portal View
              </button>
              <button
                type="button"
                onClick={() => setPerspective('agency')}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  perspective === 'agency' ? `${themeStyles.border} ${themeStyles.text}` : 'border-transparent text-zinc-500'
                }`}
              >
                Agency Admin Command Deck
              </button>
            </div>

            <span className="text-[11px] text-zinc-400">
              {perspective === 'client' ? 'What your client sees' : 'What only you see'}
            </span>
          </div>

          {/* Live Mockup Interior */}
          <div className="p-6 sm:p-8 bg-white min-h-[360px]">
            {perspective === 'client' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {/* Left 2 Cols: Client Deliverables */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pending Deliverable Sign-Offs</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${themeStyles.badge}`}>
                      Round 2 of 3 Included
                    </span>
                  </div>

                  {/* Deliverable 1 */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-zinc-900 text-sm sm:text-base">Q3_Marketing_Site_Design_v2.fig</div>
                      <div className="text-xs text-zinc-500 mt-0.5">Wireframes & mobile checkout user flow</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleApproval('figma-prototype')}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        approvedItems['figma-prototype']
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{approvedItems['figma-prototype'] ? 'Approved' : 'Click to Approve'}</span>
                    </button>
                  </div>

                  {/* Deliverable 2 */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-zinc-900 text-sm sm:text-base">Brand_Identity_Guidelines.pdf</div>
                      <div className="text-xs text-zinc-500 mt-0.5">Typography hierarchy & export vectors</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleApproval('brand-deck')}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        approvedItems['brand-deck']
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{approvedItems['brand-deck'] ? 'Approved' : 'Click to Approve'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400">
                    * Try clicking the approval buttons above to see how clients sign off instantly without creating accounts.
                  </p>
                </div>

                {/* Right Col: Client Feedback Stream */}
                <div className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50/70 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Live Feedback Stream</div>
                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                      {comments.map((msg, i) => (
                        <div key={i} className="bg-white p-2.5 rounded-xl border border-zinc-100 text-xs text-zinc-700 shadow-xs">
                          <span className="font-bold text-zinc-900 block text-[11px] mb-0.5">Client Feedback:</span>
                          {msg}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a client comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                    <button
                      type="submit"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${themeStyles.btn}`}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Agency Admin View */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                    <div className="text-xs text-zinc-400 font-semibold">Client Revenue</div>
                    <div className="text-2xl font-black text-zinc-950 mt-1">$28,500 <span className="text-xs font-normal text-zinc-400">CAD</span></div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1">● Up to date</div>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                    <div className="text-xs text-zinc-400 font-semibold">Active Retainer</div>
                    <div className="text-2xl font-black text-zinc-950 mt-1">$4,500 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
                    <div className="text-xs text-zinc-500 mt-1">Next invoice: 1st of month</div>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                    <div className="text-xs text-zinc-400 font-semibold">Internal Notes</div>
                    <div className="text-xs text-zinc-600 mt-2 line-clamp-2">
                      Client prefers weekly video summaries. All designs must be approved before front-end sprint.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                      AC
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 text-sm">Acme Corp Portal Status</div>
                      <div className="text-xs text-zinc-400">Last client visit: Today at 2:14 PM</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Active & Authenticated
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* =========================================================================
          INTERACTIVE 2: THE "SCOPE GUARDRAIL" REVISION SIMULATOR
          Solves the agency problem of endless scope creep.
         ========================================================================= */}
      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-200/80">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">The Core Value</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight mt-2">
            No more unpaid scope creep.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-3">
            Guardrail automatically tracks revision counts. When clients request revisions beyond your contract, overage fees are applied cleanly.
          </p>
        </div>

        {/* Interactive Scope Stepper */}
        <div className="rounded-3xl border border-zinc-300 bg-white p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-zinc-100 gap-4">
            <div>
              <div className="font-bold text-zinc-950 text-base">Client Revision Meter</div>
              <div className="text-xs text-zinc-500">Agreed contract limit: 3 revisions</div>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRevisionCount(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold hover:bg-zinc-100 cursor-pointer"
              >
                - Less
              </button>
              <span className="font-black text-lg text-zinc-900 w-16 text-center">
                Round {revisionCount}
              </span>
              <button
                type="button"
                onClick={() => setRevisionCount(prev => Math.min(5, prev + 1))}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 cursor-pointer"
              >
                + Request Revision
              </button>
              <button
                type="button"
                onClick={() => setRevisionCount(2)}
                title="Reset"
                className="p-1.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Status Output */}
          <div className="mt-8">
            {revisionCount <= 3 ? (
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 text-sm">Covered in Scope</div>
                    <div className="text-xs text-emerald-800">
                      Revision {revisionCount} of 3 included under current project contract.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white px-3 py-1.5 rounded-full border border-emerald-200">
                  $0.00 Overage
                </span>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-orange-50 border border-brand-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950 text-sm">Scope Guardrail Triggered!</div>
                    <div className="text-xs text-zinc-600">
                      Revision limit exceeded ({revisionCount} of 3). Automated overage notice cleanly presented to client.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-brand-primary bg-white px-3.5 py-1.5 rounded-full border border-brand-primary/30 shadow-xs">
                  + ${(revisionCount - 3) * 250}.00 Added to Next Retainer
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 3 CORE PILLARS: Spatial, Editorial, Minimalist
         ========================================================================= */}
      <section id="features" className="relative z-10 px-4 py-20 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-zinc-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-md shadow-xs hover:border-brand-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mb-6">
                <Sparkles className="h-5 w-5 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 mb-2">Zero Client Logins</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Clients never remember passwords. Each client receives a secure, passwordless magic link directly to their portal.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-xs font-semibold text-zinc-400">
              0% Friction Onboarding
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-md shadow-xs hover:border-brand-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mb-6">
                <Globe className="h-5 w-5 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 mb-2">Subdomains & Custom Domains</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Free tier includes your dedicated subdomain. Upgrade to Plus or Pro for your own custom apex or subdomain.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-xs font-semibold text-zinc-400">
              Complete Brand Ownership
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-md shadow-xs hover:border-brand-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mb-6">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 mb-2">Row-Level Security</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Database-level isolation ensures no client ever sees another client&apos;s files, conversations, or financial totals.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-xs font-semibold text-zinc-400">
              Bank-Grade Privacy
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PRICING SECTION: Clean, High Contrast & Transparent
         ========================================================================= */}
      <section id="pricing" className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-zinc-200/80">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Honest Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight mt-2">
            Free to start. Scale on your terms.
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            No credit card required. Claim your agency subdomain in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                tier.slug === 'pro' || tier.slug === 'plus'
                  ? 'border-brand-primary bg-white shadow-xl relative ring-2 ring-brand-primary/20'
                  : 'border-zinc-200 bg-white/80 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-extrabold text-xl text-zinc-950">{tier.name}</div>
                  {tier.slug === 'pro' && (
                    <span className="text-[10px] font-bold bg-brand-primary text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>

                <div className="text-xs text-zinc-500 mb-6 min-h-[32px]">
                  {tier.features?.highlight || 'Scale your agency operations'}
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl sm:text-5xl font-black text-zinc-950">
                    ${tier.price_monthly}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 uppercase">/ month</span>
                </div>

                <ul className="space-y-3 mb-8 border-t border-zinc-100 pt-6">
                  {tier.features?.bullets?.map((bullet: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600">
                      <Check className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ButtonLink 
                href="/signup" 
                variant={tier.slug === 'pro' || tier.slug === 'plus' ? 'primary' : 'ghost'} 
                className={`w-full justify-center ${tier.slug !== 'pro' && tier.slug !== 'plus' ? 'border border-zinc-200' : ''}`}
              >
                {tier.cta_text || 'Get Started'}
              </ButtonLink>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          ATMOSPHERIC CLOSING HORIZON CTA
         ========================================================================= */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl bg-zinc-950 text-white p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle Orange Radial Sunrise Glow inside card */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-secondary/20 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to give your clients a real portal?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-md mx-auto">
            Setup takes 60 seconds. Claim your free agency subdomain today.
          </p>

          <div className="mt-8 flex justify-center">
            <ButtonLink href="/signup" variant="primary" className="py-3.5 px-8 text-base">
              Create Free Workspace →
            </ButtonLink>
          </div>
        </div>
      </section>

    </div>
  )
}
