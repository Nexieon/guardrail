import { notFound } from 'next/navigation'
import ClientProfileClientUI from './ui'
import { getClientById } from '@/lib/clients/clients'
import { getClientProjects } from '@/lib/projects/projects'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientProfilePage({ params }: PageProps) {
  const { id } = await params
  
  const [clientData, projects] = await Promise.all([
    getClientById(id),
    getClientProjects(id),
  ])

  if (!clientData) {
    notFound()
  }

  return <ClientProfileClientUI initialClient={clientData} initialProjects={projects} />
}
