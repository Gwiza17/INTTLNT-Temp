import Link from 'next/link'
import { Button } from '@/components/ui/Button'

import Footer from '@/components/layout/Footer'

export default function LivePathwaysPage() {
  const pathways = [
    {
      href: '/engineering',
      title: 'Engineering Masters',
      description: 'Master of Engineering → Canada (Ottawa)',
      destination: 'Canada',
      badge: 'LIVE',
      eligibility: [
        'IELTS ≥ 7.0 overall (balanced modules)',
        '4-year engineering degree (verified)',
        'Strong academics (≥ 70% GPA equivalent)',
        'Financial capacity to commence the process',
      ],
    },

    {
      href: '/computer-science',
      title: 'Computer Science',
      description: 'Master of Computer Science → Canada',
      destination: 'Canada',
      badge: 'LIVE',
      eligibility: [
        'Computer Science / IT / Engineering degree',
        'Programming experience',
        'IELTS 7.0+',
        'Strong analytical ability',
      ],
    },
    {
      href: '/teaching',
      title: 'Teaching (STEM)',
      description: 'Master of Teaching (STEM) → Canada',
      destination: 'Canada',
      badge: 'LIVE',
      eligibility: [
        'STEM degree (Math, Science, Engineering)',
        'Strong academic record (70%+)',
        'IELTS 7.0+',
        'Teaching or mentoring experience preferred',
      ],
    },
    {
      href: '/nursing',
      title: 'Nursing Practice',
      description: 'Master of Nursing Practice → Australia',
      destination: 'Australia',
      badge: 'LIVE 2027',
      eligibility: [
        'IELTS ≥ 7.0 overall, no band less than 7.0',
        '4-year nursing degree or Master of Nursing Practice',
        'Active nursing registration in home country (AHPRA-eligible)',
        'Financial capacity to commence the process',
      ],
    },
  ]

  return (
    <div className='bg-white min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Live Pathways
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Explore our active recruitment programs and start your journey to
            global education and career success.
          </p>
        </div>
      </section>

      {/* Pathways Grid */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {pathways.map((pathway) => (
              <div
                key={pathway.href}
                className='bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-lg transition-shadow'
              >
                <div className='inline-block bg-green-600 text-white text-xs px-3 py-1 rounded-full mb-4'>
                  {pathway.badge}
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  {pathway.title}
                </h2>
                <p className='text-gray-600 mb-3'>{pathway.description}</p>
                <div className='mb-4'>
                  <span className='text-sm font-medium text-gray-500'>
                    Destination:
                  </span>
                  <span className='ml-2 text-sm text-gray-700'>
                    → {pathway.destination}
                  </span>
                </div>
                <div className='mb-6'>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    Eligibility:
                  </p>
                  <ul className='list-disc pl-5 text-sm text-gray-600 space-y-1'>
                    {pathway.eligibility.slice(0, 3).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  {pathway.eligibility.length > 3 && (
                    <p className='text-xs text-gray-500 mt-1'>+ more</p>
                  )}
                </div>
                <Link href={pathway.href}>
                  <Button className='w-full'>Learn More →</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-blue-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Ready to Start Your Journey?
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            Fast-tracked, funded, and supported. Begin your application today.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link href='/eoi'>
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

      <Footer />
    </div>
  )
}
