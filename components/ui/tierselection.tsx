import { CheckCircle2 } from 'lucide-react'

// Define the shape of your Supabase row so TypeScript knows what to expect
interface Tier {
  id: string
  slug: string
  name: string
  price_monthly: number
  features: {
    highlight: string
    bullets: string[]
  }
}

interface TierSelectionProps {
  tiers: Tier[]
  selectedTier: string
  onSelect: (slug: string) => void
}

export function TierSelection({ tiers = [], selectedTier, onSelect }: TierSelectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {tiers.map((tier) => (
        <div 
          key={tier.id}
          onClick={() => onSelect(tier.slug)}
          className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ease-in-out ${
            selectedTier === tier.slug 
              ? 'border-brand-primary bg-orange-50 shadow-md' 
              : 'border-brand-divider bg-white hover:border-zinc-300'
          }`}
        >
          {/* Active State Checkmark */}
          {selectedTier === tier.slug && (
            <div className="absolute right-4 top-4 animate-in zoom-in duration-200">
              <CheckCircle2 className="h-6 w-6 text-brand-primary" fill="currentColor" stroke="white" />
            </div>
          )}
          
          <div className="pr-10">
            <div className="font-bold text-black text-lg">{tier.name}</div>
            {/* Pulling the highlight string from your JSONB column */}
            <div className="text-sm text-zinc-500 mb-3">{tier.features.highlight}</div>
            
            <div className="text-2xl font-extrabold text-black">
              {tier.price_monthly === 0 ? '$0' : `$${tier.price_monthly}`}
              <span className="text-sm font-normal text-zinc-500">/mo</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}