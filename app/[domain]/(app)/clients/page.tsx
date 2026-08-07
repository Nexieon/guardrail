 // Adjust the path to your clients.ts file
import { getWorkspaceClients } from '@/lib/clients'
import ClientsTableUI from './ui'

export default async function ClientsPage() {
    // Fetch the real data from your Supabase handler securely on the server
    const clientsData = await getWorkspaceClients('74c39c17-e908-4cd6-9f4d-7d1af791eff2')

    console.log(clientsData)

    // Pass the real data into your interactive client component
    // We fall back to an empty array [] just in case the fetch fails or is null
    return <ClientsTableUI initialClients={clientsData} />
}