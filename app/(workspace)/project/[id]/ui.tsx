'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  FolderCheck, 
  Layers, 
  User, 
  ExternalLink,
  ChevronDown,
  Check,
  Clock,
  Sparkles
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Money } from '@/components/ui/money'
import StatusBadge from '@/components/ui/statusbadge'
import { ProjectWithClient, ProjectStatus } from '@/lib/projects/types'
import { updateProjectStatus } from '@/lib/projects/actions'
import { useAlert } from '@/components/util/alertprovider'
import { useHeaderTitle } from '@/components/util/headertitleprovider'

interface Props {
  initialProject: ProjectWithClient
}

const ALL_STATUSES: ProjectStatus[] = ['planning', 'in progress', 'on hold', 'completed']

export default function ProjectDetailsUI({ initialProject }: Props) {
  const [project, setProject] = useState<ProjectWithClient>(initialProject)
  useHeaderTitle(project.name)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { showAlert } = useAlert()

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    setIsMenuOpen(false)
    const prevStatus = project.status
    setProject(prev => ({ ...prev, status: newStatus }))

    const res = await updateProjectStatus(project.id, newStatus)
    if (!res.success) {
      setProject(prev => ({ ...prev, status: prevStatus }))
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header / Breadcrumb navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-divider pb-5">
        <div>
          <ButtonLink href="/projects" variant="ghost" className="mb-2 px-0 hover:bg-transparent text-xs text-zinc-500">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to Projects</span>
          </ButtonLink>
          
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {project.name}
            </h1>

            {/* Interactive Status Dropdown Pill */}
            <div className="relative">
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
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1 w-36 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-bold text-zinc-400 px-3 py-1 uppercase tracking-wider">
                      Update Status
                    </div>
                    {ALL_STATUSES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatusChange(s)}
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
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ButtonLink 
            href={`/client/${project.client_id}`} 
            variant="ghost" 
            className="text-xs"
          >
            <User className="h-3.5 w-3.5 mr-1.5" />
            <span>View Client Profile</span>
          </ButtonLink>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Overview, Milestones & Deliverables */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Milestone & Scope Progress */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-primary" />
              Project Scope & Milestones
            </h2>

            {/* Current Active Milestone */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 mb-6">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Immediate Next Milestone
              </div>
              <div className="text-sm font-bold text-zinc-900">
                {project.next_task || 'No active milestone defined yet'}
              </div>
            </div>

            {/* Scope / Description */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Scope Description
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed bg-white p-4 rounded-xl border border-brand-divider">
                {project.description || 'No description provided for this project yet.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-zinc-500 mb-2 font-medium">
                <span>Overall Completion</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Deliverables Vault Preview (Ready for Epic 3) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <FolderCheck className="h-4 w-4 text-zinc-500" />
                Deliverables & Assets
              </h2>
              <span className="text-xs text-zinc-400 font-medium">Epic 3 Vault</span>
            </div>

            <div className="p-8 text-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
              <Layers className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="font-semibold text-sm text-zinc-700">Deliverables Vault</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                File uploads, watermarked previews, and 1-click client approvals will be connected here in Epic 3.
              </p>
            </div>
          </Card>

        </div>

        {/* Right 1 Column: Client Summary & Metadata */}
        <div className="space-y-6">
          
          {/* Client Info Card */}
          <Card className="p-6">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Assigned Client
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {project.client?.company_name?.slice(0, 2).toUpperCase() || 'CL'}
              </div>
              <div>
                <Link 
                  href={`/client/${project.client_id}`}
                  className="font-bold text-zinc-900 text-base hover:text-brand-primary transition-colors flex items-center gap-1 group"
                >
                  <span>{project.client?.company_name}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </Link>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Contact: {project.client?.contact_name}
                </div>
              </div>
            </div>

            <ButtonLink 
              href={`/client/${project.client_id}`} 
              variant="ghost" 
              className="w-full justify-center text-xs border border-zinc-200"
            >
              Open Client Profile →
            </ButtonLink>
          </Card>

          {/* Budget & Financials */}
          <Card className="p-6">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Project Budget
            </div>
            <div className="text-2xl font-black text-zinc-950 mt-1">
              <Money amount={Number(project.budget) || 0} currency={project.currency || 'CAD'} />
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              Currency automatically inherited from {project.client?.company_name}
            </div>
          </Card>

          {/* Timeline & Target Dates */}
          <Card className="p-6 space-y-3">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Timeline & Schedule
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Target Due Date
              </span>
              <span className="font-semibold text-zinc-900">
                {project.due_date ? new Date(project.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                Created
              </span>
              <span className="text-zinc-700">
                {new Date(project.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-zinc-400" />
                Last Updated
              </span>
              <span className="text-zinc-700">
                {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </Card>

        </div>

      </div>
    </div>
  )
}
