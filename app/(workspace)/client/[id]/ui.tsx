'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit2,
  PersonStanding,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Trash2,
  ArchiveIcon
} from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Money } from "@/components/ui/money"
import StatusBadge from "@/components/ui/statusbadge"
import NotificationItem, { NotificationItemData } from "@/components/workspace/notification"
import { useAlert } from "@/components/util/alertprovider"
import { deleteClient, updateClient } from "@/lib/clients/actions"
import { Client, ClientStatus } from "@/lib/clients/client-data"
import { getClientActivity } from "@/lib/notifications"
import { createClient } from "@/lib/supabase/browser"

interface Props {
  initialClient: Client
}

const MOCK_PROJECTS = [
  { id: 101, name: "Q3 Corporate Tax Filing", status: "In Progress", date: "Aug 15, 2026" },
  { id: 102, name: "Annual Financial Audit", status: "Pending", date: "Sep 01, 2026" },
  { id: 103, name: "Payroll Setup", status: "Completed", date: "Jul 20, 2026" },
]

export default function ClientProfileClientUI({ initialClient }: Props) {
  const router = useRouter()
  const { showAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  
  // Client details editing state
  const [isEditing, setIsEditing] = useState(false)
  const [contactName, setContactName] = useState(initialClient.contact_name || '')
  const [email, setEmail] = useState(initialClient.email || '')
  const [phone, setPhone] = useState(initialClient.phone || '')
  const [address, setAddress] = useState(initialClient.address || '')
  const [clientStatus, setClientStatus] = useState<ClientStatus>(initialClient.status)
  const [notes, setNotes] = useState(initialClient.internal_notes || '')
  const [activityLogs, setActivityLogs] = useState<NotificationItemData[]>([])

  useEffect(() => {
    const fetchActivity = async () => {
      const supabase = createClient()
      try {
        const data = await getClientActivity(supabase, initialClient.id)
        setActivityLogs(data)
      } catch (error) {
        console.error("Error fetching activity:", error)
      }
    }

    fetchActivity()
  }, [initialClient.id])

  const handleSaveClientInfo = async () => {
    setIsLoading(true)
    const updatedClient = await updateClient(initialClient.id, { 
      contact_name: contactName,
      email,
      phone,
      address
    })
    
    if (updatedClient) {
      showAlert({
        title: "Success",
        message: "Client details were updated successfully.",
        confirmText: "Close",
        icon: "success"
      })
      setIsEditing(false)
    } else {
      showAlert({
        title: "Error",
        message: "Failed to save updated info.",
        confirmText: "Close",
        icon: "wrong"
      })
    }
    setIsLoading(false)
  }

  const handleUpdateStatus = async (newStatus: ClientStatus) => {
    const isArchiving = newStatus === 'Archived'
    
    const isConfirmed = await showAlert({
      title: isArchiving ? "Archive Client" : "Reactivate Client",
      message: isArchiving 
        ? "Are you sure you want to archive this client? This will restrict their portal access." 
        : "Are you sure you want to reactivate this client?",
      confirmText: isArchiving ? "Archive" : "Reactivate",
      cancelText: "Cancel",
      icon: "warning"
    })
    
    if (!isConfirmed) return
    setIsLoading(true)
    
    const updatedClient = await updateClient(initialClient.id, { status: newStatus })
    
    if (updatedClient) {
      setClientStatus(newStatus)
      showAlert({
        title: "Success",
        message: `Client successfully ${isArchiving ? 'archived' : 'reactivated'}.`,
        confirmText: "Close",
        icon: "success"
      })
    } else {
      showAlert({
        title: "Error",
        message: "Failed to update status.",
        confirmText: "Close",
        icon: "wrong"
      })
    }
    setIsLoading(false)
  }

  const handleDeleteClient = async () => {
    const isConfirmed = await showAlert({
      title: "Delete Client",
      message: "Are you absolutely sure you want to permanently delete this client? This cannot be undone.",
      confirmText: "Delete Client",
      cancelText: "Cancel",
      icon: "wrong",
      destructive: true,
      expectedInput: "DELETE",
      inputPlaceholder: "Type DELETE"
    })
    
    if (!isConfirmed) return
    setIsLoading(true)
    
    const result = await deleteClient(initialClient.id)
    
    if (result && result.success) {
      router.push('/clients')
    } else {
      showAlert({
        title: "Error",
        message: "Failed to delete client.",
        confirmText: "Close",
        icon: "wrong"
      })
      setIsLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsLoading(true)
    const updatedClient = await updateClient(initialClient.id, { internal_notes: notes })
    
    if (updatedClient) {
      showAlert({
        title: "Success",
        message: "Client notes saved.",
        confirmText: "Close",
        icon: "success"
      })
    } else {
      showAlert({
        title: "Error",
        message: "Could not save client notes.",
        confirmText: "Close",
        icon: "wrong"
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <ButtonLink href="/clients" variant="ghost" className="mb-2 px-0 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to Clients</span>
          </ButtonLink>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              {initialClient.company_name}
            </h1>
            <StatusBadge status={clientStatus} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => handleUpdateStatus(clientStatus === 'Archived' ? 'Active' : 'Archived')}>
            <ArchiveIcon className="h-4 w-4 mr-1.5" />
            <span>{clientStatus === 'Archived' ? 'Reactivate' : 'Archive'}</span>
          </Button>
          <Button variant="destructive" onClick={handleDeleteClient}>
            <Trash2 className="h-4 w-4 mr-1.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Client Info Card */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-zinc-900">Client Details</h2>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel' : <><Edit2 className="h-4 w-4 mr-1.5" /> Edit Info</>}
                </Button>

                {isEditing && (
                  <Button 
                    variant="primary" 
                    onClick={handleSaveClientInfo}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing ? (
                <>
                  <Input
                    label="Primary Contact"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    icon={<PersonStanding className="h-4 w-4" />}
                  />
                  <Input
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                  />
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </>
              ) : (
                <>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Primary Contact</div>
                    <div className="text-zinc-900 font-medium">{contactName || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Email Address</div>
                    <div className="text-zinc-900 font-medium flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-zinc-400" />
                      <span>{email || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Phone Number</div>
                    <div className="text-zinc-900 font-medium flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-zinc-400" />
                      <span>{phone || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Address</div>
                    <div className="text-zinc-900 font-medium flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      <span>{address || 'Not provided'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Projects Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-zinc-400" />
                Active Projects
              </h2>
              <ButtonLink variant="ghost" href={`/projects?client=${initialClient.id}`} className="text-brand-primary">
                View all
              </ButtonLink>
            </div>
            
            <div className="space-y-3">
              {MOCK_PROJECTS.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                  <div>
                    <div className="font-semibold text-zinc-900 text-sm">{project.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Due {project.date}</div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Internal Notes using Textarea primitive */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-3">
              <Edit2 className="h-4 w-4 text-zinc-400" />
              Internal Scratchpad
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private agency notes about this client..."
              rows={4}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-zinc-400">Clients cannot see internal notes.</span>
              <Button variant="primary" onClick={handleSaveNotes} disabled={isLoading}>
                Save Notes
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          {/* Financial Snapshot using Money primitive */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Billed</div>
              <div className="text-2xl font-bold text-zinc-900">
                <Money amount={initialClient.total_billed} currency={initialClient.currency} />
              </div>
            </Card>
            
            <Card className="p-5 border-brand-primary/30 bg-orange-50/20">
              <div className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">Outstanding Balance</div>
              <div className="text-2xl font-bold text-brand-primary">
                <Money amount={initialClient.outstanding_balance} currency={initialClient.currency} />
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-zinc-900 mb-4">Activity History</h2>
            <div className="space-y-3">
              {activityLogs.map(log => (
                <NotificationItem key={log.id} notif={log} isActivityLog />
              ))}
              {activityLogs.length === 0 && (
                <p className="text-sm text-zinc-400 text-center py-4">No recent activity recorded.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
