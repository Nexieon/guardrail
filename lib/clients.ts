import { createClient } from "./supabase/client"
import { Client } from "./supabase/client-data"


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

    console.log(clients);

    if (error) {
        console.error("Error fetching workspace clients:", error.message)
        return [] // Return an empty array so your frontend map function doesn't crash
    }

    return clients || []
}