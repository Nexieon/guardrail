import React from 'react'

export type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string
  variant?: BadgeVariant
}

export default function StatusBadge({ status, variant, className = '', ...props }: StatusBadgeProps) {
  let activeVariant: BadgeVariant = variant || 'neutral'
  
  if (!variant) {
    const lower = status.toLowerCase()
    
    if (['active', 'completed', 'done', 'paid'].includes(lower)) {
      activeVariant = 'success'
    } else if (['pending', 'in review', 'outstanding', 'on hold'].includes(lower)) {
      activeVariant = 'warning'
    } else if (['in progress', 'processing', 'ongoing'].includes(lower)) {
      activeVariant = 'info'
    } else {
      activeVariant = 'neutral'
    }
  }

  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[activeVariant]} ${className}`}
      {...props}
    >
      {status}
    </span>
  )
}
