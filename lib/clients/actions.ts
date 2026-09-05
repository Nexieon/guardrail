// lib/actions.ts
'use server' // <-- This tells Next.js to NEVER send this file to the browser

import { revalidatePath } from "next/cache"
import { createClient } from "../supabase/client"
import { Client } from "./client-data"

export async function updateClient(id: string, updateData: Partial<Client>): Promise<Client | null> {
    const supabase = await createClient()

    const { data: client, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)       // 1. Targets the exact row
        .select()           // 2. Asks Supabase to return the new data
        .single()           // 3. Ensures it returns an object, not an array

    if (error) {
        console.error("Error updating client:", error.message)
        return null
    }

    // 4. Purges the Next.js cache so your UI updates instantly
    revalidatePath(`/client/${id}`)
    revalidatePath('/clients') // Good idea to refresh the master table too

    return client
}

export async function deleteClient(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id) // CRITICAL: Targets the exact row to delete

    if (error) {
        console.error("Error deleting client:", error.message)
        return { success: false, error: error.message }
    }

    // Purge the cache for the master table so the UI updates instantly
    revalidatePath('/clients')
    
    return { success: true }
}