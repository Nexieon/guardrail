 // Adjust the path to your clients.ts file
import { getCurrentWorkspaceClients } from '@/lib/clients/clients'
import ClientsTableUI from './ui'

export default async function ClientsPage() {
    // This now securely fetches based on whoever is logged in!
    const clientsData = await getCurrentWorkspaceClients()

    return <ClientsTableUI initialClients={clientsData || []} />
}