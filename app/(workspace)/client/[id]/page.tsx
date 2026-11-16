import { notFound } from 'next/navigation'
import ClientProfileClientUI from './ui'
import { getClientById } from '@/lib/clients/clients'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientProfilePage({ params }: PageProps) {
  const { id } = await params
  const clientData = await getClientById(id)

  if (!clientData) {
    notFound()
  }

  return <ClientProfileClientUI initialClient={clientData} />
}
