import Link from 'next/link'
import { LayoutGrid, DollarSign, FileText, History, Lock } from 'lucide-react'
import { ButtonLink } from './button'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-offwhite border-t border-brand-divider pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Section: Logo & Links */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 text-brand-primary flex-shrink-0">
              <img src={"guardrail-logo.svg"}/>
            </div>
            <span className="text-xl font-bold tracking-tight text-black">
              GuardRail
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <ButtonLink href="#features" variant="ghost" className="flex items-center gap-1.5 text-sm transition-colors">
              Features <LayoutGrid className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#pricing" variant="ghost" className="flex items-center gap-1.5 text-sm transition-colors">
              Pricing <DollarSign className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/docs" variant="ghost" className="flex items-center gap-1.5 text-sm transition-colors">
              Docs <FileText className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/changelog" variant="ghost" className="flex items-center gap-1.5 text-sm transition-colors">
              Changelog <History className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/privacy" variant="ghost" className="flex items-center gap-1.5 text-sm transition-colors">
              Privacy <Lock className="h-4 w-4" />
            </ButtonLink>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-8 border-brand-divider" />

        {/* Bottom Section: Copyright & Credits */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-zinc-500 md:flex-row md:text-left">
          <p>
            &copy; {currentYear} GuardRail. All rights reserved.
          </p>
          <p>
            Built for independent professionals and agencies by Nexieon.
          </p>
        </div>

      </div>
    </footer>
  )
}