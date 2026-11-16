import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  breadcrumbs?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, action, breadcrumbs, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 ${className}`}>
      <div>
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  )
}
