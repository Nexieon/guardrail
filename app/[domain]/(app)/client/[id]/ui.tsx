'use client'

import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NotificationItem from "@/components/ui/notification";
import StatusBadge from "@/components/ui/statusbadge";
import { Client } from "@/lib/supabase/client-data";
import { Activity, ArchiveIcon, ArrowLeft, Briefcase, Edit2, ExternalLink, FileText, Link, Mail, MapPin, Phone, Send, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
    initialClient: Client
}

const MOCK_PROJECTS = [
    { id: 101, name: "Q3 Corporate Tax Filing", status: "In Progress", date: "Aug 15, 2026" },
    { id: 102, name: "Annual Financial Audit", status: "Pending", date: "Sep 01, 2026" },
    { id: 103, name: "Payroll Setup", status: "Completed", date: "Jul 20, 2026" },
]

const MOCK_ACTIVITY = [
    { 
        id: "1", 
        user_id: "1",
        icon: "info" as const, 
        message: "Sarah downloaded Q2_Report.pdf", 
        link_url: "#",
        is_read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() 
    },
    { 
        id: "2", 
        user_id: "1",
        icon: "done" as const, 
        message: "Sarah logged into the portal", 
        link_url: "#",
        is_read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() 
    },
    { 
        id: "3", 
        user_id: "1",
        icon: "message" as const, 
        message: "Invoice #1042 was paid", 
        link_url: "#",
        is_read: true,
        created_at: "2026-08-02T10:00:00Z" 
    },
]

export default function ClientProfileClientUI({ initialClient }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [notes, setNotes] = useState(initialClient.internal_notes)
    const [clientStatus, setClientStatus] = useState(initialClient.status)

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link href="/clients" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Clients
                    </Link>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                        {initialClient.company_name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => alert("Trigger portal link modal")}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Client Portal
                    </Button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (Wider) */}
                <div className="xl:col-span-2 space-y-6">
                    
                    {/* 1. Client Info Card */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-zinc-400" />
                                Client Details
                            </h2>
                            <Button variant="ghost" className="h-8 text-sm px-3 text-brand-primary" onClick={() => setIsEditing(!isEditing)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                {isEditing ? 'Cancel Edit' : 'Edit Info'}
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <div className="text-sm font-medium text-zinc-500 mb-1">Primary Contact</div>
                                <div className="text-zinc-900 font-medium">{initialClient.contact_name}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-zinc-500 mb-1">Email Address</div>
                                <div className="text-zinc-900 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-zinc-400" />
                                    {initialClient.email}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-zinc-500 mb-1">Phone Number</div>
                                <div className="text-zinc-900 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-zinc-400" />
                                    {initialClient.phone}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-zinc-500 mb-1">Address</div>
                                <div className="text-zinc-900 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-zinc-400" />
                                    {initialClient.address}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 2. Projects Card */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-zinc-400" />
                                Active Projects
                            </h2>
                            <ButtonLink variant="ghost" className="h-8 text-sm px-3 text-brand-primary" href={`/projects?client=${initialClient.id}`}>
                                View all
                            </ButtonLink>
                        </div>
                        
                        <div className="space-y-3">
                            {MOCK_PROJECTS.map((project) => (
                                <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                                    <div>
                                        <div className="font-medium text-zinc-900">{project.name}</div>
                                        <div className="text-sm text-zinc-500 mt-0.5">Due {project.date}</div>
                                    </div>
                                    <StatusBadge status={project.status} />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* 3. Internal Scratchpad (Moved to Left Column) */}
                    <Card>
                        <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 mb-4">
                            <Edit2 className="h-5 w-5 text-zinc-400" />
                            Internal Notes
                        </h2>
                        <textarea 
                            value={notes || ""}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Private notes about this client..."
                            className="w-full h-32 p-3 text-sm rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none transition-all"
                        />
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-zinc-400">Client cannot see this</span>
                            <Button className="h-8 text-sm px-3 text-brand-primary" variant="ghost">Save</Button>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN (Sidebar) */}
                <div className="space-y-6">
                    
                    {/* 4. Financial Snapshot */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-5 sm:p-5">
                            <div className="text-sm font-medium text-zinc-500 mb-1">Total Billed</div>
                            <div className="text-xl font-bold text-zinc-900">{initialClient.total_billed}</div>
                        </Card>
                        
                        <Card className="p-5 sm:p-5 border-brand-primary/20 bg-brand-primary/5">
                            <div className="text-sm font-medium text-brand-primary mb-1">Outstanding</div>
                            <div className="text-xl font-bold text-brand-primary">{initialClient.outstanding_balance}</div>
                        </Card>
                    </div>

                    {/* 5. Account Status & Danger Zone (New Section) */}
                    <Card>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-zinc-400" />
                                Account Status
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Current Status Badge */}
                            <StatusBadge status={clientStatus} />
                            
                            {/* Status Toggles */}
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    className={`w-full text-xs disabled:text-zinc-600 disabled:hover:text-zinc-500 disabled:hover:cursor-not-allowed`}
                                    onClick={() => setClientStatus('Pending')}
                                    disabled={clientStatus.toLowerCase() == 'active'}
                                >
                                    <Send /> Send Request To Reactivate
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="w-full text-xs"
                                    onClick={() => setClientStatus('Archived')}
                                >
                                    <ArchiveIcon /> Archive
                                </Button>
                            </div>

                            {/* Danger Zone */}
                            <div className="pt-4 mt-2 border-t border-zinc-100">
                                <Button 
                                    className="w-full h-9 flex justify-center items-center gap-2 bg-red text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Client
                                </Button>
                                <p className="text-[10px] text-zinc-400 mt-2 text-center leading-tight">
                                    Permanently removes this client and all associated data. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* 6. Recent Activity */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-zinc-400" />
                                Recent Activity
                            </h2>
                        </div>
                        
                        <div className="flex flex-col gap-1 -mx-2">
                            {MOCK_ACTIVITY.map((activity) => (
                                <NotificationItem 
                                    key={activity.id} 
                                    notif={activity} 
                                    onClick={() => console.log(`Navigating to ${activity.link_url}`)} 
                                />
                            ))}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}