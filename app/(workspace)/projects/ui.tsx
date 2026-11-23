'use client'

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, FolderKanban, ChevronDown, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/pageheader"
import { StatCard } from "@/components/ui/statcard"
import { EmptyState } from "@/components/ui/emptystate"
import { Money } from "@/components/ui/money"
import StatusBadge from "@/components/ui/statusbadge"
import NewProjectForm from "@/components/modals/newProjectForm"
import NewClientForm from "@/components/modals/newClientForm"
import { useModal } from "@/components/util/modalprovider"
import { useAlert } from "@/components/util/alertprovider"
import { ProjectWithClient, ProjectStatus } from "@/lib/projects/types"
import { updateProjectStatus } from "@/lib/projects/actions"
import { Client } from "@/lib/clients/client-data"

interface ProjectsUIProps {
  initialProjects: ProjectWithClient[]
  availableClients: Client[]
}

const ALL_STATUSES: ProjectStatus[] = ['planning', 'in progress', 'on hold', 'completed']

export default function ProjectsUI({ initialProjects, availableClients }: ProjectsUIProps) {
  const router = useRouter()
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ProjectStatus>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const { showModal, closeModal } = useModal()
  const { showAlert } = useAlert()

  // Derive projects combining server data with local optimistic status overrides
  const projects = initialProjects.map((p) =>
    statusOverrides[p.id] ? { ...p, status: statusOverrides[p.id] } : p
  )

  // --- Dynamic Stats calculation ---
  const activeCount = projects.filter(p => p.status === 'in progress').length
  const planningCount = projects.filter(p => p.status === 'planning').length
  const onHoldCount = projects.filter(p => p.status === 'on hold').length
  const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0)

  // --- Search & Status Filtering ---
  const filteredProjects = projects.filter((project) => {
    const clientName = project.client?.company_name || ''
    const matchesSearch = !searchQuery || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || 
      project.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  // --- Group projects by Client Name ---
  const groupedProjects = filteredProjects.reduce((groups, project) => {
    const clientName = project.client?.company_name || 'Unassigned Clients'
    if (!groups[clientName]) groups[clientName] = []
    groups[clientName].push(project)
    return groups
  }, {} as Record<string, ProjectWithClient[]>)

  // --- Handle Status Change with Optimistic UI ---
  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    // Optimistic status update
    setStatusOverrides(prev => ({ ...prev, [projectId]: newStatus }))

    const res = await updateProjectStatus(projectId, newStatus)
    if (!res.success) {
      // Revert if failed
      setStatusOverrides(prev => {
        const next = { ...prev }
        delete next[projectId]
        return next
      })
      showAlert({
        title: "Could Not Update Status",
        message: res.error || "Failed to update project status.",
        confirmText: "Ok",
        icon: "wrong",
      })
    } else if (res.notification && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('guardrail:notification', { detail: res.notification }))
    }
  }

  // --- Open Add Project Modal ---
  const openAddProjectModal = (preselectedClientId?: string) => {
    if (availableClients.length === 0) {
      showAlert({
        title: "No Clients Found",
        message: "You need at least one client profile before creating a project. Would you like to create one now?",
        confirmText: "Create Client",
        cancelText: "Cancel",
        icon: "info",
      }).then((confirmed) => {
        if (confirmed) {
          showModal(
            "Add New Client",
            <NewClientForm
              onCancel={closeModal}
              onSuccess={() => {
                closeModal()
                router.refresh()
              }}
            />
          )
        }
      })
      return
    }

    showModal(
      "Create New Project",
      <NewProjectForm
        availableClients={availableClients}
        preselectedClientId={preselectedClientId}
        onCancel={closeModal}
        onSuccess={() => {
          closeModal()
          router.refresh()
        }}
      />
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        subtitle="Manage active work, track progress, and review deliverables."
        action={
          <Button 
            variant="primary" 
            className="flex items-center gap-2" 
            onClick={() => openAddProjectModal()}
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
        }
      />

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={activeCount} subtitle="Currently in progress" />
        <StatCard label="Planning" value={planningCount} subtitle="Scope & brief setup" />
        <StatCard label="On Hold" value={onHoldCount} subtitle="Awaiting client input" />
        <StatCard 
          label="Pipeline Value" 
          value={`$${(totalBudget / 1000).toFixed(1)}k`} 
          subtitle="Total project budgets" 
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-brand-divider pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['All', 'In progress', 'Planning', 'On hold', 'Completed'].map(filter => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'primary' : 'ghost'}
              onClick={() => setStatusFilter(filter)}
              className="text-xs px-3.5 py-1.5 rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="w-56">
            <Input
              type="text"
              placeholder="Search projects or clients..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 py-1 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Empty State when 0 projects exist */}
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-8 w-8 mb-3 text-zinc-300" />}
          title="No projects created yet"
          description="Projects organize your deliverables, progress tracking, and client approvals. Add your first project to get started."
          action={
            <Button 
              variant="primary" 
              className="flex items-center gap-2" 
              onClick={() => openAddProjectModal()}
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Project</span>
            </Button>
          }
        />
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-brand-divider text-zinc-500">
          <p className="font-semibold text-sm">No projects matched your search criteria.</p>
          <Button 
            variant="ghost" 
            className="mt-3 text-xs" 
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        /* Client Groups & Project Cards */
        <div className="space-y-10">
          {Object.entries(groupedProjects).map(([clientName, clientProjects]) => {
            const initials = clientName
              .split(' ')
              .map(n => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'CL'
            
            const groupBudget = clientProjects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0)
            const targetClientId = clientProjects[0]?.client_id

            return (
              <div key={clientName} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 flex items-baseline gap-2">
                    {clientName}
                    <span className="text-sm font-normal text-zinc-500">
                      {clientProjects.length} {clientProjects.length === 1 ? 'project' : 'projects'} 
                      {groupBudget > 0 && ` • $${(groupBudget/1000).toFixed(1)}k budget`}
                    </span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {clientProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onStatusChange={handleStatusChange} 
                    />
                  ))}
                  
                  {/* Add Project Card for this specific client */}
                  <button
                    type="button"
                    onClick={() => openAddProjectModal(targetClientId)}
                    className="flex flex-col items-center justify-center min-h-[190px] rounded-xl border-2 border-dashed border-zinc-200 bg-white/40 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-white transition-all cursor-pointer group"
                  >
                    <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform text-brand-primary" />
                    <span className="font-semibold text-sm">Add project</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ 
  project, 
  onStatusChange 
}: { 
  project: ProjectWithClient
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const isAttentionNeeded = project.status === 'on hold'

  const handleSelectStatus = (status: ProjectStatus) => {
    setIsMenuOpen(false)
    startTransition(() => {
      onStatusChange(project.id, status)
    })
  }

  return (
    <Card className={`relative flex flex-col p-5 hover:shadow-md transition-all group ${
      isAttentionNeeded ? 'border-amber-300 bg-amber-50/10' : 'border-brand-divider'
    } ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Title & Interactive Status Selector */}
      <div className="flex justify-between items-start mb-2 gap-4">
        <Link 
          href={`/project/${project.id}`}
          className="font-bold text-zinc-900 hover:text-brand-primary transition-colors text-base line-clamp-1 flex-1"
        >
          {project.name}
        </Link>

        {/* Status Dropdown Pill */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1 rounded-full text-xs font-semibold focus:outline-none cursor-pointer"
            title="Click to update status"
          >
            <StatusBadge status={project.status} />
            <ChevronDown className="h-3 w-3 text-zinc-400 -ml-0.5" />
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-zinc-400 px-3 py-1 uppercase tracking-wider">
                  Change Status
                </div>
                {ALL_STATUSES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSelectStatus(s)}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center justify-between capitalize cursor-pointer"
                  >
                    <span>{s}</span>
                    {project.status === s && <Check className="h-3.5 w-3.5 text-brand-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Next Task or Description */}
      <p className="text-xs text-zinc-500 mb-4 line-clamp-2">
        {project.next_task || project.description || 'No active task pending'}
      </p>

      {/* Progress & Financials */}
      <div className="mt-auto pt-4 border-t border-zinc-100">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5 font-medium">
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-primary rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }} 
          />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-1">
          <span className="font-semibold text-zinc-700">
            <Money amount={Number(project.budget) || 0} currency={project.currency || 'CAD'} />
          </span>
          <span>
            {project.due_date ? `Due ${new Date(project.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : 'No deadline'}
          </span>
        </div>
      </div>
    </Card>
  )
}
