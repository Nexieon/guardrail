import Navbar from "@/components/navbar";
import Footer from "@/components/ui/footer";
import InteractiveLanding, { PricingTier } from "@/components/landing/InteractiveLanding";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient()

  // Fetch active pricing tiers from database
  const { data: tiers } = await supabase
    .from('pricing_tiers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const displayTiers: PricingTier[] = (tiers as PricingTier[])?.length ? (tiers as PricingTier[]) : [
    {
      id: 'free-fallback',
      slug: 'free',
      name: 'Free',
      price_monthly: 0,
      cta_text: 'Start Free',
      features: {
        highlight: 'For solo practitioners & freelancers',
        bullets: [
          'Up to 3 active clients',
          'Dedicated agency subdomain',
          'Client asset storage & downloads',
          'Direct client sign-off toggles'
        ]
      }
    },
    {
      id: 'plus-fallback',
      slug: 'plus',
      name: 'Plus',
      price_monthly: 49,
      cta_text: 'Start Plus Plan',
      features: {
        highlight: 'For growing studio teams',
        bullets: [
          'Unlimited active clients',
          'Custom domain routing',
          'Automated scope revision limits',
          'Zero-login magic links'
        ]
      }
    },
    {
      id: 'pro-fallback',
      slug: 'pro',
      name: 'Pro',
      price_monthly: 99,
      cta_text: 'Start Pro Plan',
      features: {
        highlight: 'For established agencies',
        bullets: [
          'Everything in Plus',
          'Full white-labeling & theme styling',
          'Multiple staff member seats',
          'Priority SLA support'
        ]
      }
    }
  ]

  return (
    <>
      <Navbar />
      <InteractiveLanding tiers={displayTiers} />
      <Footer />
    </>
  )
}
