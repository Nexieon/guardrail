// lib/actions.ts
'use server' // <-- This tells Next.js to NEVER send this file to the browser

import { revalidatePath } from "next/cache"
import { createClient } from "../supabase/client"
import { Client } from "./client-data"
import { cookies } from "next/headers"
import { requireAuth } from "../supabase/server"

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

// Exact Payload we expect from newClientForm
export interface CreateClientInput {
    company_name: string;
    contact_name: string;
    email: string;
    phone?: string | null;
    currency?: string;
}

export async function createNewClient(data: CreateClientInput) {
  try {
    const { user, supabase } = await requireAuth()
    
    // 1. Fetch the user's agency_id from the 'agencies' table
    const { data: agencyRecord, error: agencyError } = await supabase
      .from('agencies')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (agencyError || !agencyRecord?.id) {
      console.error('Could not find agency for user:', agencyError)
      return { success: false, error: 'Could not locate your agency profile. Have you set up your agency yet?' }
    }

    // 2. Insert the client using the correct agency ID
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert({
        company_name: data.company_name, 
        contact_name: data.contact_name, 
        email: data.email,               
        phone: data.phone || null,       
        currency: data.currency || 'USD',
        agency_id: agencyRecord.id, // <-- Using the fetched agency ID!
        status: 'Active',                
        total_billed: 0,                 
        outstanding_balance: 0           
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting client:', insertError)
      return { success: false, error: insertError.message }
    }

    revalidatePath('/clients')
    revalidatePath('/dashboard')

    return { success: true, data: newClient }

  } catch (error) {
    console.error('Action Error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}