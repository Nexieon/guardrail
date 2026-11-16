import Link from 'next/link'
import { LayoutGrid, DollarSign, FileText, History, Lock } from 'lucide-react'
import { ButtonLink } from './button'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-offwhite border-t border-brand-divider pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 text-brand-primary shrink-0">
              <img src="/guardrail-logo.svg" alt="GuardRail Logo" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">
              GuardRail
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <ButtonLink href="#features" variant="ghost" className="flex items-center gap-1.5 text-sm">
              <LayoutGrid className="h-4 w-4" /> Features
            </ButtonLink>
            <ButtonLink href="#pricing" variant="ghost" className="flex items-center gap-1.5 text-sm">
              <DollarSign className="h-4 w-4" /> Pricing
            </ButtonLink>
            <ButtonLink href="/docs" variant="ghost" className="flex items-center gap-1.5 text-sm">
              <FileText className="h-4 w-4" /> Docs
            </ButtonLink>
            <ButtonLink href="/changelog" variant="ghost" className="flex items-center gap-1.5 text-sm">
              <History className="h-4 w-4" /> Changelog
            </ButtonLink>
            <ButtonLink href="/privacy" variant="ghost" className="flex items-center gap-1.5 text-sm">
              <Lock className="h-4 w-4" /> Privacy
            </ButtonLink>
          </div>
        </div>

        <hr className="my-8 border-brand-divider" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-zinc-500 md:flex-row md:text-left">
          <p>&copy; {currentYear} GuardRail. All rights reserved.</p>
          <p>Built for independent professionals and agencies by Nexieon.</p>
        </div>
      </div>
    </footer>
  )
}
