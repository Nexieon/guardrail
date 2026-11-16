'use client'

import React, { useId } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', id, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId)

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-zinc-900">
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={`
          w-full rounded-lg border border-brand-primary bg-white p-3 text-sm text-black 
          placeholder:text-brand-primary/70 transition-all duration-200 resize-none
          focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-card
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    </div>
  )
}
