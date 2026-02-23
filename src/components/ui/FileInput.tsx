'use client'

import * as React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { Label } from './Label'
import { Button } from './Button'

interface FileInputProps extends UseControllerProps<any> {
  label: string
  accept?: string
  maxSize?: number // in MB
}

export function FileInput({ label, accept, maxSize = 10, ...props }: FileInputProps) {
  const { field, fieldState } = useController(props)
  const [fileName, setFileName] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Optional client-side size validation
      if (file.size > maxSize * 1024 * 1024) {
        field.onChange(null)
        setFileName('')
        alert(`File size must be less than ${maxSize}MB`)
        return
      }
      field.onChange(file)
      setFileName(file.name)
    } else {
      field.onChange(null)
      setFileName('')
    }
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    field.onChange(null)
    setFileName('')
  }

  return (
    <div className="w-full">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
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
      {fieldState.error && (
        <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
      )}
    </div>
  )
}