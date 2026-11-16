'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "../supabase/server"
import { Client } from "./client-data"
import { requireAgency } from "../auth/session"

export interface CreateClientInput {
  company_name: string
  contact_name: string
  email: string
  phone?: string | null
  currency?: string
}

/**
 * Updates a client row, strictly enforcing that the client belongs to the caller's agency.
 */
export async function updateClient(id: string, updateData: Partial<Client>): Promise<Client | null> {
  const agency = await requireAgency()
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .eq('agency_id', agency.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating client:", error.message)
    return null
  }

  revalidatePath(`/client/${id}`)
  revalidatePath('/clients')

  return client as Client
}

/**
 * Deletes a client row, strictly enforcing that the client belongs to the caller's agency.
 */
export async function deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
  const agency = await requireAgency()
  const supabase = await createClient()

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('agency_id', agency.id)

  if (error) {
    console.error("Error deleting client:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/clients')
  revalidatePath('/dashboard')

  return { success: true }
}

/**
 * Creates a new client under the caller's authenticated agency.
 */
export async function createNewClient(data: CreateClientInput) {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert({
        company_name: data.company_name,
        contact_name: data.contact_name,
        email: data.email,
        phone: data.phone || null,
        currency: data.currency || 'USD',
        agency_id: agency.id,
        status: 'Active',
        total_billed: 0,
        outstanding_balance: 0
      })
      .select()
      .single()

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    revalidatePath('/clients')
    revalidatePath('/dashboard')

    return { success: true, data: newClient as Client }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { success: false, error: message }
  }
}
