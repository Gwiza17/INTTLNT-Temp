'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './Input'
import { Button } from './Button'

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  onFileSelect?: (file: File | null) => void
}

export function FileUpload({ label, error, className, onChange, onFileSelect, ...props }: FileUploadProps) {
  const [fileName, setFileName] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file ? file.name : '')
    onFileSelect?.(file)
    onChange?.(e)
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      setFileName('')
      onFileSelect?.(null)
    }
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </Button>
        {fileName && (
          <>
            <span className="text-sm text-gray-600 truncate max-w-xs">{fileName}</span>
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}