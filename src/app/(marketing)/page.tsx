import PathwayMatrix from '@/components/marketing/PathwayMatrix'
import HowItWorks from '@/components/marketing/HowItWorks'
import FAQBotPlaceholder from '@/components/marketing/FAQBotPlaceholder'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>
            Funded. Fast-tracked. Supported.
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            We work backwards from employment outcomes in critical skills:
            Engineering, Nursing, ICT, Teaching, Accounting.
          </p>
          <div className='flex justify-center space-x-4'>
            <Link href='/eoi'>
              <Button size='lg'>Start Expression of Interest</Button>
            </Link>
            <Link href='/partner'>
              <Button variant='outline' size='lg'>
                Become a Channel Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pathway Matrix Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Find Your Pathway
          </h2>
          <PathwayMatrix />
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
          <HowItWorks />
        </div>
      </section>

      {/* FAQ Bot Placeholder */}
      <section className='py-16 bg-white'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Have Questions?
          </h2>
          <FAQBotPlaceholder />
        </div>
      </section>
    </div>
  )
}
