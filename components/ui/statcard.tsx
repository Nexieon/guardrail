import React from 'react'
import { Card } from './card'

interface StatCardProps {
  label: string
  value: React.ReactNode
  badge?: React.ReactNode
  subtitle?: string
  className?: string
  children?: React.ReactNode
}

export function StatCard({ label, value, badge, subtitle, className = '', children }: StatCardProps) {
  return (
    <Card className={`p-5 sm:p-6 flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{label}</h3>
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900">{value}</div>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-zinc-400 mt-2">{subtitle}</p>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </Card>
  )
}
