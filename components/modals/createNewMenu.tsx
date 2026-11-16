'use client'

import { FolderKanban, Users, UploadCloud, BookTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NewClientForm from './newClientForm'
import { useAlert } from '../util/alertprovider'
import { useModal } from '../util/modalprovider'
import { useRouter } from 'next/navigation'

interface CreateNewMenuProps {
  closeMenu: () => void
}

export default function CreateNewMenu({ closeMenu }: CreateNewMenuProps) {
  const { showModal, closeModal } = useModal()
  const { showAlert } = useAlert()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">
      {/* New Project */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
        }}
        className="h-auto p-4 justify-start items-center group transition-all"
      >
        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <FolderKanban className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-zinc-900 transition-colors">New Project</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Start a new job and assign it to a client.</div>
        </div>
      </Button>

      {/* Add Client */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
          showModal(
            "Add New Client",
            <NewClientForm
              onCancel={closeModal}
              onSuccess={async (clientId) => {
                closeModal()
                const confirmed = await showAlert({
                  title: "Perfect!",
                  message: "Successfully added the new client",
                  confirmText: "Visit Profile",
                  cancelText: "Close",
                  icon: "success",
                })
                if (confirmed) {
                  router.push(`/client/${clientId}`)
                }
              }}
            />
          )
        }}
        className="h-auto p-4 justify-start items-center group transition-all"
      >
        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <Users className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-zinc-900 transition-colors">Add Client</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Create a new client profile.</div>
        </div>
      </Button>

      {/* Upload Deliverable */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
        }}
        className="h-auto p-4 justify-start items-center group transition-all"
      >
        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-zinc-900 transition-colors">Upload Deliverable</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Quickly drop a file into an existing project.</div>
        </div>
      </Button>

      {/* New Template */}
      <Button
        variant="ghost"
        onClick={() => {
          closeMenu()
        }}
        className="h-auto p-4 justify-start items-center group transition-all"
      >
        <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
          <BookTemplate className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-zinc-900 transition-colors">New Template</div>
          <div className="text-xs text-zinc-500 font-normal mt-0.5">Save reusable sets of deliverables and tasks.</div>
        </div>
      </Button>
    </div>
  )
}
