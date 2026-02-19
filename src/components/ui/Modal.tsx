'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  closeOnOutsideClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOutsideClick = true,
}: ModalProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOutsideClick ? onClose : undefined}
        />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
          <div>{children}</div>
          {footer && <div className="mt-6 flex justify-end space-x-3">{footer}</div>}
        </div>
      </div>
    </div>
  )
}