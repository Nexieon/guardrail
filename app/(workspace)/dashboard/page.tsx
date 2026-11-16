'use client'

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/pageheader'
import { StatCard } from '@/components/ui/statcard'
import NotificationItem, { NotificationItemData } from '@/components/workspace/notification'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { getUserNotifications, markNotificationAsRead } from '@/lib/notifications'
import {
  UserPlus,
  LayoutTemplate,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  { name: 'Invite a Client', icon: UserPlus, href: '/clients' },
  { name: 'Create a Template', icon: LayoutTemplate, href: '/templates' },
  { name: 'Connect Stripe', icon: CreditCard, href: '/billing' },
]

export default function DashboardPage() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([])
  
  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient()
      try {
        const data = await getUserNotifications(supabase)
        setNotifications(data as NotificationItemData[])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  const handleNotificationClick = async (id: string) => {
    const supabase = createClient()
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    await markNotificationAsRead(supabase, id)
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <PageHeader
        title="Welcome back."
        subtitle="Here's what needs your attention today across your active projects."
      />

      {/* Top Stats Row using StatCard primitive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Projects"
          value="12"
          subtitle="Across all client workspaces"
        />

        <StatCard
          label="Pending Approvals"
          value="4"
          badge={
            <span className="bg-orange-50 text-brand-primary text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ring-inset ring-orange-500/20">
              +2 this week
            </span>
          }
          subtitle="Waiting for client sign-off"
        />

        <StatCard
          label="Storage Used"
          value="1.5GB"
          subtitle="15% of 10GB limit"
        >
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary rounded-full" style={{ width: '15%' }} />
          </div>
        </StatCard>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Strip */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-zinc-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {quickActions.map(action => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-200 transition-all text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                <div className="h-8 w-8 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-brand-primary shrink-0">
                  <action.icon className="h-4 w-4" />
                </div>
                <span>{action.name}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Notifications & Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900">Recent Notifications</h2>
            <span className="text-xs text-zinc-400 font-medium">Auto-synced</span>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 5).map(notif => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                onClick={() => handleNotificationClick(notif.id)}
              />
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-brand-divider text-zinc-400 text-sm">
                No new notifications right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
