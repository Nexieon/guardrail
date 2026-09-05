export type ClientStatus = 'Active' | 'Pending' | 'Archived'
export type Currency = 'CAD' | 'USD' // Makes it strictly typed

export interface Client {
    id: string;
    agency_id: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: ClientStatus;
    currency: Currency;
    total_billed: number;
    outstanding_balance: number;
    internal_notes: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
}

// A smart formatter that handles the math and adds the visual flair
export function formatFinancials (amount: number, currency: 'CAD' | 'USD') {
    const formatted = new Intl.NumberFormat('en-CA', { 
        style: 'currency', 
        currency: currency,
        currencyDisplay: 'narrowSymbol' 
    }).format(amount)

    return (
        // Changed to items-baseline and added whitespace-nowrap
        <span className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span>{formatted}</span>
            <span className="text-sm text-zinc-400 font-normal">{currency}</span>
        </span>
    )
}