import { notFound } from 'next/navigation'
import ProjectDetailsUI from './ui'
import { getProjectById } from '@/lib/projects/projects'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailsUI initialProject={project} />
}
