import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function EOISuccessPage() {
  return (
    <div className='max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <Card>
        <CardContent className='p-8 text-center'>
          <div className='mb-6'>
            <svg
              className='mx-auto h-12 w-12 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold mb-4'>
            EOI Submitted Successfully!
          </h1>
          <p className='text-gray-600 mb-6'>
            Thank you for your Expression of Interest. Your application has been
            received and is now being reviewed.
          </p>
          <p className='text-gray-600 mb-8'>
            You can track your progress and upload additional documents from
            your dashboard.
          </p>
          <div className='space-x-4'>
            <Link href='/dashboard/applicant'>
              <Button>Go to My Dashboard</Button>
            </Link>
            <Link href='/'>
              <Button variant='outline'>Return Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
