'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function EOIPage() {
  const searchParams = useSearchParams()
  const discipline = searchParams.get('discipline')
  const destination = searchParams.get('destination')

  return (
    <div className='max-w-3xl mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Expression of Interest</h1>
      {discipline && destination && (
        <p className='mb-4 text-gray-600'>
          Pathway: {discipline} → {destination}
        </p>
      )}
      <p className='text-gray-600'>EOI form will be built in Sprint 2.</p>
      {/* Placeholder – actual form later */}
      <Button disabled>Submit (Coming Soon)</Button>
    </div>
  )
}
