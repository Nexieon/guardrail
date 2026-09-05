'use client'

import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NotificationItem, { NotificationItemData } from "@/components/ui/notification";
import StatusBadge from "@/components/ui/statusbadge";
import { useAlert } from "@/components/util/alertprovider";
import { deleteClient, updateClient } from "@/lib/clients/actions";
import { Client, ClientStatus, formatFinancials } from "@/lib/clients/client-data";
import { getClientActivity } from "@/lib/notifications";
import { createClient } from "@/lib/supabase/client";
import { Activity, ArchiveIcon, ArrowLeft, Briefcase, Edit2, ExternalLink, FileText, Link, Mail, MapPin, PersonStanding, Phone, Send, ShieldAlert, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";

interface Props {
    initialClient: Client
}

const MOCK_PROJECTS = [
    { id: 101, name: "Q3 Corporate Tax Filing", status: "In Progress", date: "Aug 15, 2026" },
    { id: 102, name: "Annual Financial Audit", status: "Pending", date: "Sep 01, 2026" },
    { id: 103, name: "Payroll Setup", status: "Completed", date: "Jul 20, 2026" },
]

export default function ClientProfileClientUI({ initialClient }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const { showAlert } = useAlert();

    //
    
    // Client Info Card
    const [isEditing, setIsEditing] = useState(false)
    const [contactName, setContactName] = useState(initialClient.contact_name || '')
    const [email, setEmail] = useState(initialClient.email || '')
    const [phone, setPhone] = useState(initialClient.phone || '')
    const [address, setAddress] = useState(initialClient.address || '')
    
    
    const handleSaveClientInfo = async () => {
        if (isEditing) {
            setIsLoading(true);
            
            // Pass the ID, and just the specific field you want to update
            const updatedClient = await updateClient(initialClient.id, { 
                contact_name: contactName,
                email: email,
                phone: phone,
                address: address
            });
            
            if (updatedClient) {
                showAlert({
                    title: "Success",
                    message: `Client's new info was saved successfully.`,
                    confirmText: "Close",
                    icon: "success"
                });
            } else {
                // Show an error alert
                showAlert({
                    title: "Error",
                    message: `Failed to save new info. Old info is still stored.`,
                    confirmText: "Close",
                    icon: "wrong"
                });
            }
            
            setIsLoading(false);
        }
        
        setIsEditing(!isEditing);
    }
    
    // Client Status Card
    const [clientStatus, setClientStatus] = useState(initialClient.status)
    
    const handleUpdateStatus = async (newStatus: ClientStatus) => {
        const isArchiving = newStatus === 'Archived';
        
        // 1. Call your custom alert
        const isConfirmed = await showAlert({
            title: isArchiving ? "Archive Client" : "Reactivate Client",
            message: isArchiving 
            ? "Are you sure you want to archive this client? This will restrict their portal access." 
            : "Are you sure you want to request to reactivate this client?",
            confirmText: isArchiving ? "Archive" : "Reactivate",
            cancelText: "Cancel",
            icon: "warning" // Uses your yellow TriangleAlert
        });
        
        // 2. Escape hatch
        if (!isConfirmed) return;
        
        setIsLoading(true);
        
        // 3. Update database
        const updatedClient = await updateClient(initialClient.id, { 
            status: newStatus
        });
        
        if (updatedClient) {
            setClientStatus(newStatus);
            
            showAlert({
                title: "Success",
                message: `Client successfully ${isArchiving ? 'archived' : 'reactivated'}.`,
                confirmText: "Close",
                icon: "success"
            });
        } else {
            showAlert({
                title: "Error",
                message: `Failed to update status`,
                confirmText: "Close",
                icon: "wrong"
            });
        }
        
        setIsLoading(false);
    }
    
    const handleDeleteClient = async () => {
        const isConfirmed = await showAlert({
            title: "Delete Client",
            message: "Are you absolutely sure you want to permanently delete this client? This cannot be undone.",
            confirmText: "Delete Client",
            cancelText: "Cancel",
            icon: "wrong",
            destructive: true,
            expectedInput: "DELETE", // This turns on the input requirement
            inputPlaceholder: "Type DELETE"
        });
        
        if (!isConfirmed) return;
        
        setIsLoading(true);
        
        const result = await deleteClient(initialClient.id);
        
        if (result && result.success) {
            redirect('/clients');
        } else {
            showAlert({
                title: "Error",
                message: `Failed to delete client`,
                confirmText: "Close",
                icon: "wrong"
            });
            setIsLoading(false);
        }
    }
    
    // Client Notes Card
    const [notes, setNotes] = useState(initialClient.internal_notes)

    const handleSaveClientNotes = async () => {
        setIsLoading(true);
        
        // Pass the ID, and just the specific field you want to update
        const updatedClient = await updateClient(initialClient.id, { 
            internal_notes: notes
        });
        
        if (updatedClient) {
           showAlert({
                title: "Success",
                message: `Notes on the client were updated successfully.`,
                confirmText: "Close",
                icon: "success"
            });
        } else {
            // Show an error alert
            showAlert({
                title: "Error",
                message: `Notes on the client could not be updated successfully.`,
                confirmText: "Close",
                icon: "wrong"
            });
        }
        
        setIsLoading(false);
    }
    
    // Client Activity Log
    const [activityLogs, setActivityLogs] = useState<NotificationItemData[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            const supabase = createClient();
            try {
                const data = await getClientActivity(supabase, initialClient.id);
                setActivityLogs(data);
            } catch (error) {
                console.error("Error fetching activity:", error);
            }
        };

        fetchActivity();
    }, [initialClient.id]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <ButtonLink href="/clients" variant="ghost">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Clients
                    </ButtonLink>
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
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm font-medium">Client Details</div>
                            
                            <div className="flex gap-2">
                                {/* The Toggle / Cancel Button */}
                                <Button 
                                    variant="ghost" 
                                    className="h-8 text-sm px-3" 
                                    onClick={() => setIsEditing(!isEditing)}
                                    disabled={isLoading}
                                >
                                    {isEditing ? 'Cancel' : <><Edit2 className="h-4 w-4 mr-2" /> Edit Info</>}
                                </Button>

                                {/* The Actual Save Button (Only shows when editing) */}
                                {isEditing && (
                                    <Button 
                                        variant="primary" 
                                        className="h-8 text-sm px-3" 
                                        onClick={handleSaveClientInfo}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                           {/* Define the fields once */}
                            {[
                                { label: "Primary Contact", icon: PersonStanding, state: contactName, setState: setContactName, original: initialClient.contact_name, showIconInView: false },
                                { label: "Email Address", icon: Mail, state: email, setState: setEmail, original: initialClient.email, showIconInView: true },
                                { label: "Phone Number", icon: Phone, state: phone, setState: setPhone, original: initialClient.phone, showIconInView: true },
                                { label: "Address", icon: MapPin, state: address, setState: setAddress, original: initialClient.address, showIconInView: true }
                            ].map((field, idx) => (
                                <div key={idx}>
                                    {isEditing ? (
                                        <Input
                                            type="text"
                                            value={field.state}
                                            onChange={(e) => field.setState(e.target.value)}
                                            icon={<field.icon className="h-4 w-4" />}
                                            className="w-full"
                                            placeholder={field.label}
                                        />
                                    ) : (
                                        <>
                                            <div className="text-sm font-medium text-zinc-500 mb-1">{field.label}</div>
                                            <div className={`text-zinc-900 ${field.showIconInView ? 'flex items-center gap-2' : 'font-medium'}`}>
                                                {field.showIconInView && <field.icon className="h-4 w-4 text-zinc-400" />}
                                                {field.original || <span className="text-zinc-400 italic font-normal">Not provided</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
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
                            <Button className="h-8 text-sm px-3 text-brand-primary" variant="ghost" onClick={handleSaveClientNotes}>Save</Button>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN (Sidebar) */}
                <div className="space-y-6">
                    
                    {/* 4. Financial Snapshot */}
                    <div className="flex flex-col gap-4">
                        <Card className="p-5 sm:p-5">
                            <div className="text-sm font-medium text-zinc-500 mb-1">Total Billed</div>
                            <div className="text-xl font-bold text-zinc-900">{formatFinancials(initialClient.total_billed, initialClient.currency)}</div>
                        </Card>
                        
                        <Card className="p-5 sm:p-5 border-brand-primary/20 bg-brand-primary/5">
                            <div className="text-sm font-medium text-brand-primary mb-1">Outstanding</div>
                            <div className="text-xl font-bold text-brand-primary">{formatFinancials(initialClient.outstanding_balance, initialClient.currency)}</div>
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
                                    onClick={() => handleUpdateStatus('Pending')}
                                    disabled={clientStatus.toLowerCase() == 'active'}
                                >
                                    <Send /> Send Request To Reactivate
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="w-full text-xs"
                                    onClick={() => handleUpdateStatus('Archived')}
                                >
                                    <ArchiveIcon /> Archive
                                </Button>
                            </div>

                            {/* Danger Zone */}
                            <div className="pt-4 mt-2 border-t border-zinc-100">
                                <Button 
                                    className="w-full h-9 flex justify-center items-center gap-2 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none disabled:opacity-50"
                                    onClick={handleDeleteClient}
                                    disabled={isLoading}
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
                            <div className="space-y-3">
                                {activityLogs.length > 0 ? (
                                    activityLogs.map((log) => (
                                        <NotificationItem 
                                            key={log.id} 
                                            notif={log} 
                                            isActivityLog={true} 
                                        />
                                    ))
                                ) : (
                                    <div className="text-sm text-zinc-500 italic p-4 text-center border rounded-lg bg-zinc-50/50">
                                        No recent activity for this client.
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}