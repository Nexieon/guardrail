export type ProjectStatus = 'planning' | 'in progress' | 'on hold' | 'completed'

export interface Project {
  id: string
  agency_id: string
  client_id: string
  name: string
  description?: string | null
  budget: number
  currency: 'CAD' | 'USD'
  status: ProjectStatus
  progress: number
  due_date?: string | null
  next_task?: string | null
  created_at: string
  updated_at: string
}

export interface ProjectWithClient extends Project {
  client: {
    id: string
    company_name: string
    contact_name: string
    currency: 'CAD' | 'USD'
  }
}

export interface CreateProjectInput {
  name: string
  client_id: string
  budget?: number
  currency?: 'CAD' | 'USD'
  status?: ProjectStatus
  progress?: number
  due_date?: string | null
  description?: string | null
  next_task?: string | null
}

export interface UpdateProjectInput {
  name?: string
  client_id?: string
  budget?: number
  currency?: 'CAD' | 'USD'
  status?: ProjectStatus
  progress?: number
  due_date?: string | null
  description?: string | null
  next_task?: string | null
}
