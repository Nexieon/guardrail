'use client';

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
    UploadCloud,
    BookTemplate
} from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/modal'
import NotificationItem, { NotificationItemData } from '@/components/ui/notification'
import { getUserNotifications, markNotificationAsRead } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false) // Default to open based on your design

    // Navigation Data
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

    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const [notifications, setNotifications] = useState<NotificationItemData[]>([]);

    const pathname = usePathname()

    // Calculate the title instantly on every render
    const pathSegments = pathname?.split('/').filter(Boolean) || []
    let currentLink = 'Dashboard'

    if (pathSegments.length > 0) {
        // Intercept dynamic routes (like /client/1 or /client/xyz)
        if (pathSegments[0] === 'client' && pathSegments.length > 1) {
            currentLink = 'Client Profile'
        } else {
            // Default fallback: capitalize the last segment
            const lastSegment = pathSegments[pathSegments.length - 1]
            currentLink = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
        }
    }

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

    useEffect(() => {
        // Create the function that opens the modal
        const handleOpenNotifications = () => setIsNotificationsOpen(true);
        
        // Listen for our custom signal
        window.addEventListener('open-notifications', handleOpenNotifications);

        // Clean up the listener when the component unmounts
        return () => window.removeEventListener('open-notifications', handleOpenNotifications);
    }, []);

    const handleNotificationClick = async (id: string) => {
        const supabase = createClient()
        
        // Optimistically update the UI instantly so it feels fast
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        )
        setIsNotificationsOpen(false) // Close the dropdown
        
        // Update the database in the background
        await markNotificationAsRead(supabase, id)
    }

    return (
        <>
            {/* Global "Create New" Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="What would you like to create?"
            >
                <div className="flex flex-col gap-3">

                    <Button
                        variant="ghost"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="h-auto p-4 justify-start items-centergroup transition-all"
                    >
                        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
                            <FolderKanban className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-zinc-900 transition-colors">New Project</div>
                            <div className="text-xs text-zinc-500 font-normal mt-0.5">Start a new job and assign it to a client.</div>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="h-auto p-4 justify-start items-center group transition-all"
                    >
                        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
                            <Users className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-zinc-900  transition-colors">Add Client</div>
                            <div className="text-xs text-zinc-500 font-normal mt-0.5">Create a new client profile.</div>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="h-auto p-4 justify-start items-center"
                    >
                        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4  group-hover:text-white transition-colors shrink-0">
                            <UploadCloud className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-zinc-900 transition-colors">Upload Deliverable</div>
                            <div className="text-xs text-zinc-500 font-normal mt-0.5">Quickly drop a file into an existing project.</div>
                        </div>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="h-auto p-4 justify-start items-center"
                    >
                        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:text-white transition-colors shrink-0">
                            <BookTemplate className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-zinc-900 transition-colors">New Template</div>
                            <div className="text-xs text-zinc-500 font-normal mt-0.5">Quickly create a new template for forms or any other deliverable.</div>
                        </div>
                    </Button>

                </div>
            </Modal>

            {/* Alert Modal Notifications */}
            <Modal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                title={`Your Notifications (${notifications.filter(e=>e.is_read == false).length} New)`}
            >
                {/* Added max-h-[350px], overflow-y-auto, and a little right padding for the scrollbar */}
                <div className='grid gap-y-2 max-h-[350px] overflow-y-auto pr-2'>
                    {notifications.map(notif => (
                        <NotificationItem
                            notif={notif}
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif.id)}
                        />
                    ))}
                </div>
            </Modal>

            <div className="min-h-screen bg-[#F8F9FA] flex">

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
                md:translate-x-0 md:static md:flex-shrink-0
                `}>
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-transparent mb-4 mt-2">
                        {/* LEFT: Logo & Brand Name */}
                        <Link href="/" className="flex items-center gap-2">
                            {/* Using your specific brand-primary color for the logo */}
                            <div className="h-8 w-8 text-brand-primary flex-shrink-0">
                                <img src={"/guardrail-logo.svg"} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-black">
                                GuardRail
                            </span>
                        </Link>
                        {/* Mobile Close Button */}
                        <Button
                            variant='icon'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='ml-auto md:hidden'
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Scrollable Nav Area */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4">

                        {/* Workspace Section */}
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
                                            variant={`${isActive ? 'primary' : 'ghost'}`}
                                            className={`flex items-center`}
                                        >
                                            <link.icon className={`h-4 w-4`} />
                                            {link.name}
                                        </ButtonLink>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Operations Section */}
                        <div className="mb-6">
                            <h3 className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Operations
                            </h3>
                            <nav className="space-y-0.5">
                                {operationsLinks.map((link) => (
                                    <ButtonLink
                                        key={link.name}
                                        href={link.href}
                                        variant={`ghost`}
                                        className={`flex items-center`}
                                    >
                                        <link.icon className={`h-4 w-4`} />
                                        {link.name}
                                    </ButtonLink>
                                ))}
                            </nav>
                        </div>

                    </div>

                    {/* Bottom Settings Section */}
                    <div className="p-4 border-t border-zinc-100">
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Settings className="h-4 w-4 text-zinc-400" />
                                Settings
                            </div>
                            <ChevronDown
                                className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ease-in-out ${isSettingsOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Animated Expandable Settings Links */}
                        <div
                            className={`grid transition-all duration-300 ease-in-out cursor-pointer ${isSettingsOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'
                                }`}
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

                {/* Main Content Wrapper */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Top Header */}
                    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">

                        {/* Mobile Hamburger & Breadcrumbs */}
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                className="md:hidden text-zinc-600"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            <div className="hidden md:flex items-center text-sm text-zinc-500">
                                Workspace <span className="mx-2">/</span> <span className="font-semibold text-black"> {currentLink} </span>
                            </div>
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
                            <Input
                                id='global-search'
                                type="text"
                                icon={<Search className="h-4 w-4" />}
                                placeholder="Search projects, clients, files..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4 flex-1 justify-end">
                            <Button variant='primary' className="hidden md:flex items-center gap-1.5" onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="h-4 w-4" /> <p className={"hidden md:flex"}>Create New</p>
                            </Button>

                            <Button variant='icon' className="relative transition-colors" onClick={() => setIsNotificationsOpen(true)}>
                                <Bell className="h-5 w-5" />
                                {/* Notification Dot */}
                                {notifications.filter(e=>e.is_read == false).length > 0 ? <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> : <></>}
                            </Button>

                            <Button variant='icon' className="relative transition-colors">
                                <User className="h-5 w-5" />
                            </Button>
                        </div>
                    </header>

                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="max-w-6xl mx-auto">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}