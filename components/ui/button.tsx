'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'

// 1. THE STYLE GENERATOR
// We pull the Tailwind strings out into their own function so anything can use them.
export function getButtonClasses(variant: 'primary' | 'secondary' | 'ghost' | 'icon' = 'primary', className = '') {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95"
  
  let variantClasses = ""
  switch (variant) {
    case 'primary':
      variantClasses = "cursor-pointer text-sm px-6 py-2.5 rounded-md bg-brand-primary text-white border border-transparent hover:bg-white hover:text-brand-primary hover:border-brand-primary hover:shadow-card"
      break
    case 'secondary':
      variantClasses = "cursor-pointer text-sm px-6 py-2.5 rounded-md bg-brand-secondary text-white border border-transparent hover:bg-white hover:text-brand-secondary hover:border-brand-secondary hover:shadow-card"
      break
    case 'ghost':
      variantClasses = "cursor-pointer text-sm px-6 py-2.5 rounded-md bg-red text-brand-primary border-b-2 border-transparent hover:border-b-brand-primary hover:shadow-card"
      break
    case 'icon':
      variantClasses = "cursor-pointer p-2.5 rounded-md bg-brand-primary text-white border border-transparent hover:bg-white hover:text-brand-primary hover:border-brand-primary hover:shadow-card [&>svg]:pointer-events-none touch-manipulation"
      break
  }

  return `${baseClasses} ${variantClasses} ${className}`
}

// 2. THE STANDARD BUTTON
// Use this for form submissions, toggles, or general onClick events.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
}

export function Button({ variant, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={getButtonClasses(variant, className)} {...props}>
      {children}
    </button>
  )
}

// 3. THE NEXT.JS LINK BUTTON
// Use this EXACTLY like a Next.js <Link>, but it will look like your buttons.
interface ButtonLinkProps extends LinkProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  className?: string
  children: React.ReactNode
}

export function ButtonLink({ variant, className = '', children, ...props }: ButtonLinkProps) {
  return (
    <Link className={getButtonClasses(variant, className)} {...props}>
      {children}
    </Link>
  )
}