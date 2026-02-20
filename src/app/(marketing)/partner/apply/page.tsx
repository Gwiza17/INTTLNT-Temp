import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function PartnerApplyPage() {
  return (
    <div className='max-w-2xl mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-4'>Apply to Become a Partner</h1>
      <p className='text-gray-600 mb-6'>
        Partner application form will be available soon. Please check back or
        contact us.
      </p>
      <Link href='/partner'>
        <Button>Back to Partner Page</Button>
      </Link>
    </div>
  )
}
