import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl

  let hostname = req.headers.get('host') || 'guardrail.app'
  hostname = hostname.replace(/:\d+$/, '')

  const isLocalhost = hostname === 'localhost' || hostname.includes('192.168.') || hostname === '0.0.0.0'
  const rootDomain = isLocalhost ? hostname : 'guardrail.app'

  // The paths that belong to the actual SaaS app, not the marketing site
  const appPaths = ['/dashboard', '/projects', '/clients', '/deliverables', '/billing', '/templates', '/settings', '/client']
  const isAppPath = appPaths.some(path => url.pathname.startsWith(path))

  // 1. If they are on the main site (guardrail.app or localhost:3000)
  if (hostname === rootDomain) {
    // If they are trying to access the dashboard or other app pages,
    // invisibly route them into the [domain] folder using the root domain name
    if (isAppPath) {
      return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url))
    }
    
    // Otherwise, let them proceed normally to /, /login, or /signup
    return NextResponse.next()
  }

  // 2. If they are on a custom domain (e.g., portal.acme.com)
  // Route EVERYTHING into the [domain] folder
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url))
}