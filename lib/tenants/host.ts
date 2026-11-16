/**
 * Tenant Host Resolution Utility
 * 
 * Inspects incoming request Host headers and determines whether the request is:
 * 1. Apex / Marketing (e.g. guardrail.com)
 * 2. Subdomain / Free tier (e.g. acme.guardrail.com)
 * 3. Custom domain / Paid tier (e.g. portal.acme.com)
 * 4. Localhost dev mode (e.g. localhost:3000)
 */

export interface TenantHostInfo {
  isApex: boolean
  isLocalhost: boolean
  subdomain: string | null
  customDomain: string | null
  hostname: string
}

export function parseTenantHost(hostHeader: string | null): TenantHostInfo {
  // Strip port number (e.g. "localhost:3000" -> "localhost")
  const rawHost = hostHeader?.replace(/:\d+$/, '').toLowerCase() || 'localhost'
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'guardrail.com').toLowerCase()

  // 1. Localhost / Private IP development check
  const isLocalhost =
    rawHost === 'localhost' ||
    rawHost.startsWith('127.0.0.1') ||
    rawHost.startsWith('192.168.') ||
    rawHost === '0.0.0.0'

  if (isLocalhost) {
    return {
      isApex: false,
      isLocalhost: true,
      subdomain: null,
      customDomain: null,
      hostname: rawHost
    }
  }

  // 2. Apex domain check (e.g., "guardrail.com" or "www.guardrail.com")
  if (rawHost === rootDomain || rawHost === `www.${rootDomain}`) {
    return {
      isApex: true,
      isLocalhost: false,
      subdomain: null,
      customDomain: null,
      hostname: rawHost
    }
  }

  // 3. Subdomain check (e.g., "acme.guardrail.com" -> slug is "acme")
  if (rawHost.endsWith(`.${rootDomain}`)) {
    const slug = rawHost.replace(`.${rootDomain}`, '')
    return {
      isApex: false,
      isLocalhost: false,
      subdomain: slug,
      customDomain: null,
      hostname: rawHost
    }
  }

  // 4. Custom domain (e.g., "portal.acme.com")
  return {
    isApex: false,
    isLocalhost: false,
    subdomain: null,
    customDomain: rawHost,
    hostname: rawHost
  }
}
