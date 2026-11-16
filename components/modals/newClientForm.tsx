'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createNewClient } from '@/lib/clients/actions'
import { useAlert } from '../util/alertprovider'
import { redirect } from 'next/navigation'

export default function NewClientForm({ onSuccess, onCancel }: { onSuccess?: (clientId: string) => void, onCancel?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const clientData = {
      company_name: formData.get('company_name') as string,
      contact_name: formData.get('contact_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      currency: formData.get('currency') as string,
    }

    const result = await createNewClient(clientData)

    // FIX: Always turn off the loading state regardless of success/fail
    setIsSubmitting(false)

    if (result.success) {
      if (onSuccess) onSuccess(result.data.id)
    } else {
      showAlert({
        title: "Oh No!",
        message: `There was a problem while creating the client... ${result.error}`,
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
          <div className="space-y-1.5">
            <label htmlFor="company_name" className="text-sm font-medium text-zinc-900">
              Company Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="company_name"
              name="company_name"
              placeholder="e.g. Acme Corp"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact_name" className="text-sm font-medium text-zinc-900">
              Primary Contact <span className="text-red-500">*</span>
            </label>
            <Input
              id="contact_name"
              name="contact_name"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>
        </div>

        {/* Email (Required) */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-900">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@acmecorp.com"
            required
          />
        </div>

        {/* Phone & Currency (Optional Fields) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 000-0000"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="currency" className="text-sm font-medium text-zinc-700">
              Default Currency
            </label>
            {/* Replace with your custom <Select> component if you have one */}
            <select
              id="currency"
              name="currency"
              className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="USD"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
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
          disabled={isSubmitting}
          className="bg-brand-primary text-white hover:bg-[#E04618]"
        >
          {isSubmitting ? 'Saving...' : 'Save Client'}
        </Button>
      </div>
    </form>
  )
}