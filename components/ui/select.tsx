'use client'

import React, { useId } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  icon?: React.ReactNode
  options: SelectOption[]
  placeholder?: string
}

export function Select({ 
  label, 
  icon, 
  options, 
  placeholder = "Select an option...", 
  className = '', 
  id, 
  ...props 
}: SelectProps) {
  const generatedId = useId()
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId)

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-zinc-900">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 flex items-center justify-center text-brand-primary pointer-events-none">
            {icon}
          </div>
        )}
        
        <select
          id={selectId}
          className={`
            w-full appearance-none rounded-lg border border-brand-primary bg-white py-2.5 text-black 
            transition-all duration-200 cursor-pointer
            focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-card
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11 pr-10' : 'pl-4 pr-10'} 
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 flex items-center justify-center text-brand-primary pointer-events-none">
          <ChevronDown className="h-4 w-4 opacity-70" />
        </div>
      </div>
    </div>
  )
}
