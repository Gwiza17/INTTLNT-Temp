import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function IELTSPage() {
  return (
    <div className='bg-white'>
      {/* Hero */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            IELTS is the gateway. Inttlnt is the system that gets you through
            it.
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-8'>
            Measure your readiness, improve with a structured plan, and book the
            earliest feasible test window—then feed your result into an active
            pathway program.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/ielts/assessment'>
              <Button size='lg'>Start IELTS Assessment</Button>
            </Link>
            <Link href='/ielts/availability'>
              <Button variant='outline' size='lg'>
                Check Exam Availability
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recruiting Now Hook */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
            <h2 className='text-2xl font-bold mb-2'>
              Eligible now? Apply today.
            </h2>
            <p className='mb-4'>
              If you already have IELTS ≥ 7.0 and starting financial capacity,
              you may qualify for the live Engineering pathway now.
            </p>
            <Link href='/engineering'>
              <Button>Apply Now — Engineering (Live)</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-8'>What You Get</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold mb-2'>
                  1) Readiness Score
                </h3>
                <p className='text-gray-600'>
                  Predicted band range and module-level weaknesses. Clear next
                  steps: what to fix first and how.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold mb-2'>
                  2) Learning Ladder
                </h3>
                <ul className='list-disc pl-4 text-gray-600 space-y-1'>
                  <li>Self-Serve: practice, retakes, progress tracking</li>
                  <li>Guided Cohort: structured plan + live clinics</li>
                  <li>Guided 1:1: personalised coaching</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold mb-2'>
                  3) Exam Availability Finder
                </h3>
                <p className='text-gray-600'>
                  Check availability by location. Choose to hold timing or
                  location constant to find the earliest feasible test.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-4'>Pricing (from)</h2>
          <div className='grid md:grid-cols-3 gap-4 text-center'>
            <div className='p-4 border rounded'>
              <p className='text-lg font-semibold'>Self-Serve</p>
              <p className='text-2xl text-blue-600'>from $X</p>
            </div>
            <div className='p-4 border rounded'>
              <p className='text-lg font-semibold'>Guided Cohort</p>
              <p className='text-2xl text-blue-600'>from $Y</p>
            </div>
            <div className='p-4 border rounded'>
              <p className='text-lg font-semibold'>1:1 Coaching</p>
              <p className='text-2xl text-blue-600'>from $Z</p>
            </div>
          </div>
          <div className='text-center mt-8'>
            <Link href='/ielts/assessment'>
              <Button size='lg'>Unlock IELTS Prep →</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
