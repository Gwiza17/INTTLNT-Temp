import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function PartnerPage() {
  return (
    <div className='bg-white'>
      {/* Hero */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Become a Channel Partner. Deliver outcomes to your members.
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            Inttlnt partners with associations, registration bodies, alumni
            networks, and trusted community operators to identify eligible
            applicants and guide them into verified pathway programs.
          </p>
          <div className='flex justify-center space-x-4'>
            <Link href='/partner/apply'>
              <Button size='lg'>Apply to Become a Partner</Button>
            </Link>
            <Link href='/partner/demo'>
              <Button variant='outline' size='lg'>
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Partners Work With Inttlnt */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-8 text-center'>
            Why Partners Work With Inttlnt
          </h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-2'>
                  ✓ You provide member value
                </h3>
                <p className='text-gray-600'>
                  Real outcomes, not just information.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-2'>
                  ✓ You get a partner dashboard
                </h3>
                <p className='text-gray-600'>
                  Referral tracking and pipeline status.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-2'>
                  ✓ You keep control of the channel
                </h3>
                <p className='text-gray-600'>We run the workflow execution.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-2'>
                  ✓ Transparent reporting
                </h3>
                <p className='text-gray-600'>For your cohorts and campaigns.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Receive */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6 text-center'>
            What You Receive
          </h2>
          <ul className='list-disc pl-6 max-w-2xl mx-auto space-y-2 text-gray-700'>
            <li>Partner login</li>
            <li>Referral links by market + pathway + campaign</li>
            <li>
              Pipeline view of your referred leads:
              <ul className='list-circle pl-6 mt-1'>
                <li>
                  Lead created → intake → IELTS progress → eligible →
                  progressing
                </li>
              </ul>
            </li>
            <li>"What's needed next" indicators</li>
          </ul>
        </div>
      </section>

      {/* Partner Process */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6 text-center'>
            Partner Process
          </h2>
          <ol className='list-decimal pl-6 max-w-2xl mx-auto space-y-2 text-gray-700'>
            <li>Apply on this page</li>
            <li>Inttlnt reviews and approves</li>
            <li>You receive an invite link to set up your login</li>
            <li>You generate links and start promoting</li>
            <li>We support webinars and reporting</li>
          </ol>
          <div className='text-center mt-8'>
            <Link href='/partner/apply'>
              <Button size='lg'>Apply Now →</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
