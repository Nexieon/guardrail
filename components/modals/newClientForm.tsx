'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createNewClient } from '@/lib/clients/actions'
import { useAlert } from '../util/alertprovider'

interface NewClientFormProps {
  onSuccess?: (clientId: string) => void
  onCancel?: () => void
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
]

export default function NewClientForm({ onSuccess, onCancel }: NewClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const { showAlert } = useAlert()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const clientData = {
      company_name: formData.get('company_name') as string,
      contact_name: formData.get('contact_name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      currency: currency || 'USD',
    }

    const result = await createNewClient(clientData)
    setIsSubmitting(false)

    if (result.success && result.data) {
      if (onSuccess) onSuccess(result.data.id)
    } else {
      showAlert({
        title: "Oh No!",
        message: `There was a problem while creating the client: ${result.error}`,
        confirmText: "Ok",
        icon: "wrong"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Company & Contact (Required Fields) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="company_name"
            name="company_name"
            label="Company Name *"
            placeholder="e.g. Acme Corp"
            required
          />

          <Input
            id="contact_name"
            name="contact_name"
            label="Primary Contact *"
            placeholder="e.g. Jane Doe"
            required
          />
        </div>

        {/* Email (Required) */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="jane@acmecorp.com"
          required
        />

        {/* Phone & Currency (Optional Fields) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            placeholder="(555) 000-0000"
          />

          <Select
            id="currency"
            name="currency"
            label="Default Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={CURRENCY_OPTIONS}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Client'}
        </Button>
      </div>
    </form>
  )
}
