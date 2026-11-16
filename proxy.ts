import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseTenantHost } from '@/lib/tenants/host'

/**
 * ==============================================================================
 * Next.js 16 Proxy (Edge Routing & Multi-Tenancy Engine)
 * ==============================================================================
 * NOTE: Starting with Next.js 16, Middleware is now called Proxy (`proxy.ts`).
 * 
 * HOW THIS SYSTEM WORKS:
 * 1. An incoming HTTP request hits this proxy before any route is rendered.
 * 2. We inspect the `Host` header to determine who is making the request:
 *    - APEX (guardrail.com): Marketing pages (/, /login, /signup, etc.)
 *    - SUBDOMAIN (acme.guardrail.com): Free tier agency workspace & direct login
 *    - CUSTOM DOMAIN (portal.acme.com): Paid tier agency workspace & direct login
 *    - LOCALHOST (localhost:3000): Local development mode (no DNS setup required)
 * 3. We inject tenant identification headers (`x-tenant-slug`, `x-tenant-host`)
 *    so Server Components and layouts down the tree can read them via `headers()`.
 * ==============================================================================
 */

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - static files (_next/static, _next/image)
     * - public assets (favicon.ico, svg logos, images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export function proxy(req: NextRequest) {
  const host = req.headers.get('host')
  const tenant = parseTenantHost(host)
  const { pathname } = req.nextUrl

  // SaaS application paths that require an agency workspace
  const appPaths = [
    '/dashboard',
    '/clients',
    '/client',
    '/projects',
    '/deliverables',
    '/billing',
    '/templates',
    '/settings'
  ]
  const isAppPath = appPaths.some(path => pathname.startsWith(path))

  // ----------------------------------------------------------------------------
  // CASE 1: Request is on the Apex Marketing Domain (guardrail.com)
  // ----------------------------------------------------------------------------
  if (tenant.isApex) {
    // If someone visits /dashboard on the apex without a subdomain,
    // redirect them to the apex login page.
    if (isAppPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Otherwise, allow marketing pages (/, /login, /signup, etc.) to render normally
    return NextResponse.next()
  }

  // ----------------------------------------------------------------------------
  // CASE 2: Request is on a Subdomain (acme.guardrail.com) or Custom Domain
  // ----------------------------------------------------------------------------
  // We forward the request down to the Next.js App Router, while injecting
  // tenant metadata headers into the request so server components know the tenant.
  const requestHeaders = new Headers(req.headers)

  if (tenant.subdomain) {
    requestHeaders.set('x-tenant-slug', tenant.subdomain)
  }
  if (tenant.customDomain) {
    requestHeaders.set('x-tenant-custom-domain', tenant.customDomain)
  }
  requestHeaders.set('x-tenant-host', tenant.hostname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
