'use server'

import { createClient } from "@/lib/supabase/server"
import { requireAgency } from "@/lib/auth/session"
import { NotificationIconType, NotificationItemData } from "@/components/ui/notification"

export interface NotifyAgencyParams {
  title: string
  message: string
  icon?: NotificationIconType
  linkUrl?: string
  clientId?: string
  userId?: string // Optional override if targeting a specific user
}

/**
 * Universal server helper to create a notification for the agency.
 * Automatically resolves the agency owner's user_id from the session without manual lookups.
 */
export async function notifyAgency(
  params: NotifyAgencyParams
): Promise<{ success: boolean; data?: NotificationItemData; error?: string }> {
  try {
    const agency = await requireAgency()
    const supabase = await createClient()

    const targetUserId = params.userId || agency.user_id

    const { data: notif, error } = await supabase
      .from('notifications')
      .insert({
        user_id: targetUserId,
        title: params.title,
        message: params.message,
        icon: params.icon || 'info',
        link_url: params.linkUrl || null,
        client_id: params.clientId || null,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error("notifyAgency error:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data: notif as NotificationItemData }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to notify agency"
    console.error("notifyAgency exception:", msg)
    return { success: false, error: msg }
  }
}
