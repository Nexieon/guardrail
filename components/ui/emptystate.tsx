import React from 'react'
import { Search } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon = <Search className="h-8 w-8 mb-3 text-zinc-300" />,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center text-zinc-500 ${className}`}>
      {icon}
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      {description && <p className="text-sm mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
