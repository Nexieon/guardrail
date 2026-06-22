import Navbar from "@/components/navbar";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/ui/footer";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, ArrowRight, Check, CheckCircle2, Folder, Link2, MessageSquare, Play } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  // We store the data in an array so it's easy to map over and keep the JSX clean
  const features = [
    {
      title: 'Client Dashboards',
      description: 'Frictionless access for clients to see the progress on their project',
      icon: <Link2 className="h-5 w-5 text-white" />,
    },
    {
      title: 'Asset Vault',
      description: 'Highly organized file storage. Clients can view, download, and approve deliverables in a clean, visual grid.',
      icon: <Folder className="h-5 w-5 text-white" />,
    },
    {
      title: 'Centralized Feedback',
      description: 'Stop digging through email chains. Keep all project communication, file comments, and approvals in one unified thread.',
      icon: <MessageSquare className="h-5 w-5 text-white" />,
    },
  ]

  const notifications = [
    {
      title: 'Material Specs Approved',
      description: 'The client approved the final fixture specs and plumbing layout for the 3-bedroom project. Ready for procurement.',
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
    },
    {
      title: 'Documents Uploaded and New Feedback Received',
      description: 'The client uploaded their Q3 expense receipts and left a comment regarding the new vehicle depreciation log.',
      icon: <MessageSquare className="h-5 w-5 text-white" />,
    },
    {
      title: 'Revision Limit Reached',
      description: 'Automated message: Round 3 of 3 floorplan revisions completed. The next change request will automatically append your agreed overage fee.',
      icon: <AlertCircle className="h-5 w-5 text-white" />,
    },
  ]

  // 1. Initialize Supabase server client
  const supabase = await createClient()

  // 2. Fetch the active pricing tiers, ordered by the sort_order column
  const { data: tiers, error } = await supabase
    .from('pricing_tiers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Fallback in case of a network error so the page doesn't crash
  const displayTiers = tiers || []
  
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden bg-brand-offwhite px-4 py-20 sm:px-6 sm:py-32 lg:px-8 border border-b-brand-divider">
        {/* BACKGROUND PATTERN: Pure CSS Subtle Dot Matrix Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#DCDCDC 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Radial fade to soften the pattern on the edges */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#F3F3F3_100%)] pointer-events-none" />

        {/* HERO CONTENT CONTAINER */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          
          {/* Tagline / Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-divider bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-600 shadow-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary" />
            Introducing GuardRail Workspace
          </div>

          {/* Main Headline */}
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-black sm:text-6xl lg:text-7xl">
            Meet <span className="text-brand-primary">GuardRail</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 sm:text-xl leading-relaxed">
            Everything you need to run your client projects smoothly. Bring your assets, reviews, and invoicing together in one seamless, white-labeled workspace built for fast execution.
          </p>

          {/* CTA Button Group */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary Action Button Link */}
            <ButtonLink 
              href="/signup" 
              variant="primary" 
              className="w-full sm:w-auto shadow-card group"
            >
              Get Started Today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>

            {/* Secondary Action / Ghost Style Button Link */}
            <ButtonLink 
              href="#demo" 
              variant="ghost" 
              className="w-full sm:w-auto group"
            >
              <Play className="h-4 w-4 fill-current text-brand-primary" />
              Watch Demo
            </ButtonLink>
          </div>

          {/* MAIN HERO INTERFACE PLACEHOLDER */}
          {/* This creates the perfectly sized container window seen in your Figma screen */}
          {/* THIS IS WHERE THE DEMO VIDEO WILL GO LATER */}
          <div className="mt-16 sm:mt-20" id='demo'>
            <div className="relative mx-auto max-w-5xl rounded-xl border border-brand-divider bg-white p-2 shadow-card">
              <div className="aspect-[16/9] w-full rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                
                {/* SVG / Product Preview Area */}
                <div className="w-full h-full text-zinc-300 flex items-center justify-center">
                  <svg 
                    className="w-full h-full max-h-[300px] p-8" 
                    viewBox="0 0 800 450" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Drop your specific hero application layout vector or dashboard graphic paths right here */}
                    <rect x="50" y="50" width="700" height="350" rx="8" fill="#F3F3F3" stroke="#DCDCDC" strokeWidth="2" />
                    <circle cx="90" cy="90" r="15" fill="#FD501D" opacity="0.8" />
                    <rect x="130" y="80" width="200" height="20" rx="4" fill="#DCDCDC" />
                    <rect x="50" y="140" width="700" height="2" fill="#DCDCDC" />
                    <rect x="90" y="180" width="300" height="150" rx="6" fill="white" stroke="#DCDCDC" />
                    <rect x="420" y="180" width="290" height="65" rx="6" fill="white" stroke="#DCDCDC" />
                    <rect x="420" y="265" width="290" height="65" rx="6" fill="white" stroke="#DCDCDC" />
                  </svg>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
              Agency-Grade Toolkit
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              Every Detail Your Clients will Notice
            </h2>
          </div>

          {/* The Responsive Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col">
                
                {/* Icon Container (Matches your Figma orange square) */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-brand-primary shadow-sm">
                  {feature.icon}
                </div>
                
                {/* Text Content */}
                <h3 className="text-xl font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed flex-grow">
                  {feature.description}
                </p>
                
              </Card>
            ))}
          </div>

        </div>
      </section>
      <section className="bg-brand-offwhite px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          {/* The Dark Container */}
          <div className="rounded-2xl bg-[#1A1A1A] px-6 py-16 text-center shadow-2xl sm:p-20">
            
            <p className="text-sm font-semibold tracking-wide text-brand-secondary uppercase">
              White-Labeled Spotlight
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your Brand. Your Domain. Your Portal
            </h2>

            {/* The URL Visualizer */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              
              {/* Standard SaaS URL */}
              <div className="flex h-12 items-center rounded-md bg-white px-6 font-mono text-sm font-medium text-black sm:text-base">
                guardrail.app/client
              </div>

              {/* Arrow */}
              <ArrowRight className="h-6 w-6 text-zinc-500 rotate-90 sm:rotate-0" />

              {/* Custom Domain URL with glowing border */}
              <div className="flex h-12 items-center rounded-md bg-white px-6 font-mono text-sm font-bold text-brand-secondary border-2 border-brand-secondary shadow-[0_0_15px_rgba(253,80,29,0.5)] sm:text-base">
                portal.youragency.com
              </div>
              
            </div>
            
          </div>
        </div>
      </section>
      <section className="bg-brand-offwhite px-4 py-20 sm:px-6 lg:px-8 border-b border-b-brand-divider">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
            
            {/* Left Column: Text Content */}
            <div>
              <h2 className="text-3xl font-light tracking-tight text-brand-primary sm:text-4xl leading-tight">
                Keep projects on track without the awkward conversations
              </h2>
              <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
                Protect your time by putting project management on autopilot. The system automatically logs official approvals, centralizes incoming documents, and tracks revision rounds in the background—ensuring your schedule stays intact and extra work is always accounted for.
              </p>
            </div>

            {/* Right Column: Stacked Notification Cards */}
            <div className="flex flex-col gap-4">
              {notifications.map((note, index) => (
                <Card key={index} className="flex flex-row items-start gap-4 !p-4 sm:!p-5 hover:scale-[1.01] transition-transform duration-200">
                  
                  {/* Icon Square */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-primary shadow-sm mt-0.5">
                    {note.icon}
                  </div>
                  
                  {/* Text Content */}
                  <div>
                    <h4 className="text-sm font-bold text-black sm:text-base">
                      {note.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm leading-relaxed">
                      {note.description}
                    </p>
                  </div>

                </Card>
              ))}
            </div>

          </div>
        </div>
      </section>
      <section id="pricing" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-5xl">
            Priced for solo operators. Built for Scale.
          </h2>
          <p className="mt-4 text-base text-zinc-600 sm:text-lg">
            Pay monthly. Cancel anytime. No per-client fees, ever.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {displayTiers.map((tier) => (
              <Card key={tier.id} className="flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
                
                <div>
                  {/* Tier Name & Price */}
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    {tier.name}
                  </h3>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-black">
                    {/* Format the price dynamically: $0 or $19/mo */}
                    {tier.price_monthly === 0 ? '$0' : `$${tier.price_monthly}/mo`}
                  </div>

                  {/* Divider */}
                  <hr className="my-6 border-brand-divider" />

                  {/* Feature Checklist */}
                  <ul className="space-y-4 mb-8">
                    {/* We map over the "bullets" array inside your JSONB features column */}
                    {tier.features.bullets.map((feature: string, featureIdx: number) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 shrink-0 text-black" strokeWidth={2.5} />
                        <span className="text-sm text-zinc-700 leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action */}
                <ButtonLink 
                  href="/signup" 
                  variant="primary" 
                  className="w-full group mt-auto"
                >
                  {tier.cta_text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
                
              </Card>
            ))}
          </div>

        </div>
      </section>
      <Footer />
    </>
    
  );
}
