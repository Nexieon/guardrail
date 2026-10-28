'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
// Import your existing modal component here (adjust the path as needed)
import { Modal } from '@/components/modal' 

interface ModalContextType {
  // We updated this to accept your title prop alongside the content
  showModal: (title: string, content: ReactNode) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  // FIX: Here is the missing function definition!
  const showModal = (title: string, content: ReactNode) => {
    setModalTitle(title)
    setModalContent(content)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      {/* We use your exact existing Modal component here */}
      <Modal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal must be used within a ModalProvider')
  return context
}