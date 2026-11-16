'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'destructive'

export function getButtonClasses(variant: ButtonVariant = 'primary', className = '') {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
  
  let variantClasses = ""
  switch (variant) {
    case 'primary':
      variantClasses = "cursor-pointer text-sm px-5 py-2.5 rounded-md bg-brand-primary text-white border border-transparent hover:bg-brand-primary-hover hover:shadow-card"
      break
    case 'secondary':
      variantClasses = "cursor-pointer text-sm px-5 py-2.5 rounded-md bg-brand-secondary text-white border border-transparent hover:opacity-90 hover:shadow-card"
      break
    case 'ghost':
      variantClasses = "cursor-pointer text-sm px-3.5 py-2 rounded-md bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
      break
    case 'icon':
      variantClasses = "cursor-pointer p-2 rounded-md bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 [&>svg]:pointer-events-none touch-manipulation"
      break
    case 'destructive':
      variantClasses = "cursor-pointer text-sm px-5 py-2.5 rounded-md bg-red-600 text-white border border-transparent hover:bg-red-700 hover:shadow-card"
      break
  }

  return `${baseClasses} ${variantClasses} ${className}`
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={getButtonClasses(variant, className)} {...props}>
      {children}
    </button>
  )
}

export interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  className?: string
  children: React.ReactNode
}

export function ButtonLink({ variant = 'primary', className = '', children, ...props }: ButtonLinkProps) {
  return (
    <Link className={getButtonClasses(variant, className)} {...props}>
      {children}
    </Link>
  )
}
