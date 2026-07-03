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

// FIX: The function must now be named 'proxy' instead of 'middleware'
export function proxy(req: NextRequest) {
  const url = req.nextUrl

  // 1. Get the hostname from the request (e.g., portal.agency.com or localhost:3000)
  let hostname = req.headers.get('host') || 'guardrail.app'

  // Remove the port number if you are testing on your local network/IP
  hostname = hostname.replace(/:\d+$/, '')

  // 2. Define what your "main" root domains are
  const isLocalhost = hostname === 'localhost' || hostname.includes('192.168.') || hostname === '0.0.0.0'
  const rootDomain = isLocalhost ? hostname : 'guardrail.app'

  // 3. The Logic Split: Root vs. Custom Domain

  // If the user is on the main site (guardrail.app or localhost:3000)
  // Let them proceed normally.
  if (hostname === rootDomain) {
    return NextResponse.next()
  }

  // If they are on ANY other domain (e.g., portal.acme.com, or acme.localhost)
  // Invisibly rewrite the URL to point to our hidden app/[domain] folder
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url))
}