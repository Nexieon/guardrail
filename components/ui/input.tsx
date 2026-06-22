import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export function Input({ label, icon, className = '', id, ...props }: InputProps) {
  // Automatically generate an ID to link the label to the input for accessibility
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9))

  return (
    <div className="flex w-full flex-col gap-1.5">
      {/* Conditionally render the label if you pass one */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-black">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {/* Conditionally render the icon if you pass one */}
        {icon && (
          <div className="absolute left-4 flex items-center justify-center text-brand-primary">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={props.type}
          className={`
            w-full rounded-lg border border-brand-primary bg-white py-2.5 text-black 
            placeholder:text-brand-primary/70 transition-all duration-200
            focus:border-brand-primary focus:outline-none focus:ring-0 focus:shadow-card
            ${icon ? 'pl-11 pr-4' : 'px-4'} 
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  )
}