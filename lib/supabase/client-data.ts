export type ClientStatus = 'Active' | 'Pending' | 'Archived'

export interface Client {
    id: string;
    agency_id: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: ClientStatus;
    total_billed: number;
    outstanding_balance: number;
    internal_notes: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
}