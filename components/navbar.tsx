'use client'

import { useState } from 'react'
import { Menu, X, LayoutGrid, DollarSign, ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button, ButtonLink } from '@/components/ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="relative z-50 w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-b border-brand-divider">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 text-brand-primary shrink-0">
            <img src="/guardrail-logo.svg" alt="GuardRail Logo" className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            GuardRail
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <ButtonLink href="#features" variant="ghost" className="group">
            <span>Features</span>
            <LayoutGrid className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="#pricing" variant="ghost" className="group">
            <span>Pricing</span>
            <DollarSign className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/docs" variant="ghost" className="group">
            <span>Docs</span>
            <FileText className="h-4 w-4" />
          </ButtonLink>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ButtonLink href="/login" variant="ghost">
            Log In
          </ButtonLink>
          <ButtonLink href="/signup" variant="primary" className="group">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-b border-brand-divider bg-white px-4 py-6 shadow-xl md:hidden">
          <div className="flex flex-col space-y-3">
            <ButtonLink href="#features" variant="ghost" className="justify-start w-full" onClick={() => setIsOpen(false)}>
              <LayoutGrid className="h-5 w-5 mr-2" /> Features
            </ButtonLink>
            <ButtonLink href="#pricing" variant="ghost" className="justify-start w-full" onClick={() => setIsOpen(false)}>
              <DollarSign className="h-5 w-5 mr-2" /> Pricing
            </ButtonLink>
            <ButtonLink href="/docs" variant="ghost" className="justify-start w-full" onClick={() => setIsOpen(false)}>
              <FileText className="h-5 w-5 mr-2" /> Docs
            </ButtonLink>
            
            <div className="pt-4 border-t border-brand-divider flex flex-col gap-2">
              <ButtonLink href="/login" variant="ghost" className="w-full justify-center" onClick={() => setIsOpen(false)}>
                Log In
              </ButtonLink>
              <ButtonLink 
                href="/signup" 
                variant="primary" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 ml-1" />
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
