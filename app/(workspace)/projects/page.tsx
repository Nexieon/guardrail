import { getWorkspaceProjects } from "@/lib/projects/projects"
import { getCurrentWorkspaceClients } from "@/lib/clients/clients"
import ProjectsUI from "./ui"

export default async function ProjectsPage() {
  // Concurrently fetch live projects and agency clients
  const [projects, clients] = await Promise.all([
    getWorkspaceProjects(),
    getCurrentWorkspaceClients(),
  ])

  return <ProjectsUI initialProjects={projects} availableClients={clients} />
}
