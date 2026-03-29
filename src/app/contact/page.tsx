import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <Header />

      {/* Hero */}
      <section className='relative py-16 px-4 text-white overflow-hidden'>
        {/* Background Image */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: "url('/images/contactus.jpg')",
          }}
        />

        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-slate-900/80' />

        {/* Content */}
        <div className='relative max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-4'> Contact Us </h1>
          <p className='text-lg sm:text-xl text-white/80'>
            Start the Conversation
          </p>
          <p className='mt-4 text-white/70 max-w-2xl mx-auto'>
            Whether you're exploring a global education pathway or looking to
            partner with us, we're here to help you take the next step.
          </p>
        </div>
      </section>

      <main className='flex-1'>
        <div className='max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-12'>
          {/* General Enquiries */}
          <section className='text-center'>
            <h2 className='text-2xl font-bold text-slate-900 mb-4'>
              General Enquiries
            </h2>
            <p className='text-gray-600 mb-6'>
              For all other questions, including platform support or additional
              information:
            </p>

            <div className='inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-6 py-4'>
              <span className='text-2xl'>📧</span>
              <div className='text-left'>
                <p className='text-sm text-gray-500'>Email</p>
                <a
                  href='mailto:info@inttlnt.com'
                  className='text-blue-600 font-medium hover:underline'
                >
                  info@inttlnt.com
                </a>
              </div>
            </div>
          </section>

          <hr className='border-gray-200' />

          {/* For Students */}
          <section className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900 mb-4'>
                For Students
              </h2>
              <p className='text-gray-600 mb-4'>
                Have questions about your eligibility, pathway options, or next
                steps? Our team can help you understand:
              </p>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500 mt-1'>✓</span>
                  Your readiness for international study
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500 mt-1'>✓</span>
                  The right pathway based on your background
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500 mt-1'>✓</span>
                  What to expect across admissions, financing, and visas
                </li>
              </ul>
            </div>

            <div className='bg-slate-50 rounded-xl p-6 space-y-4'>
              <div>
                <p className='text-sm font-semibold text-slate-700 mb-2'>
                  Ready to begin?
                </p>
                <Link href='/eoi'>
                  <Button className='w-full'>Start Your Application</Button>
                </Link>
              </div>

              <div>
                <p className='text-sm font-semibold text-slate-700 mb-2'>
                  Still have questions?
                </p>
                <a href='mailto:info@inttlnt.com'>
                  <Button variant='outline' className='w-full'>
                    Email Us Directly
                  </Button>
                </a>
              </div>
            </div>
          </section>

          <hr className='border-gray-200' />

          {/* For Channel Partners */}
          <section className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900 mb-4'>
                For Channel Partners
              </h2>
              <p className='text-gray-600 mb-4'>
                Interested in working with Inttlnt? We partner with
                organizations that want to:
              </p>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500 mt-1'>✓</span>
                  Access qualified, career-focused candidates
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500 mt-1'>✓</span>
                  Expand into global education pathways
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-500 mt-1'>✓</span>
                  Build sustainable, outcome-driven programs
                </li>
              </ul>
            </div>

            <div className='bg-slate-50 rounded-xl p-6'>
              <p className='text-sm font-semibold text-slate-700 mb-2'>
                Explore partnership opportunities
              </p>
              <Link href='/partner'>
                <Button className='w-full'>Become a Partner</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
