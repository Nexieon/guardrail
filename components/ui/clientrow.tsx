import { Archive, CreditCard, ExternalLink, Eye, LinkIcon, Mail, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button, ButtonLink } from "./button";
import { Modal } from "../modal";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAlert } from "../util/alertprovider";
import StatusBadge from "./statusbadge";
import { Client, ClientStatus } from "@/lib/clients/client-data";
import { useModal } from "../util/modalprovider";
import ClientActionsMenu from "../modals/clientActionsMenu";
import { updateClient } from "@/lib/clients/actions";

interface ClientRowProps {
    client: Client;
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

export default function ClientRow({client} :ClientRowProps) {
    const { showAlert } = useAlert(); // Initialize the custom alert
    const { showModal, closeModal } = useModal();
    const [clientStatus, setClientStatus] = useState(client.status);

    const [isLoading, setIsLoading] = useState(false);

    const copyClientDashLink = async () => {
        const link = `https://app.guardrail.com/c/${client.id}`;
        await navigator.clipboard.writeText(link);
        
        // Show the success modal
        showAlert({
            title: "Link Copied!",
            message: `The secure portal link for ${client.company_name} has been copied to your clipboard. You can now paste it into an email or text message.`,
            confirmText: "Got it",
            icon: 'success'
        });
    }

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
        const updatedClient = await updateClient(client.id, { 
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

    return (
        <>
        <tr className="hover:bg-zinc-50/50 transition-colors group">
            
            {/* Company Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-sm shrink-0">
                        {client.company_name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-zinc-900">{client.company_name}</div>
                    </div>
                </div>
            </td>

            {/* Contact Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-900 font-medium">{client.contact_name}</div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3 text-brand-primary" /> {client.email}
                </div>
            </td>

            {/* Status Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={clientStatus} />
            </td>

            {/* Projects Column */}
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-sm font-medium text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
                    {/** TODO: client.projects */} 1
                </span>
            </td>

            {/* Last Login Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                {formatTimeAgo(client.last_login_at)}
            </td>

            {/* Actions Column */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TooltipProvider>
                    <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ButtonLink variant="icon" className="h-10 w-10 p-0" href={`/client/${client.id}`}>
                                    <Eye/>
                                </ButtonLink>
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 text-white text-xs rounded-md px-3 py-1.5">
                                <p>View internal client profile</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="icon" className="h-10 w-10 p-0" onClick={() => copyClientDashLink()}>
                                    <LinkIcon/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 text-white text-xs rounded-md px-3 py-1.5">
                                <p>Copy Client Dashboard to send to your client to view your work together</p>
                            </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="icon" className="h-10 w-10 p-0" onClick={()=> showModal(
                                    `More options for ${client.company_name}`,
                                    <ClientActionsMenu
                                        closeMenu={closeModal}
                                        handleUpdateStatus={handleUpdateStatus}
                                    />
                                )}>
                                    <MoreHorizontal/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 text-white text-xs rounded-md px-3 py-1.5">
                                <p>See More Options</p>
                            </TooltipContent>
                        </Tooltip>
                        
                        
                    </div>
                </TooltipProvider>
            </td>
        </tr>
        </>
    )
}