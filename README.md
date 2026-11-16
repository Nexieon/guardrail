# Guardrail

Multi-tenant B2B SaaS CRM and client portal for web development agencies, built to manage client relationships, project pipelines, and financial tracking with strict per-tenant data isolation.

**Status:** Actively in development · Refactored Architecture

---

## Architecture & Tenancy Model

### 1. Multi-Tenant Domain Routing (`proxy.ts` & `lib/tenants/host.ts`)
Guardrail uses Next.js 16 edge proxy routing (`proxy.ts`) to inspect the incoming `Host` header and categorize traffic:
- **Apex Domain (`guardrail.com`):** Serves the public marketing site (`/`), pricing, docs, and authentication (`/login`, `/signup`). Visits to app routes (`/dashboard`) redirect to the login/tenant handoff.
- **Subdomains / Free Tier (`{slug}.guardrail.com`):** Serves the agency workspace. Agencies can bookmark `{slug}.guardrail.com` and log in directly at `{slug}.guardrail.com/login`, creating a host-scoped session.
- **Custom Domains / Paid Tiers (`portal.agency.com`):** Fully white-labeled host matching the agency's `custom_domain` column.
- **Localhost Development (`localhost:3000`):** Automatically routes to the authenticated user's workspace without requiring local DNS or hosts manipulation.

### 2. Authentication & Data Security (`lib/auth/session.ts` & Supabase RLS)
- **Server-Side Verification:** The workspace layout (`app/(workspace)/layout.tsx`) is a Server Component that invokes `requireAgency()`. Unauthenticated requests are redirected before the client shell renders.
- **Agency-Scoped Operations:** All Server Actions (`lib/clients/actions.ts`) and queries (`lib/clients/clients.ts`) strictly filter by the caller's verified `agency_id`.
- **Database Row-Level Security:** Enforced in PostgreSQL via `supabase/schema_tenancy_rls.sql` so client data is isolated even if an application check is bypassed.

### 3. White-Label Design System (Tailwind CSS v4)
Defined in `app/globals.css`:
- `--color-brand-primary` (`#FD501D`)
- `--color-brand-primary-hover` (`#E04618`)
- `--color-brand-secondary` (`#FF8D28`)
- `--color-brand-surface` (`#F8F9FA`)
- `--color-brand-offwhite` (`#F3F3F3`)
- `--color-brand-divider` (`#DCDCDC`)

UI primitives (`Button`, `Input`, `Select`, `Card`, `StatusBadge`, `Money`, `StatCard`, `PageHeader`, `Textarea`, `SortHeader`, `EmptyState`) consume these tokens.

---

## Project Structure

```
├── app/
│   ├── (landing)/page.tsx       # Marketing homepage
│   ├── login/page.tsx           # Direct & apex handoff login
│   ├── signup/page.tsx          # 3-step signup wizard (slug auto-suggestion)
│   ├── (workspace)/             # Authenticated tenant app routes
│   │   ├── layout.tsx           # Server layout (requireAgency auth gate)
│   │   ├── dashboard/           # Dashboard overview
│   │   ├── clients/             # Clients directory
│   │   ├── client/[id]/         # Client detail & management
│   │   └── projects/            # Project pipeline & board
│   ├── globals.css              # Tailwind v4 theme & brand tokens
│   └── layout.tsx               # Root layout & providers
├── components/
│   ├── ui/                      # Pure design primitives
│   ├── workspace/               # Authenticated shell, client row, notifications
│   ├── modals/                  # Modal forms & dialogs
│   ├── util/                    # Alert & modal providers
│   ├── navbar.tsx               # Marketing navbar
│   └── footer.tsx               # Marketing footer
├── lib/
│   ├── auth/                    # Auth session & server actions
│   ├── clients/                 # Client data types & server actions
│   ├── supabase/                # browser.ts & server.ts Supabase clients
│   └── tenants/                 # host.ts tenant resolution
├── supabase/
│   └── schema_tenancy_rls.sql   # SQL migration for tenancy & RLS
└── proxy.ts                     # Next.js 16 Edge proxy
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ROOT_DOMAIN=guardrail.com
```

---

## Verification

Run the test suite and type check:
```bash
npx tsc --noEmit
npm run build
npm run lint
```
