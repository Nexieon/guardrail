import React from 'react'

interface MoneyProps {
  amount: number
  currency?: string | null
  className?: string
}

/**
 * Standardized money and currency formatter.
 */
export function Money({ amount, currency = 'USD', className = '' }: MoneyProps) {
  const safeCurrency = currency || 'USD'
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: safeCurrency,
    currencyDisplay: 'narrowSymbol'
  }).format(amount)

  return (
    <span className={`inline-flex items-baseline gap-1.5 whitespace-nowrap ${className}`}>
      <span>{formatted}</span>
      <span className="text-xs text-zinc-400 font-normal uppercase">{safeCurrency}</span>
    </span>
  )
}
