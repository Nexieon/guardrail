'use client'

import { ExternalLink, LinkIcon, MoreHorizontal } from "lucide-react"
import { Button, ButtonLink } from "../ui/button"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAlert } from "../util/alertprovider"
import StatusBadge from "../ui/statusbadge"
import { Client, ClientStatus } from "@/lib/clients/client-data"
import { useModal } from "../util/modalprovider"
import ClientActionsMenu from "../modals/clientActionsMenu"
import { updateClient } from "@/lib/clients/actions"

interface ClientRowProps {
  client: Client
}

function formatTimeAgo(dateString: string | null) {
  if (!dateString) return 'Never'

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 172800) return 'Yesterday'
  
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export default function ClientRow({ client }: ClientRowProps) {
  const { showAlert } = useAlert()
  const { showModal, closeModal } = useModal()
  const [clientStatus, setClientStatus] = useState(client.status)

  const copyClientDashLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${origin}/c/${client.id}`
    await navigator.clipboard.writeText(link)
    
    showAlert({
      title: "Link Copied!",
      message: `The portal link for ${client.company_name} has been copied to your clipboard.`,
      confirmText: "Got it",
      icon: 'success'
    })
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
    
    const updatedClient = await updateClient(client.id, { status: newStatus })
    
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
        message: `Failed to update status.`,
        confirmText: "Close",
        icon: "wrong"
      })
    }
  }

  return (
    <tr className="hover:bg-zinc-50/80 transition-colors group">
      {/* Client Name & Quick View */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-zinc-900">{client.company_name}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ButtonLink 
                  href={`/client/${client.id}`} 
                  variant="ghost" 
                  className="p-1 h-auto text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </ButtonLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Client Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>

      {/* Primary Contact */}
      <td className="px-6 py-4">
        <div className="text-zinc-900">{client.contact_name}</div>
        <div className="text-xs text-zinc-500">{client.email}</div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={clientStatus} />
      </td>

      {/* Active Projects Placeholder */}
      <td className="px-6 py-4 text-center">
        <span className="text-zinc-600 font-medium">0</span>
      </td>

      {/* Last Login */}
      <td className="px-6 py-4 text-zinc-500 text-sm">
        {formatTimeAgo(client.last_login_at)}
      </td>

      {/* Quick Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="icon" 
                  onClick={copyClientDashLink}
                  className="p-1.5 h-auto"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Portal Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            variant="icon" 
            onClick={() => {
              showModal(
                `Manage ${client.company_name}`,
                <ClientActionsMenu 
                  closeMenu={closeModal} 
                  handleUpdateStatus={handleUpdateStatus} 
                />
              )
            }}
            className="p-1.5 h-auto"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
