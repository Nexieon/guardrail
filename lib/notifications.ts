import { NotificationIconType, NotificationItemData } from '@/components/ui/notification';
import { SupabaseClient } from '@supabase/supabase-js'

export interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    icon?: NotificationIconType;
    linkUrl?: string;
    clientId?: string;
}

/**
 * Fetches all notifications for the currently authenticated user.
 */
export async function getUserNotifications(supabase: SupabaseClient): Promise<NotificationItemData[]> {
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('is_read', {ascending: true})
        .order('created_at', { ascending: false })
        .limit(50); // Keep the UI snappy by only grabbing the latest 50

    if (error) throw error;
    return data;
}

/**
 * Marks a single notification as read.
 * Call this right before routing the user to the linkUrl.
 */
export async function markNotificationAsRead(supabase: SupabaseClient, notificationId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) throw error;
}

/**
 * Marks all of a user's notifications as read.
 * Useful for a "Mark all as read" button in the dropdown.
 */
export async function markAllNotificationsAsRead(supabase: SupabaseClient, userId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false); // Only update unread ones to save database work

    if (error) throw error;
}

/**
 * Creates a new notification. 
 * Note: You will mostly call this from backend Server Actions after a user does something 
 * (like uploading a file or approving a project), NOT from client components.
 */
export async function createNotification(
    supabase: SupabaseClient,
    params: CreateNotificationParams
) {
    const { error } = await supabase
        .from('notifications')
        .insert([
            {
                user_id: params.userId,
                title: params.title,
                message: params.message,
                icon: params.icon || 'info',
                link_url: params.linkUrl || null,
                is_read: false,
                client_id: params.clientId || null
            }
        ]);

    if (error) throw error;
}

/**
 * Fetches the chronological activity history for a specific client.
 */
export async function getClientActivity(supabase: SupabaseClient, clientId: string): Promise<NotificationItemData[]> {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(50); // Keeps the detail view rendering fast

    if (error) throw error;
    return data as NotificationItemData[];
}