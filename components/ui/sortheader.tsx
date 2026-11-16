import React from 'react'
import { ArrowUpDown } from 'lucide-react'

interface SortHeaderProps {
  label: string
  onClick: () => void
  align?: 'left' | 'center' | 'right'
}

export function SortHeader({ label, onClick, align = 'left' }: SortHeaderProps) {
  const alignClass = align === 'center' ? 'justify-center w-full text-center' : align === 'right' ? 'justify-end w-full' : 'justify-start'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 uppercase font-semibold text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer ${alignClass}`}
    >
      <span>{label}</span>
      <ArrowUpDown className="h-3 w-3 shrink-0" />
    </button>
  )
}
