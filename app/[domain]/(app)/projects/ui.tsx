'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Grid, List, ArrowDownUp, Calendar, FileText, Clock, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAlert } from "@/components/util/alertprovider"
import { useModal } from "@/components/util/modalprovider"

// Expanded type to match the new UI requirements based on the reference design
interface ExtendedProject {
    id: string
    name: string
    client_name: string
    status: 'in progress' | 'planning' | 'on hold' | 'completed'
    due_date: string
    progress: number
    next_task?: string
    deliverables_count?: number
    in_review_count?: number
    unbilled_amount?: number
    last_updated?: string
    is_overdue?: boolean
}

export default function ProjectsUI({ initialProjects }: { initialProjects: ExtendedProject[] }) {
    // For demonstration, mapping some extra mock data to match the rich UI reference
    const enrichedProjects = initialProjects.map(p => ({
        ...p,
        next_task: p.status === 'in progress' ? 'Homepage mockups' : p.status === 'planning' ? 'Brief sign-off' : 'Waiting on client feedback',
        deliverables_count: Math.floor(Math.random() * 5) + 1,
        in_review_count: p.status === 'in progress' ? 2 : 0,
        unbilled_amount: p.status === 'planning' ? 2400 : 0,
        last_updated: '2h ago',
        is_overdue: p.status === 'on hold' // Just forcing an attention state for the demo
    }))

    const [projects, setProjects] = useState<ExtendedProject[]>(enrichedProjects)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('All')
    
    const { showModal, closeModal } = useModal()
    const { showAlert } = useAlert()

    // Page-level stats calculation
    const activeCount = projects.filter(p => p.status === 'in progress').length
    const dueThisWeek = 2 // Mocked for UI
    const awaitingReview = projects.reduce((acc, p) => acc + (p.in_review_count || 0), 0)
    const totalUnbilled = projects.reduce((acc, p) => acc + (p.unbilled_amount || 0), 0)

    // Filter projects
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = !searchQuery || 
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesStatus = statusFilter === 'All' || project.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    // Group by client
    const groupedProjects = filteredProjects.reduce((groups, project) => {
        const client = project.client_name || 'Unassigned'
        if (!groups[client]) groups[client] = []
        groups[client].push(project)
        return groups
    }, {} as Record<string, ExtendedProject[]>)

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Projects</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage active work, track progress, and upload deliverables.</p>
                </div>
                <Button variant="primary" className="flex items-center gap-2 bg-brand-primary text-white hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" /> Add Project
                </Button>
            </div>

            {/* Summary Strip[cite: 7] */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active', value: activeCount },
                    { label: 'Due this week', value: dueThisWeek },
                    { label: 'Awaiting review', value: awaitingReview },
                    { label: 'Unbilled', value: `$${(totalUnbilled / 1000).toFixed(1)}k` }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                        <div className="text-2xl font-bold text-zinc-900 mt-1">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter & View Controls[cite: 7] */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                    {['All', 'In progress', 'Planning', 'On hold', 'Completed'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                statusFilter === filter 
                                ? 'bg-zinc-900 text-white' 
                                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="w-48">
                        <Input
                            type="text"
                            placeholder="Search..."
                            icon={<Search className="h-4 w-4" />}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white h-9"
                        />
                    </div>
                    <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
                        <button className="p-1.5 bg-zinc-100 rounded text-zinc-900"><Grid className="h-4 w-4" /></button>
                        <button className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"><List className="h-4 w-4" /></button>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900">
                        <ArrowDownUp className="h-3 w-3" /> Due date
                    </button>
                </div>
            </div>

            {/* Client Groups & Project Cards[cite: 7] */}
            <div className="space-y-10">
                {Object.entries(groupedProjects).map(([clientName, clientProjects]) => {
                    const initials = clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    const groupBudget = clientProjects.reduce((acc, p) => acc + (p.unbilled_amount || 0), 0)

                    return (
                        <div key={clientName} className="space-y-4">
                            {/* Richer Client Header[cite: 7] */}
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                    {initials}
                                </div>
                                <h2 className="text-lg font-bold text-zinc-900 flex items-baseline gap-2">
                                    {clientName}
                                    <span className="text-sm font-normal text-zinc-500">
                                        {clientProjects.length} projects {groupBudget > 0 && `• $${(groupBudget/1000).toFixed(1)}k budget`}
                                    </span>
                                </h2>
                            </div>
                            
                            {/* Card Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {clientProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                                
                                {/* Add Project Ghost Card[cite: 7] */}
                                <button className="flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 transition-all group">
                                    <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-sm">Add project</span>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Project Card Component extracted for cleanliness
function ProjectCard({ project }: { project: ExtendedProject }) {
    // Attention state logic[cite: 7]
    const isAttentionNeeded = project.is_overdue || project.status === 'on hold'
    
    // Status pill colors
    const getStatusStyles = (status: string) => {
        switch(status) {
            case 'in progress': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'planning': return 'bg-zinc-100 text-zinc-700 border-zinc-200'
            case 'on hold': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            default: return 'bg-zinc-100 text-zinc-700 border-zinc-200'
        }
    }

    return (
        // Subtle hover lift and attention borders[cite: 7]
        <div className={`relative flex flex-col bg-white rounded-xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group ${
            isAttentionNeeded ? 'border-red-300' : 'border-zinc-200'
        }`}>
            {/* Header row */}
            <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="font-bold text-zinc-900 leading-tight group-hover:text-brand-primary transition-colors">
                    {project.name}
                </h3>
                {/* Status pill[cite: 7] */}
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${getStatusStyles(project.status)}`}>
                    {project.status}
                </span>
            </div>

            {/* Next Task line[cite: 7] */}
            <p className="text-sm font-medium text-zinc-900 mb-4">
                <span className="text-zinc-500 font-normal">Next:</span> {project.next_task}
            </p>

            {/* Progress Bar using brand accent[cite: 7] */}
            <div className="mt-auto">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1.5">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-4">
                    <div 
                        className="h-full bg-brand-primary rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress}%` }} 
                    />
                </div>
            </div>

            {/* Metadata Row[cite: 7] */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-500 mb-4">
                <div className={`flex items-center gap-1.5 ${project.is_overdue ? 'text-red-600' : ''}`}>
                    {project.is_overdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                    Due {new Date(project.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {project.deliverables_count} {project.deliverables_count === 1 ? 'deliverable' : 'deliverables'}
                </div>
                {project.in_review_count !== undefined && project.in_review_count > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Clock className="h-3.5 w-3.5" />
                        {project.in_review_count} in review
                    </div>
                )}
                {project.unbilled_amount !== undefined && project.unbilled_amount > 0 && (
                    <div className="flex items-center gap-1.5">
                        ${(project.unbilled_amount / 1000).toFixed(1)}k to invoice
                    </div>
                )}
            </div>

            {/* Footer row: Avatars & Last Updated[cite: 7] */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 mt-auto">
                <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600">JD</div>
                    <div className="h-6 w-6 rounded-full bg-zinc-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600">SK</div>
                </div>
                
                {isAttentionNeeded ? (
                    <button className="text-xs font-semibold text-brand-primary hover:text-[#E04618] transition-colors">
                        Send reminder
                    </button>
                ) : (
                    <span className="text-xs text-zinc-400">
                        Updated {project.last_updated}
                    </span>
                )}
            </div>
        </div>
    )
}