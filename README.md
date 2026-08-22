# Guardrail
 
Multi-tenant B2B SaaS CRM and client portal for web development agencies, built to manage client relationships, project pipelines, and financial tracking with strict per-tenant data isolation.
 
**Status:** Actively in development · Not yet deployed
 
---
 
## Overview
 
Guardrail gives agencies like [Nexieon](https://github.com/nexieon) a single platform to onboard clients, track project and financial health, and give each client a dedicated, isolated dashboard — without spinning up separate infrastructure per tenant.
 
The system is built around three core requirements:
 
- **Strict tenant isolation** — no client can ever access another client's data, enforced at the database layer rather than trusted to application logic alone.
- **Subdomain-based routing** — each tenant gets a clean, dedicated `[domain]`-style entry point, resolved dynamically rather than hardcoded.
- **Low client-side overhead** — dashboards feel instant by pushing data-heavy work to the server and shipping minimal JavaScript to the browser.
---
 
## Architecture
 
### Multi-Tenancy & Routing
Custom edge middleware inspects incoming requests and resolves the tenant based on subdomain, rewriting the request into an internal `[domain]` route structure. This keeps tenant resolution out of application code and avoids full page reloads when switching context.
 
### Data Layer
PostgreSQL via Supabase, with a normalized relational schema and Row-Level Security (RLS) policies enforcing tenant isolation directly at the database level. Access control is not something the application can accidentally bypass — it's guaranteed by the database itself, independent of any bug in the app layer.
 
### Rendering & Data Fetching
Built on Next.js App Router with an emphasis on Server Components: data fetching and heavy computation happen server-side, keeping the client bundle small and pages fast on first load.
 
### UI System
A bespoke design system built directly on Tailwind CSS with lightweight, strictly-typed internal components rather than a bundled component library — keeping the bundle size and design language fully under project control.
 
### Deployment
Designed for serverless/edge deployment on Vercel, with GitHub for source control and CI.
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Server Components) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase), Row-Level Security |
| Styling | Tailwind CSS |
| Hosting | Vercel (Edge) |
| Source Control / CI | GitHub |
 
---
 
## Core Features (In Progress)
 
- [x] Multi-tenant routing via edge middleware
- [x] Row-Level Security data isolation
- [ ] Client financial health dashboards
- [ ] Project pipeline tracking
- [ ] Activity feed / audit log per client
- [ ] Global async confirmation/alert system
---
 
## Roadmap
 
Guardrail is under active development. Planned milestones include finishing the client dashboard experience, financial reporting views, and a first internal deployment for Nexieon's own client base before considering wider availability.
 
---
 
## License
 
Proprietary — part of the Nexieon product suite. Not currently open for external contributions.
