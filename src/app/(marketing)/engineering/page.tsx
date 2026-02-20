import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import CostEstimator from '@/components/marketing/CostEstimator'

export default function EngineeringPage() {
  return (
    <div className='bg-white'>
      {/* Hero */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4'>
            LIVE — Recruiting Now
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Engineering Masters → Canada (Ottawa): apply now if you're ready.
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-8'>
            A structured pathway for 4-year engineering graduates—readiness
            scoring, IELTS preparation, screening, funding workflow, admission
            pack support, and visa milestones.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/eoi?discipline=engineering&destination=canada'>
              <Button size='lg'>Apply Now</Button>
            </Link>
            <Link href='/ielts'>
              <Button variant='outline' size='lg'>
                Check IELTS Readiness
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility (Fast-Track) */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Eligible Now (Fast-Track)</h2>
          <p className='mb-4'>Apply now if you meet:</p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700'>
            <li>IELTS ≥ 7.0 overall (balanced modules)</li>
            <li>Verified 4-year engineering degree</li>
            <li>Strong academics (typical benchmark ≥ 70% GPA equivalent)</li>
            <li>
              Financial capacity to commence the process (self-funding benchmark
              or finance-ready profile)
            </li>
          </ul>
          <p className='mt-4'>
            If you're not there yet, start with IELTS readiness and we'll route
            you into the nurture workflow.
          </p>
        </div>
      </section>

      {/* What Happens After You Apply */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>
            What Happens After You Apply
          </h2>
          <ol className='list-decimal pl-6 space-y-2 text-gray-700'>
            <li>Intake submission + document upload</li>
            <li>Eligibility triage (fast-track vs nurture)</li>
            <li>Readiness milestones (IELTS, funds, docs)</li>
            <li>Funding review (if applicable)</li>
            <li>Admission pack submission</li>
            <li>Visa milestones via migration agent</li>
          </ol>
          <div className='mt-8'>
            <Link href='/eoi?discipline=engineering&destination=canada'>
              <Button>Apply Now →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Estimator Sidebar Widget */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Cost Estimator</h2>
          <CostEstimator pathway='engineering' />
        </div>
      </section>
    </div>
  )
}
