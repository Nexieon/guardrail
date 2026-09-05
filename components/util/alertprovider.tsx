'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Modal } from '../modal'
import { Button } from '../ui/button' 
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { Input } from '../ui/input'

// What our alert function can accept
type AlertOptions = {
    title: string
    message?: string
    confirmText?: string
    cancelText?: string
    icon?: AlertIconTypes
    destructive?: boolean // Makes the confirm button red
    expectedInput?: string; // The exact string they must type (e.g., "DELETE")
    inputPlaceholder?: string; // What shows in the empty box
}

type AlertIconTypes = 'success' | 'warning' | 'wrong' | 'info'

type AlertContextType = {
    showAlert: (options: AlertOptions) => Promise<boolean>
}

// Helper function to render the colored icon
const convertToIcon = (icon?: AlertIconTypes) => {
    switch (icon) {
        case 'success':
            return (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check className="h-6 w-6 text-green-600" />
                </div>
            )
        case 'warning':
            return (
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <TriangleAlert className="h-6 w-6 text-amber-600" />
                </div>
            )
        case 'wrong':
            return (
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <X className="h-6 w-6 text-red-600" />
                </div>
            )
        case 'info':
            return (
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Info className="h-6 w-6 text-blue-600" />
                </div>
            )
        default:
            return null
    }
}

const AlertContext = createContext<AlertContextType | null>(null)

export function AlertProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [options, setOptions] = useState<AlertOptions | null>(null)
    const [inputValue, setInputValue] = useState('')
    
    // This stores the Promise resolver so we know when the user clicks a button
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

    const showAlert = (newOptions: AlertOptions) => {
        setOptions(newOptions)
        setInputValue('')
        setIsOpen(true)
        
        // Return a promise that resolves when the user clicks confirm or cancel
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve)
        })
    }

    const handleClose = (confirmed: boolean) => {
        setIsOpen(false)
        if (resolver) resolver(confirmed)
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            
            <Modal 
                isOpen={isOpen} 
                onClose={() => handleClose(false)} 
                title={options?.title || ''}
            >
                {/* Flex row keeps the icon next to the message nicely */}
                <div className="flex flex-col sm:flex-row gap-4 text-left items-start mt-2">
                    
                    {/* Render Icon if provided */}
                    {convertToIcon(options?.icon)}

                    <div className="flex-1 flex flex-col gap-2">
                        {options?.message && (
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                {options.message}
                            </p>
                        )}
                        
                        {/* --- NEW INPUT SECTION --- */}
                        {options?.expectedInput && (
                            <div className="mt-4">
                                <p className="text-sm text-zinc-700 mb-1.5">
                                    Please type <span className="font-bold select-none">{options.expectedInput}</span> to confirm:
                                </p>
                                <Input 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={options.inputPlaceholder || ""}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {/* --- UPDATED BUTTONS --- */}
                        <div className="flex justify-end gap-3 mt-4">
                            {options?.cancelText && (
                                <Button variant="ghost" onClick={() => handleClose(false)}>
                                    {options.cancelText}
                                </Button>
                            )}
                            <Button 
                                variant={options?.destructive ? 'secondary' : 'primary'} 
                                onClick={() => handleClose(true)}
                                // Disable the button if they haven't typed the exact expected string
                                disabled={options?.expectedInput ? inputValue !== options.expectedInput : false}
                            >
                                {options?.confirmText || 'Confirm'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </AlertContext.Provider>
    )
}

// The custom hook you will use everywhere
export const useAlert = () => {
    const context = useContext(AlertContext)
    if (!context) throw new Error("useAlert must be used within an AlertProvider")
    return context
}