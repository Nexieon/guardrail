import ProjectsUI from './ui'

export default async function ProjectsPage() {
    const mockProjectsData:any = [
        {
            id: 'proj-1',
            name: 'E-commerce website redesign',
            client_name: 'Acme Corp',
            client_initials: 'AC',
            budget: 18000,
            status: 'in progress',
            next_task: 'Homepage mockups',
            progress: 68,
            due_date: 'Nov 14',
            deliverables: 6,
            in_review: 2,
            updated_at: '2h ago',
            needs_attention: false
        },
        {
            id: 'proj-2',
            name: 'Q4 marketing campaign',
            client_name: 'Acme Corp',
            client_initials: 'AC',
            budget: 18000,
            status: 'planning',
            next_task: 'Brief sign-off',
            progress: 12,
            due_date: 'Dec 3',
            deliverables: 1,
            to_invoice: 2400,
            updated_at: 'yesterday',
            needs_attention: false
        },
        {
            id: 'proj-3',
            name: 'Brand identity refresh',
            client_name: 'Global Tech',
            client_initials: 'GT',
            budget: 5000,
            status: 'on hold',
            next_task: 'Waiting on client feedback 6 days',
            progress: 45,
            due_date: 'Oct 25',
            deliverables: 4,
            overdue_days: 3,
            updated_at: '3 days ago',
            needs_attention: true
        }
    ]

    return <ProjectsUI initialProjects={mockProjectsData} />
}