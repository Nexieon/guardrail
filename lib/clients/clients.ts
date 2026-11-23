import { createClient } from "@/lib/supabase/server"
import { Client } from "./client-data"
import { requireAgency } from "../auth/session"

/**
 * Fetch a single client by ID, strictly scoped to the user's current agency.
 */
export async function getClientById(id: string): Promise<Client | null> {
  const agency = await requireAgency()
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('agency_id', agency.id)
    .single()

  if (error) {
    return null
  }

  return client as Client
}

/**
 * Fetch all clients belonging to a specific agency ID.
 */
export async function getWorkspaceClients(agencyId: string): Promise<Client[]> {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      *,
      projects:projects(id, status)
    `)
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return ((clients as Array<Client & { projects?: Array<{ id: string; status: string }> }>) || []).map(client => {
    const activeCount = client.projects?.filter(p => p.status === 'in progress').length ?? 0
    const copy = { ...client }
    delete (copy as { projects?: unknown }).projects
    return {
      ...copy,
      active_projects_count: activeCount
    }
  })
}

/**
 * Convenience helper to fetch all clients for the authenticated user's agency.
 */
export async function getCurrentWorkspaceClients(): Promise<Client[]> {
  const agency = await requireAgency()
  return getWorkspaceClients(agency.id)
}
