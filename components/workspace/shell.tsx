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
import { useHeaderTitle } from '@/components/util/headertitleprovider'
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
  const [activeToast, setActiveToast] = useState<NotificationItemData | null>(null)

  const { showModal, closeModal } = useModal()
  const pathname = usePathname()

  // Pleasant Web Audio API notification chime (no external audio files needed)
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()

      // Tone 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime)
      gain1.gain.setValueAtTime(0.1, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + 0.3)

      // Tone 2: E5 (659.25 Hz), soft chord interval 0.1s later
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1)
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(ctx.currentTime + 0.1)
      osc2.stop(ctx.currentTime + 0.5)
    } catch {
      // Audio autoplay policy catch
    }
  }

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

  const { title: customHeaderTitle } = useHeaderTitle()
  const pathSegments = pathname?.split('/').filter(Boolean) || []
  let currentLink = 'Dashboard'

  if (pathSegments.length > 0) {
    if (pathSegments[0] === 'client' && pathSegments.length > 1) {
      currentLink = customHeaderTitle || 'Client Profile'
    } else if (pathSegments[0] === 'project' && pathSegments.length > 1) {
      currentLink = customHeaderTitle || 'Project Details'
    } else {
      const lastSegment = pathSegments[pathSegments.length - 1]
      currentLink = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }
  }

  useEffect(() => {
    const supabase = createClient()

    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(supabase)
        setNotifications(data as NotificationItemData[])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()

    // 1. Local real-time event listener (instant 0ms trigger for client actions)
    const handleLocalNotif = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationItemData>
      if (customEvent.detail) {
        setNotifications(prev => {
          if (prev.some(n => n.id === customEvent.detail.id)) return prev
          return [customEvent.detail, ...prev]
        })
        playNotificationChime()
        setActiveToast(customEvent.detail)
      }
    }
    window.addEventListener('guardrail:notification', handleLocalNotif)

    // 2. Supabase Realtime websocket listener (for external events / other devices)
    const channel = supabase
      .channel(`workspace-notifs-${agency.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotif = payload.new as NotificationItemData
          setNotifications(prev => {
            if (prev.some(n => n.id === newNotif.id)) return prev
            return [newNotif, ...prev]
          })
          playNotificationChime()
          setActiveToast(newNotif)
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener('guardrail:notification', handleLocalNotif)
      supabase.removeChannel(channel)
    }
  }, [agency.id])

  // Auto-dismiss bottom popup toast after 5 seconds
  useEffect(() => {
    if (!activeToast) return
    const timer = setTimeout(() => {
      setActiveToast(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [activeToast])

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
              Workspace <span className="mx-2">/</span>
              {pathSegments[0] === 'project' && pathSegments.length > 1 ? (
                <>
                  <Link href="/projects" className="hover:text-zinc-900 transition-colors">Projects</Link>
                  <span className="mx-2">/</span>
                  <span className="font-semibold text-zinc-900 truncate max-w-xs">{customHeaderTitle || 'Project Details'}</span>
                </>
              ) : pathSegments[0] === 'client' && pathSegments.length > 1 ? (
                <>
                  <Link href="/clients" className="hover:text-zinc-900 transition-colors">Clients</Link>
                  <span className="mx-2">/</span>
                  <span className="font-semibold text-zinc-900 truncate max-w-xs">{customHeaderTitle || 'Client Profile'}</span>
                </>
              ) : (
                <span className="font-semibold text-zinc-900">{currentLink}</span>
              )}
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

      {/* Realtime Bottom-Corner Timed Notification Toast */}
      {activeToast && (
        <div 
          onClick={() => {
            setActiveToast(null)
            openNotificationsModal()
          }}
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl border border-brand-primary/40 p-4 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-start justify-between gap-3 cursor-pointer hover:border-brand-primary group ring-1 ring-black/5"
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                <span>{activeToast.title || 'New Notification'}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </div>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                {activeToast.message}
              </p>
              <span className="text-[10px] text-zinc-400 mt-1.5 block">Click to open notifications →</span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveToast(null)
            }}
            className="text-zinc-400 hover:text-zinc-700 p-1 -mr-1 -mt-1 cursor-pointer"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
