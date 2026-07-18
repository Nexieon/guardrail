'use client'

import { X } from 'lucide-react'
import { Button } from './ui/button'

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title?: string, children: React.ReactNode }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 transition-opacity" onClick={onClose}>
      {/* stopPropagation prevents clicks inside the modal from closing it */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between mb-5">
          {title && <h2 className="text-lg font-bold text-zinc-900">{title}</h2>}
          <Button variant="ghost" onClick={onClose} className="p-2 rounded-full h-auto">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {children}
      </div>
    </div>
  )
}