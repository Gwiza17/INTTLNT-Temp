import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className='bg-white'>
      <Header />

      {/* Hero Section */}
      <section
        className='relative overflow-hidden'
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '70vh',
        }}
      >
        <div className='absolute inset-0 bg-slate-900/60' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[70vh] text-center'>
          <div className='max-w-2xl mx-auto'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4 leading-tight animate-breathe'>
              Your Pathway to Global Education & Career Success
            </h1>

            <p className='text-xl text-white/80 mb-8 animate-breathe-delay-1'>
              Study Abroad. Build Your Future.
            </p>

            <div className='flex flex-wrap justify-center gap-4 animate-breathe-delay-2'>
              <Link href='/livepathways'>
                <Button
                  size='lg'
                  className='bg-blue-600 hover:bg-blue-700 text-white border-0'
                >
                  Explore Live Pathways
                </Button>
              </Link>

              <Link href='/partner'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white hover:text-slate-900'
                >
                  Channel Partner Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Students + For Channel Partners */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-8'>
            {/* For Students */}
            <div
              className='relative rounded-2xl p-8 shadow-sm border border-gray-200 bg-cover bg-center overflow-hidden'
              style={{ backgroundImage: "url('/images/students.jpg')" }}
            >
              <div className='absolute inset-0 '></div>
              <div className='relative'>
                <div className='inline-block bg-white/80 px-3 py-1 rounded-lg mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    For Students
                  </h2>
                  <p className='text-gray-600 text-sm'>
                    Start your journey to studying abroad
                  </p>
                </div>
                <ul className='space-y-3 mb-8'>
                  {[
                    { icon: '🎓', label: 'IELTS Preparation' },
                    { icon: '🏫', label: 'University Admissions' },
                    { icon: '💼', label: 'Education Financing' },
                    { icon: '📋', label: 'Visa Assistance' },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className='flex items-center gap-3 text-gray-800 bg-blue-50 px-4 py-2 rounded-md border border-gray-200'
                    >
                      <span className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm'>
                        {item.icon}
                      </span>
                      <span className='font-medium'>{item.label}</span>
                    </li>
                  ))}
                </ul>
                <Link href='/livepathways'>
                  <Button className='w-full' size='lg'>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Channel Partners */}
            <div
              className='relative rounded-2xl p-8 shadow-sm border border-gray-200 bg-cover bg-center overflow-hidden'
              style={{
                backgroundImage: "url('/images/channel-partner.jpg')",
              }}
            >
              <div className='absolute inset-0'></div>
              <div className='relative'>
                <div className='inline-block  py-1 rounded-lg mb-6 bg-blue-50/70'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    For Channel Partners
                  </h2>
                  <p className='text-gray-600 text-sm'>
                    Join our network and grow with us
                  </p>
                </div>
                <ul className='space-y-3 mb-8'>
                  {[
                    'Dedicated Support',
                    'Generous Commissions',
                    'Global Opportunities',
                  ].map((item) => (
                    <li
                      key={item}
                      className='flex items-center gap-3 text-gray-800 bg-blue-50 px-4 py-2 rounded-md border border-gray-200'
                    >
                      <span className='text-blue-600 font-bold'>✓</span>
                      <span className='font-medium'>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href='/partner'>
                  <Button className='w-full' size='lg'>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-2'>
            InttInt FAQs
            <span className='text-gray-400 font-normal'>
              {' '}
              — Your Questions Answered
            </span>
          </h2>
          <p className='text-center text-gray-500 mb-12'>
            Everything you need to know about our pathways
          </p>

          <div className='grid md:grid-cols-3 gap-6'>
            {[
              {
                icon: '📋',
                title: 'General Overview',
                questions: ['What is InttInt?', 'What pathways do you offer?'],
              },
              {
                icon: '✅',
                title: 'Eligibility & Requirements',
                questions: [
                  'What candidates are you looking for?',
                  'Do I need work experience?',
                ],
              },
              {
                icon: '💰',
                title: 'Costs & Funding',
                questions: [
                  'What costs do I need to cover?',
                  'Can the loan cover all costs?',
                ],
              },
              {
                icon: '🏦',
                title: 'Loans & Repayment',
                questions: [
                  'What is the typical loan term?',
                  'What if I leave the country?',
                ],
              },
            ].map((faq) => (
              <div
                key={faq.title}
                className='bg-gray-50 rounded-xl p-6 border border-gray-100'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <span className='text-xl'>{faq.icon}</span>
                    <h3 className='font-semibold text-gray-900'>{faq.title}</h3>
                  </div>
                  <span className='text-gray-400'>›</span>
                </div>
                <ul className='space-y-2'>
                  {faq.questions.map((q) => (
                    <li
                      key={q}
                      className='flex items-start gap-2 text-sm text-gray-600'
                    >
                      <span className='text-blue-500 mt-0.5'>✓</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* View All FAQs card */}
            <div className='bg-blue-600 rounded-xl p-6 flex flex-col justify-between'>
              <div>
                <h3 className='font-semibold text-white text-lg mb-2'>
                  Have more questions?
                </h3>
                <p className='text-blue-100 text-sm'>
                  Browse our full FAQ library for detailed answers.
                </p>
              </div>
              <Link href='/faq' className='mt-6'>
                <Button className='w-full bg-white text-blue-600 hover:bg-blue-50 border-0'>
                  View All FAQs →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-12 items-stretch'>
            {/* Left — Success Stories */}
            <div
              className='relative rounded-2xl bg-cover bg-center overflow-hidden'
              style={{ backgroundImage: "url('/images/success-stories.jpg')" }}
            >
              <div className='absolute inset-0 bg-slate-800/40'></div>
            </div>

            {/* Right — Process steps */}
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                The Process{' '}
                <span className='font-normal text-gray-500'>Step by Step</span>
              </h2>
              <p className='text-gray-500 mb-8'>
                Your journey to global education starts here.
              </p>
              <div className='space-y-4'>
                {[
                  {
                    step: 1,
                    title: 'Register & Assess',
                    desc: 'Create your profile and get your readiness score',
                  },
                  {
                    step: 2,
                    title: 'Apply to University',
                    desc: 'Submit your application with our guidance',
                  },
                  {
                    step: 3,
                    title: 'Secure Financing',
                    desc: 'Access education funding options',
                  },
                  {
                    step: 4,
                    title: 'Get Your Visa',
                    desc: 'Complete your visa application with support',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className='flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm'
                  >
                    <div className='w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0'>
                      {item.step}
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>
                        {item.title}
                      </p>
                      <p className='text-sm text-gray-500'>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-8'>
                <Link href='/faq'>
                  <Button size='lg'>Learn the Process →</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
