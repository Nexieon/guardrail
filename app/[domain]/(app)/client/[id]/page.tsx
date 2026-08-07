import { notFound } from 'next/navigation'
import ClientProfileClientUI from './ui'
import { getClientById } from '@/lib/clients'

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
    // 1. Await the params before using them (Next.js 15 requirement, good practice regardless)
    const resolvedParams = await params
    
    // 2. Fetch the data securely on the server
    const clientData = await getClientById(resolvedParams.id)

    // 3. If the DB returns nothing (wrong ID, or deleted), trigger the 404 page
    if (!clientData) {
        notFound()
    }

    // 4. Pass the real data into your interactive client component
    return <ClientProfileClientUI initialClient={clientData} />
}