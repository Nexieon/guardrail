import { headers } from 'next/headers'
import { requireAgency } from '@/lib/auth/session'
import WorkspaceShell from '@/components/workspace/shell'

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const expectedSlug = headersList.get('x-tenant-slug') || undefined

  // Strictly enforce authentication and agency match on the server before rendering
  const agency = await requireAgency(expectedSlug)

  return (
    <WorkspaceShell agency={agency}>
      {children}
    </WorkspaceShell>
  )
}
