import React from 'react'
import { Money } from '@/components/ui/money'

export type ClientStatus = 'Active' | 'Pending' | 'Archived'
export type Currency = 'CAD' | 'USD'

export interface Client {
  id: string
  agency_id: string
  company_name: string
  contact_name: string
  email: string
  phone: string | null
  address: string | null
  status: ClientStatus
  currency: Currency
  total_billed: number
  outstanding_balance: number
  internal_notes: string | null
  last_login_at: string | null
  created_at: string
  updated_at: string
}

// Backwards-compatible helper bridging to the Money component
export function formatFinancials(amount: number, currency: Currency) {
  return <Money amount={amount} currency={currency} />
}
