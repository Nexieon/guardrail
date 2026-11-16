'use client'

import { useState } from "react"
import { Search, Plus, Grid, List, ArrowDownUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/pageheader"
import { StatCard } from "@/components/ui/statcard"
import StatusBadge from "@/components/ui/statusbadge"

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

export interface ProjectFixture {
  id: string
  name: string
  client_name: string
  client_initials?: string
  budget?: number
  status: 'in progress' | 'planning' | 'on hold' | 'completed'
  next_task?: string
  progress: number
  due_date: string
  deliverables?: number
  in_review?: number
  updated_at?: string
  needs_attention?: boolean
}

interface ProjectsUIProps {
  initialProjects: ProjectFixture[]
}

export default function ProjectsUI({ initialProjects }: ProjectsUIProps) {
  // Static enrichment to avoid SSR hydration mismatches
  const enrichedProjects: ExtendedProject[] = initialProjects.map((p, index) => ({
    ...p,
    deliverables_count: p.deliverables || (index + 2),
    in_review_count: p.status === 'in progress' ? 2 : 0,
    unbilled_amount: p.status === 'planning' ? 2400 : 0,
    last_updated: p.updated_at || '2h ago',
    is_overdue: p.status === 'on hold'
  }))

  const [projects] = useState<ExtendedProject[]>(enrichedProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const activeCount = projects.filter(p => p.status === 'in progress').length
  const dueThisWeek = 2
  const awaitingReview = projects.reduce((acc, p) => acc + (p.in_review_count || 0), 0)
  const totalUnbilled = projects.reduce((acc, p) => acc + (p.unbilled_amount || 0), 0)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = !searchQuery || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || project.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const groupedProjects = filteredProjects.reduce((groups, project) => {
    const client = project.client_name || 'Unassigned'
    if (!groups[client]) groups[client] = []
    groups[client].push(project)
    return groups
  }, {} as Record<string, ExtendedProject[]>)

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        subtitle="Manage active work, track progress, and review deliverables."
        action={
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
        }
      />

      {/* Summary Strip using StatCard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={activeCount} />
        <StatCard label="Due This Week" value={dueThisWeek} />
        <StatCard label="Awaiting Review" value={awaitingReview} />
        <StatCard label="Unbilled" value={`$${(totalUnbilled / 1000).toFixed(1)}k`} />
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-100 pb-4">
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
          <div className="w-48">
            <Input
              type="text"
              placeholder="Search..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 py-1"
            />
          </div>
          <div className="flex items-center bg-white border border-brand-divider rounded-lg p-1">
            <Button variant="ghost" className="p-1 h-7 w-7 text-zinc-900 bg-zinc-100">
              <Grid className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" className="p-1 h-7 w-7 text-zinc-400 hover:text-zinc-900">
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button variant="ghost" className="flex items-center gap-1.5 text-xs text-zinc-600">
            <ArrowDownUp className="h-3 w-3" />
            <span>Due date</span>
          </Button>
        </div>
      </div>

      {/* Client Groups & Project Cards */}
      <div className="space-y-10">
        {Object.entries(groupedProjects).map(([clientName, clientProjects]) => {
          const initials = clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          const groupBudget = clientProjects.reduce((acc, p) => acc + (p.unbilled_amount || 0), 0)

          return (
            <div key={clientName} className="space-y-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {clientProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                
                {/* Add Project Card */}
                <button
                  type="button"
                  className="flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed border-zinc-200 bg-white/50 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-white transition-all cursor-pointer group"
                >
                  <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform text-brand-primary" />
                  <span className="font-semibold text-sm">Add project</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: ExtendedProject }) {
  const isAttentionNeeded = project.is_overdue || project.status === 'on hold'

  return (
    <Card className={`relative flex flex-col p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group ${
      isAttentionNeeded ? 'border-amber-300 bg-amber-50/10' : 'border-brand-divider'
    }`}>
      <div className="flex justify-between items-start mb-2 gap-4">
        <h3 className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors text-base">
          {project.name}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-xs text-zinc-500 mb-4">
        {project.next_task || 'No active task pending'}
      </p>

      {/* Progress Bar */}
      <div className="mt-auto pt-4 border-t border-zinc-100">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5 font-medium">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-primary rounded-full transition-all duration-500" 
            style={{ width: `${project.progress}%` }} 
          />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-1">
          <span>{project.deliverables_count} deliverables</span>
          <span>Due {project.due_date}</span>
        </div>
      </div>
    </Card>
  )
}
