import { createClient } from "../supabase/client"
import { Client } from "./client-data"
import { requireAuth } from "../supabase/server"


export async function getClientById(id: string): Promise<Client | null> {
    const supabase = createClient()

    const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching client:", error.message)
        return null
    }

    return client
}

export async function getWorkspaceClients(agencyId: string): Promise<Client[]> {
    const supabase = createClient()

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false }) // Sorts newest clients first

    if (error) {
        console.error("Error fetching workspace clients:", error.message)
        return [] // Return an empty array so frontend map function doesn't crash
    }

    return clients || []
}

// (Assuming your manual getWorkspaceClients function is in this file or imported)

export async function getCurrentWorkspaceClients() {
    // 1. Grab the user AND the verified client instance
    const { user, supabase } = await requireAuth()
    
    // 2. Query the agency using the exact same client
    const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (agencyError || !agency) {
        throw new Error('No agency found for this user.') 
    }

    // 3. Return the data
    return getWorkspaceClients(agency.id)
}