'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ClientRow from "@/components/ui/clientrow";
import { Input } from "@/components/ui/input";
import { Client } from "@/lib/supabase/client-data";
import { Search, Plus, ArrowUpDown } from 'lucide-react'
import { useState } from "react";

interface Props {
    initialClients: Client[]
}

export default function ClientsTableUI({ initialClients }: Props) {
    // Load the real database values into the initial state
    const [clients, setClients] = useState<Client[]>(initialClients)

    const [searchQuery, setSearchQuery] = useState('')

    const [sortKey, setSortKey] = useState('')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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
            // If search is empty, keep everyone
            if (!searchQuery) return true 
            
            const lowerQuery = searchQuery.toLowerCase()

            // Searches based off company name, contact name, and email (using real DB column names)
            return (
                client.company_name.toLowerCase().includes(lowerQuery) ||
                client.contact_name.toLowerCase().includes(lowerQuery) ||
                client.email.toLowerCase().includes(lowerQuery)
            )
        })
        .sort((a, b) => {
            if (!sortKey) return 0
            
            let aValue = a[sortKey as keyof typeof a]
            let bValue = b[sortKey as keyof typeof b]

            if (aValue === null) aValue = ''
            if (bValue === null) bValue = ''

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
            return 0
        })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6 pb-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Clients</h1>
                        <p className="text-sm text-zinc-500 mt-1">Manage your client directory and portal access.</p>
                    </div>
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Client
                    </Button>
                </div>

                {/* Table Card */}
                <Card className="overflow-hidden">
                    {/* Table Toolbar / Search */}
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white">
                        <div className="w-full max-w-sm relative">
                            <Input
                                type="text"
                                placeholder="Search clients..."
                                icon={<Search className="h-4 w-4" />}
                                className="w-full"
                                id="client-search-input"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">
                                        {/* Updated to sort by company_name */}
                                        <button 
                                            onClick={() => handleSort('company_name')} 
                                            className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors uppercase font-semibold"
                                        >
                                            Client <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">
                                        {/* Updated to sort by contact_name */}
                                        <button 
                                            onClick={() => handleSort('contact_name')} 
                                            className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors uppercase font-semibold"
                                        >
                                            Contact <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">
                                        <button 
                                            onClick={() => handleSort('status')} 
                                            className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors uppercase font-semibold"
                                        >
                                            Status <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">
                                        {/* Assumes projects is calculated in your clients.ts handler, otherwise remove this sort key */}
                                        <button 
                                            onClick={() => handleSort('projects')} 
                                            className="flex items-center justify-center gap-1.5 hover:text-zinc-900 transition-colors uppercase font-semibold w-full text-center"
                                        >
                                            Active Projects <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">
                                        {/* Updated to sort by last_login_at */}
                                        <button 
                                            onClick={() => handleSort('last_login_at')} 
                                            className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors uppercase font-semibold"
                                        >
                                            Last Login <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {filteredAndSortedClients.map((client) => (
                                    <ClientRow key={client.id} client={client}></ClientRow>
                                ))}
                                {/** NO RESULTS */}
                                {filteredAndSortedClients.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-zinc-500">
                                                <Search className="h-8 w-8 mb-3 text-zinc-300" />
                                                <p className="text-sm font-medium text-zinc-900">No clients found</p>
                                                <p className="text-sm">We couldn't find anyone matching "{searchQuery}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}