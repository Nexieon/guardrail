'use client'

import { Mail, CreditCard, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientStatus } from '@/lib/clients/client-data';

interface ClientActionsMenuProps {
  closeMenu: () => void;
  handleUpdateStatus: (newStatus: ClientStatus) => Promise<void>;
  // clientId?: string; // You will likely need to pass the specific client ID here later to trigger the actual API calls
}

export default function ClientActionsMenu({ closeMenu, handleUpdateStatus }: ClientActionsMenuProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Email Portal Link */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
          // TODO: Trigger email API
        }}
        className="h-auto p-4 justify-start items-center group transition-all"
      >
        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <Mail className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-zinc-900 transition-colors">Email Portal Link</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Send an automated email to your client containing the link to their easy passwordless dashboard.</div>
        </div>
      </Button>

      {/* Send Invoice */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
          // TODO: Open Send Invoice Modal
        }}
        className="h-auto p-4 justify-start items-center group transition-all"
      >
        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <CreditCard className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-zinc-900 transition-colors">Send Invoice</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Prepare and send an invoice to your client.</div>
        </div>
      </Button>

      {/* Archive Client */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
          handleUpdateStatus("Archived");
        }}
        className="h-auto p-4 justify-start items-center group transition-all hover:bg-red-50"
      >
        <div className="h-10 w-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <Archive className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-red-600 transition-colors">Archive Client</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Hides the client (Only removes them from list and blocks them, to fully delete, go into ...)</div>
        </div>
      </Button>
    </div>
  )
}