'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "../supabase/server"
import { requireAgency } from "../auth/session"
import { notifyAgency } from "../notifications/actions"
import { CreateProjectInput, Project, ProjectStatus, UpdateProjectInput } from "./types"

/**
 * Creates a new project assigned to a client under the current agency.
 */
export async function createNewProject(
  input: CreateProjectInput
): Promise<{ success: boolean; data?: Project; notification?: import("@/components/ui/notification").NotificationItemData; error?: string }> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    if (!input.name?.trim()) {
      return { success: false, error: "Project name is required" }
    }

    if (!input.client_id) {
      return { success: false, error: "Client assignment is required" }
    }

    // Verify client belongs to current agency
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id, currency, company_name')
      .eq('id', input.client_id)
      .eq('agency_id', agency.id)
      .single()

    if (clientErr || !client) {
      return { success: false, error: "Invalid client selected" }
    }

    const newProjectData = {
      agency_id: agency.id,
      client_id: input.client_id,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      budget: input.budget ? Number(input.budget) : 0.00,
      currency: input.currency || client.currency || 'CAD',
      status: input.status || 'planning',
      progress: input.progress ? Number(input.progress) : 0,
      due_date: input.due_date || null,
      next_task: input.next_task?.trim() || null,
    }

    const { data: project, error: insertErr } = await supabase
      .from('projects')
      .insert(newProjectData)
      .select()
      .single()

    if (insertErr || !project) {
      console.error("Error creating project:", insertErr?.message)
      return { success: false, error: insertErr?.message || "Failed to create project" }
    }

    revalidatePath('/projects')
    revalidatePath('/dashboard')
    revalidatePath(`/client/${input.client_id}`)

    // Automatically notify agency owner of new project
    const notifRes = await notifyAgency({
      title: "New Project Created",
      message: `Project "${project.name}" was assigned to ${client.company_name}.`,
      icon: "done",
      linkUrl: "/projects",
      clientId: input.client_id,
    })

    return { success: true, data: project as Project, notification: notifRes.data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    console.error("createNewProject exception:", message)
    return { success: false, error: message }
  }
}

/**
 * Updates a project's status with immediate cache revalidation.
 */
export async function updateProjectStatus(
  projectId: string,
  newStatus: ProjectStatus
): Promise<{ success: boolean; notification?: import("@/components/ui/notification").NotificationItemData; error?: string }> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: project, error } = await supabase
      .from('projects')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('agency_id', agency.id)
      .select('name, client_id')
      .single()

    if (error) {
      console.error("Error updating project status:", error.message)
      return { success: false, error: error.message }
    }

    revalidatePath('/projects')
    revalidatePath('/dashboard')
    if (project?.client_id) {
      revalidatePath(`/client/${project.client_id}`)
    }

    // Automatically notify agency owner of status change
    const notifRes = await notifyAgency({
      title: "Project Status Updated",
      message: `"${project?.name || 'Project'}" moved to status "${newStatus}".`,
      icon: newStatus === 'completed' ? 'done' : 'info',
      linkUrl: "/projects",
      clientId: project?.client_id,
    })

    return { success: true, notification: notifRes.data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return { success: false, error: message }
  }
}

/**
 * Updates general fields on a project row.
 */
export async function updateProject(
  projectId: string,
  updateData: UpdateProjectInput
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: updated, error } = await supabase
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('agency_id', agency.id)
      .select()
      .single()

    if (error || !updated) {
      console.error("Error updating project:", error?.message)
      return { success: false, error: error?.message || "Failed to update project" }
    }

    revalidatePath('/projects')
    revalidatePath('/dashboard')
    if (updated.client_id) {
      revalidatePath(`/client/${updated.client_id}`)
    }

    return { success: true, data: updated as Project }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return { success: false, error: message }
  }
}

/**
 * Deletes a project row scoped to the agency.
 */
export async function deleteProject(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const { data: deleted, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('agency_id', agency.id)
      .select('client_id')
      .single()

    if (error) {
      console.error("Error deleting project:", error.message)
      return { success: false, error: error.message }
    }

    revalidatePath('/projects')
    revalidatePath('/dashboard')
    if (deleted?.client_id) {
      revalidatePath(`/client/${deleted.client_id}`)
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return { success: false, error: message }
  }
}
