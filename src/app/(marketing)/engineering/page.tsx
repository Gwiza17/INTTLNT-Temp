import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EngineeringPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-4'>Engineering Pathway (Canada)</h1>
      <p className='mb-4'>
        Content coming soon. This page will detail the Engineering pathway to
        Canada.
      </p>
      <Link href='/eoi?discipline=engineering&destination=canada'>
        <Button>Apply Now</Button>
      </Link>
    </div>
  )
}
