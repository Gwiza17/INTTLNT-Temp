import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import CostEstimator from '@/components/marketing/CostEstimator'

export default function NursingPage() {
  return (
    <div className='bg-white'>
      {/* Hero */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Nursing Australia 2027: start early, win later.
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-8'>
            Nursing pathways are competitive and timeline-driven. Start building
            IELTS readiness, documentation, and household readiness now so you
            don't lose time when intake windows open.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/eoi?discipline=nursing&destination=australia'>
              <Button size='lg'>Register Interest</Button>
            </Link>
            <Link href='/ielts'>
              <Button variant='outline' size='lg'>
                Check IELTS Readiness
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What Registering Interest Gives You */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>
            What Registering Interest Gives You
          </h2>
          <ul className='list-disc pl-6 space-y-2 text-gray-700'>
            <li>Saved profile and milestones</li>
            <li>IELTS readiness plan</li>
            <li>Early notifications and cohort webinars</li>
            <li>A structured path to become eligible when the pathway opens</li>
          </ul>
        </div>
      </section>

      {/* Cost Estimator */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Cost Estimator</h2>
          <CostEstimator pathway='nursing' />
        </div>
      </section>
    </div>
  )
}
