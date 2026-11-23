import { createClient } from "@/lib/supabase/server"
import { requireAgency } from "@/lib/auth/session"
import { Project, ProjectWithClient } from "./types"

/**
 * Fetch all projects belonging to the authenticated agency, including client details.
 */
export async function getWorkspaceProjects(): Promise<ProjectWithClient[]> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients (
          id,
          company_name,
          contact_name,
          currency
        )
      `)
      .eq('agency_id', agency.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching workspace projects:", error.message)
      return []
    }

    return (projects as unknown as ProjectWithClient[]) || []
  } catch (err) {
    console.error("Failed to get workspace projects:", err)
    return []
  }
}

/**
 * Fetch all projects for a specific client within the authenticated agency.
 */
export async function getClientProjects(clientId: string): Promise<Project[]> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('agency_id', agency.id)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching client projects:", error.message)
      return []
    }

    return (projects as Project[]) || []
  } catch (err) {
    console.error("Failed to get client projects:", err)
    return []
  }
}

/**
 * Fetch a single project by ID with its client details.
 */
export async function getProjectById(projectId: string): Promise<ProjectWithClient | null> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients (
          id,
          company_name,
          contact_name,
          currency
        )
      `)
      .eq('agency_id', agency.id)
      .eq('id', projectId)
      .single()

    if (error) {
      console.error("Error fetching project:", error.message)
      return null
    }

    return project as unknown as ProjectWithClient
  } catch (err) {
    console.error("Failed to get project by id:", err)
    return null
  }
}
