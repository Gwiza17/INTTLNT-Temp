import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NursingPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-4'>Nursing Pathway (Australia)</h1>
      <p className='mb-4'>
        Content coming soon. This page will detail the Nursing pathway to
        Australia.
      </p>
      <Link href='/eoi?discipline=nursing&destination=australia'>
        <Button>Apply Now</Button>
      </Link>
    </div>
  )
}
