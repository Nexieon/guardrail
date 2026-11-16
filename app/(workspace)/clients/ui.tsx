'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/pageheader"
import { SortHeader } from "@/components/ui/sortheader"
import { EmptyState } from "@/components/ui/emptystate"
import ClientRow from "@/components/workspace/clientrow"
import NewClientForm from "@/components/modals/newClientForm"
import { useAlert } from "@/components/util/alertprovider"
import { useModal } from "@/components/util/modalprovider"
import { Client } from "@/lib/clients/client-data"

interface Props {
  initialClients: Client[]
}

export default function ClientsTableUI({ initialClients }: Props) {
  const [clients] = useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const { showModal, closeModal } = useModal()
  const { showAlert } = useAlert()
  const router = useRouter()

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedClients = clients
    .filter((client) => {
      if (!searchQuery) return true 
      const lower = searchQuery.toLowerCase()
      return (
        client.company_name.toLowerCase().includes(lower) ||
        client.contact_name.toLowerCase().includes(lower) ||
        client.email.toLowerCase().includes(lower)
      )
    })
    .sort((a, b) => {
      if (!sortKey) return 0
      
      let aVal = a[sortKey as keyof typeof a]
      let bVal = b[sortKey as keyof typeof b]

      if (aVal === null || aVal === undefined) aVal = ''
      if (bVal === null || bVal === undefined) bVal = ''

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const openAddClientModal = () => {
    showModal(
      "Add New Client",
      <NewClientForm
        onCancel={closeModal}
        onSuccess={async (clientId) => {
          closeModal()
          const confirmed = await showAlert({
            title: "Perfect!",
            message: "Successfully added the new client profile.",
            confirmText: "Visit Profile",
            cancelText: "Stay Here",
            icon: "success",
          })
          if (confirmed) {
            router.push(`/client/${clientId}`)
          }
        }}
      />
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Standardized PageHeader */}
      <PageHeader
        title="Clients"
        subtitle="Manage your client directory and client portal access."
        action={
          <Button variant="primary" className="flex items-center gap-2" onClick={openAddClientModal}>
            <Plus className="h-4 w-4" />
            <span>Add Client</span>
          </Button>
        }
      />

      {/* Table Card */}
      <Card className="overflow-hidden p-0">
        {/* Table Search Toolbar */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="w-full max-w-sm">
            <Input
              id="client-search-input"
              type="text"
              placeholder="Search clients..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/70 border-b border-zinc-100">
                <th className="px-6 py-4">
                  <SortHeader label="Client" onClick={() => handleSort('company_name')} />
                </th>
                <th className="px-6 py-4">
                  <SortHeader label="Contact" onClick={() => handleSort('contact_name')} />
                </th>
                <th className="px-6 py-4">
                  <SortHeader label="Status" onClick={() => handleSort('status')} />
                </th>
                <th className="px-6 py-4">
                  <SortHeader label="Active Projects" align="center" onClick={() => handleSort('total_billed')} />
                </th>
                <th className="px-6 py-4">
                  <SortHeader label="Last Login" onClick={() => handleSort('last_login_at')} />
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredAndSortedClients.map((client) => (
                <ClientRow key={client.id} client={client} />
              ))}
              
              {filteredAndSortedClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      title="No clients found"
                      description={searchQuery ? `We couldn't find anyone matching "${searchQuery}"` : "Get started by adding your first client."}
                      action={
                        <Button variant="primary" onClick={openAddClientModal} className="mt-2">
                          <Plus className="h-4 w-4 mr-1" /> Add Client
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
