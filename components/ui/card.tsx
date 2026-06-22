import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-xl border border-brand-divider shadow-card p-6 sm:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}