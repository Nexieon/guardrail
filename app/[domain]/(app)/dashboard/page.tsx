'use client';

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  UserPlus,
  LayoutTemplate,
  CreditCard
} from 'lucide-react'
import NotificationItem, { NotificationItemData } from '@/components/ui/notification'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserNotifications, markNotificationAsRead } from '@/lib/notifications'

// --- Mock Data ---
const needsAttentionItems = [
  { id: 1, title: 'Acme Co.', action: 'left 3 comments on Logo_v2.png', time: '12m ago', icon: MessageSquare },
  { id: 2, title: 'Nova Studios', action: 'approved Homepage_Wireframe.fig', time: '1h ago', icon: CheckCircle2 },
  { id: 3, title: 'Kite Labs', action: 'uploaded 4 new brand assets', time: '3h ago', icon: ImageIcon },
  { id: 4, title: 'Riven & Co.', action: 'requested revision #4 (over limit)', time: 'Yesterday', icon: FileText },
]

const quickActions = [
  { name: 'Invite a Client', icon: UserPlus, href: '/clients/new' },
  { name: 'Create a Template', icon: LayoutTemplate, href: '/templates/new' },
  { name: 'Connect Stripe', icon: CreditCard, href: '/settings/billing' },
]

const activeProjects = [
  { id: 1, title: 'Acme Rebrand', client: 'Acme Co.', status: 'In Review', bgClass: 'bg-orange-50' },
  { id: 2, title: 'Nova Landing Redesign', client: 'Nova Studios', status: 'In Progress', bgClass: 'bg-blue-50' },
  { id: 3, title: 'Kite Brand System', client: 'Kite Labs', status: 'In Progress', bgClass: 'bg-teal-50' },
]

export default function DashboardPage() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient()
      try {
        // Get the data and set it directly
        const data = await getUserNotifications(supabase)
        setNotifications(data as NotificationItemData[])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, []);

  const handleNotificationClick = async (id: string) => {
    const supabase = createClient()

    // Optimistically update the UI instantly so it feels fast
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )

    // Update the database in the background
    await markNotificationAsRead(supabase, id)
  }

  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Welcome back, User.</h1>
        <p className="text-sm text-zinc-500 mt-1">Here's what needs your attention today.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 sm:p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Active Projects</h3>
          <p className="text-4xl font-bold text-zinc-900">12</p>
        </Card>

        <Card className="p-5 sm:p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Pending Approvals</h3>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-bold text-zinc-900">4</p>
            <span className="bg-orange-50 text-brand-primary text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ring-inset ring-orange-500/20">
              +2 this week
            </span>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Storage Used</h3>
          <p className="text-4xl font-bold text-zinc-900 mb-3">1.5GB</p>
          {/* Standard Progress Bar */}
          <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-2">
            <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-zinc-400">1.5GB of 2.0GB used</p>
        </Card>
      </div>

      {/* Middle Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Needs Attention Feed (Spans 2 columns) */}
        <Card className="p-5 sm:p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">Needs Attention</h2>
            <Button variant='ghost' className="text-sm font-medium text-brand-primary transition-all" onClick={()=>window.dispatchEvent(new Event('open-notifications'))}>
              View all
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            {
              notifications.filter(e => !e.is_read).length > 0 ? 
              notifications.filter(e => !e.is_read).map(notif => (
                <NotificationItem
                  notif={notif}
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                />
              ))
              : <>
                <p className="text-sm text-zinc-500 mb-6">No new notifications at the moment, This will update as soon as there is something new.</p>
              </>
            }
          </div>
        </Card>

        {/* Quick Actions (Spans 1 column) */}
        <Card className="p-5 sm:p-6 flex flex-col">
          <h2 className="text-lg font-bold text-zinc-900">Quick Actions</h2>
          <p className="text-sm text-zinc-500 mb-6">Jump into common tasks.</p>

          <div className="flex flex-col gap-3 mt-auto">
            {quickActions.map((action) => (
              <Button key={action.name} variant="ghost" className="w-full justify-start py-6 ">
                <div className="h-8 w-8 rounded-md bg-zinc-50 group-hover:bg-orange-50 flex items-center justify-center mr-2 transition-colors">
                  <action.icon className="h-4 w-4 group-hover:text-brand-primary transition-colors" />
                </div>
                {action.name}
              </Button>
            ))}
          </div>
        </Card>

      </div>

      {/* Bottom Projects Grid */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900">Active Projects</h2>
          <Link href="/projects" className="text-sm font-medium text-brand-primary hover:underline transition-all">
            See all projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeProjects.map((project) => (
            <Card key={project.id} className="p-0 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
              {/* Color Block Header */}
              <div className={`h-28 w-full ${project.bgClass} transition-colors`} />

              {/* Card Body */}
              <div className="p-5 flex items-center justify-between bg-white">
                <div className="min-w-0 pr-4">
                  <h3 className="font-bold text-zinc-900 truncate">{project.title}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{project.client}</p>
                </div>
                <span className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-600 bg-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  {project.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}