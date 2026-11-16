'use client'

import React, { useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export function Input({ label, icon, className = '', id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId)

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-zinc-900">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 flex items-center justify-center text-brand-primary pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={props.type}
          className={`
            w-full rounded-lg border border-brand-primary bg-white py-2.5 text-black 
            placeholder:text-brand-primary/70 transition-all duration-200
            focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-card
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11 pr-4' : 'px-4'} 
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  )
}
