'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createNewProject } from '@/lib/projects/actions'
import { Client } from '@/lib/clients/client-data'
import { ProjectStatus } from '@/lib/projects/types'
import { useAlert } from '../util/alertprovider'

interface NewProjectFormProps {
  availableClients: Client[]
  preselectedClientId?: string
  onSuccess?: (projectId: string) => void
  onCancel?: () => void
}

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'on hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

export default function NewProjectForm({
  availableClients,
  preselectedClientId,
  onSuccess,
  onCancel,
}: NewProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>(
    preselectedClientId || (availableClients.length > 0 ? availableClients[0].id : '')
  )
  const [status, setStatus] = useState<ProjectStatus>('planning')

  const { showAlert } = useAlert()

  // Find the selected client to inherit their currency
  const activeClient = availableClients.find((c) => c.id === selectedClientId)
  const clientCurrency = activeClient?.currency || 'CAD'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const budgetStr = formData.get('budget') as string
    const dueDate = formData.get('due_date') as string
    const nextTask = formData.get('next_task') as string
    const description = formData.get('description') as string

    if (!name?.trim()) {
      setIsSubmitting(false)
      showAlert({
        title: "Required Field",
        message: "Please enter a project name.",
        confirmText: "Ok",
        icon: "wrong",
      })
      return
    }

    if (!selectedClientId) {
      setIsSubmitting(false)
      showAlert({
        title: "No Client Selected",
        message: "Please select or create a client first.",
        confirmText: "Ok",
        icon: "wrong",
      })
      return
    }

    const result = await createNewProject({
      name: name.trim(),
      client_id: selectedClientId,
      budget: budgetStr ? parseFloat(budgetStr) : 0,
      currency: clientCurrency,
      status: status,
      due_date: dueDate || null,
      next_task: nextTask?.trim() || null,
      description: description?.trim() || null,
    })

    setIsSubmitting(false)

    if (result.success && result.data) {
      if (result.notification && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('guardrail:notification', { detail: result.notification }))
      }
      if (onSuccess) onSuccess(result.data.id)
    } else {
      showAlert({
        title: "Could Not Create Project",
        message: result.error || "An unexpected error occurred.",
        confirmText: "Ok",
        icon: "wrong",
      })
    }
  }

  const clientOptions = availableClients.map((c) => ({
    value: c.id,
    label: `${c.company_name} (${c.contact_name})`,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        {/* Project Name */}
        <Input
          label="Project Name *"
          name="name"
          placeholder="e.g. Website Redesign & Brand Sprint"
          required
          autoFocus
        />

        {/* Assigned Client & Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {availableClients.length > 0 ? (
            <Select
              label="Assigned Client *"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              options={clientOptions}
              disabled={!!preselectedClientId}
            />
          ) : (
            <div className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
              No clients found. Please create a client first.
            </div>
          )}

          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Budget & Due Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={`Budget (${clientCurrency})`}
            name="budget"
            type="number"
            step="100"
            min="0"
            placeholder="e.g. 5000"
          />

          <Input
            label="Target Due Date"
            name="due_date"
            type="date"
          />
        </div>

        {/* Next Task / Active Milestone */}
        <Input
          label="Immediate Next Milestone"
          name="next_task"
          placeholder="e.g. Wireframe sign-off"
        />

        {/* Scope Notes / Description */}
        <Textarea
          label="Scope Notes / Description"
          name="description"
          placeholder="Key deliverables, timeline expectations, or client specifications..."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-divider">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || availableClients.length === 0}
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
