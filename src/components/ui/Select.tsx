import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from './Label'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, placeholder, ...props }, ref) => {
    const selectId =
      id || `select-${Math.random().toString(36).substring(2, 9)}`

    return (
      <div className='w-full'>
        {label && <Label htmlFor={selectId}>{label}</Label>}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

export { Select }
