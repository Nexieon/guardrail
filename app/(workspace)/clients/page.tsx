import { getCurrentWorkspaceClients } from '@/lib/clients/clients'
import ClientsTableUI from './ui'

export default async function ClientsPage() {
  const clientsData = await getCurrentWorkspaceClients()
  return <ClientsTableUI initialClients={clientsData || []} />
}
