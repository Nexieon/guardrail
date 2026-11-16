'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileBox,
  Receipt,
  LayoutTemplate,
  Settings,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  Plus,
  User,
} from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NotificationItem, { NotificationItemData } from '@/components/workspace/notification'
import { getUserNotifications, markNotificationAsRead } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/browser'
import { useModal } from '@/components/util/modalprovider'
import CreateNewMenu from '@/components/modals/createNewMenu'
import { Agency } from '@/lib/auth/session'

interface WorkspaceShellProps {
  agency: Agency
  children: React.ReactNode
}

export default function WorkspaceShell({ agency, children }: WorkspaceShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<NotificationItemData[]>([])

  const { showModal, closeModal } = useModal()
  const pathname = usePathname()

  const workspaceLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Deliverables', href: '/deliverables', icon: FileBox },
  ]

  const operationsLinks = [
    { name: 'Invoices & Billing', href: '/billing', icon: Receipt },
    { name: 'Templates', href: '/templates', icon: LayoutTemplate },
  ]

  const settingsLinks = [
    { name: 'General', href: '/settings/general' },
    { name: 'Customization', href: '/settings/customization' },
    { name: 'Domains', href: '/settings/domains' },
    { name: 'Subscription', href: '/settings/subscription' },
  ]

  const pathSegments = pathname?.split('/').filter(Boolean) || []
  let currentLink = 'Dashboard'

  if (pathSegments.length > 0) {
    if (pathSegments[0] === 'client' && pathSegments.length > 1) {
      currentLink = 'Client Profile'
    } else {
      const lastSegment = pathSegments[pathSegments.length - 1]
      currentLink = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }
  }

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
    closeModal()
    await markNotificationAsRead(supabase, id)
  }

  const openNotificationsModal = () => {
    showModal(
      `Notifications (${notifications.filter(e => !e.is_read).length} New)`,
      <div className='grid gap-y-2 max-h-87.5 overflow-y-auto pr-2'>
        {notifications.map(notif => (
          <NotificationItem
            notif={notif}
            key={notif.id}
            onClick={() => handleNotificationClick(notif.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shrink-0
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 mb-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 text-brand-primary shrink-0">
              <img src="/guardrail-logo.svg" alt="GuardRail Logo" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              {agency.company_name || 'GuardRail'}
            </span>
          </Link>
          <Button
            variant="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="ml-auto md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mb-6">
            <h3 className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Workspace
            </h3>
            <nav className="space-y-1">
              {workspaceLinks.map((link) => {
                const isActive = pathname?.includes(link.href) || (link.name === 'Dashboard' && pathname === '/dashboard')
                return (
                  <ButtonLink
                    key={link.name}
                    href={link.href}
                    variant={isActive ? 'primary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </ButtonLink>
                )
              })}
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Operations
            </h3>
            <nav className="space-y-1">
              {operationsLinks.map((link) => (
                <ButtonLink
                  key={link.name}
                  href={link.href}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.name}
                </ButtonLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Collapsible Settings */}
        <div className="p-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-zinc-400" />
              Settings
            </div>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${isSettingsOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
          >
            <div className="overflow-hidden">
              <div className="pl-10 pr-3 space-y-1 pb-2">
                {settingsLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block py-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center text-sm text-zinc-500">
              Workspace <span className="mx-2">/</span> <span className="font-semibold text-zinc-900">{currentLink}</span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <Input
              id="global-search"
              type="text"
              icon={<Search className="h-4 w-4" />}
              placeholder="Search projects, clients, files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <Button
              variant="primary"
              className="hidden md:flex items-center gap-1.5"
              onClick={() => {
                showModal(
                  "What would you like to create?",
                  <CreateNewMenu closeMenu={closeModal} />
                )
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </Button>

            <Button
              variant="icon"
              className="relative"
              onClick={openNotificationsModal}
            >
              <Bell className="h-5 w-5" />
              {notifications.some(e => !e.is_read) && (
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-brand-primary ring-2 ring-white" />
              )}
            </Button>

            <Button variant="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
