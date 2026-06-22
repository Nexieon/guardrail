'use client'

import { useState } from 'react'
import { Menu, X, LayoutGrid, DollarSign, Star, ArrowRight, File, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button, ButtonLink } from '@/components/ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="relative z-50 w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-b border-brand-divider">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT: Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-2">
          {/* Using your specific brand-primary color for the logo */}
          <div className="h-8 w-8 text-brand-primary flex-shrink-0">
            <img src={"guardrail-logo.svg"}/>
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            GuardRail
          </span>
        </Link>

        {/* CENTER: Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <ButtonLink href="#features" variant="ghost" className="group">
            Features <LayoutGrid className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="#pricing" variant="ghost" className="group">
            Pricing <DollarSign className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/docs" variant="ghost" className="group">
            Docs <FileText className="h-4 w-4" />
          </ButtonLink>
        </div>

        {/* RIGHT: Desktop CTA Button using our new ButtonLink */}
        <div className="hidden md:block">
          <ButtonLink href="/signup" variant="primary" className="group">
            Get Started 
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </div>

        {/* RIGHT: Mobile Hamburger Menu Button using our new Button */}
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

      {/* MOBILE MENU DROPDOWN */}
      <div 
        className={`absolute left-0 top-20 w-full origin-top border-b border-brand-divider bg-white px-4 py-6 shadow-xl transition-all duration-200 ease-in-out md:hidden ${
          isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-6">
          <ButtonLink href="#features" variant="ghost" className='flex justify-start' onClick={() => setIsOpen(false)}>
            <LayoutGrid className="h-5 w-5" /> Features
          </ButtonLink>
          <ButtonLink href="#pricing" variant="ghost" className='flex justify-start' onClick={() => setIsOpen(false)}>
            <DollarSign className="h-5 w-5" /> Pricing
          </ButtonLink>
          <ButtonLink href="/docs" variant="ghost" className='flex justify-start' onClick={() => setIsOpen(false)}>
            <FileText className="h-5 w-5" /> Docs
          </ButtonLink>
          
          <div className="pt-4 border-t border-brand-divider">
            {/* Mobile CTA using our new ButtonLink */}
            <ButtonLink 
              href="/signup" 
              variant="primary" 
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </nav>
  )
}