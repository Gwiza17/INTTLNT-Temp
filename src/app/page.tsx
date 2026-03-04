import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import PathwayMatrix from '@/components/marketing/PathwayMatrix'
import MiniIELTSAssessment from '@/components/marketing/MiniIELTSAssessment'
import HowItWorks4Steps from '@/components/marketing/HowItWorks4Steps'
import Storyboard from '@/components/marketing/Storyboard'
import PathwayCards from '@/components/marketing/PathwayCards'
import ChannelPartnerTeaser from '@/components/marketing/ChannelPartnerTeaser'
import Header from '@/components/layout/Header'

export default function HomePage() {
  return (
    <div className='bg-white'>
      <Header />

      {/* Hero Section */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>
            Move from "I want to migrate" to "I'm ready to go."
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            Inttlnt is a structured pathway platform that turns high-potential
            applicants into admissions-ready, funder-ready, and visa-ready
            candidates—starting with IELTS readiness and progressing through
            screening, funding, admissions, and visa milestones.
          </p>
          <div className='flex justify-center space-x-4'>
            <Link href='/engineering'>
              <Button size='lg'>Apply Now — Engineering (Live)</Button>
            </Link>
            <Link href='/ielts'>
              <Button variant='outline' size='lg'>
                Check IELTS Readiness
              </Button>
            </Link>
          </div>
          <div className='mt-8 flex justify-center gap-6 text-sm text-gray-500'>
            <span>✓ IELTS readiness + preparation</span>
            <span>✓ Stage-gated eligibility screening</span>
            <span>✓ Transparent dashboards</span>
          </div>
        </div>
      </section>

      {/* Live Pathway Section — Engineering */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
            <div className='inline-block bg-green-600 text-white text-xs px-2 py-1 rounded mb-2'>
              LIVE — Recruiting Now
            </div>
            <h2 className='text-2xl font-bold mb-2'>
              Engineering Pathway: Masters → Canada (Ottawa)
            </h2>
            <p className='mb-4'>
              We are recruiting qualified 4-year engineering graduates now. If
              you meet the fast-track criteria below, apply today. If not, start
              with IELTS readiness and we'll route you into a nurture plan to
              reach the threshold quickly.
            </p>
            <div className='grid md:grid-cols-2 gap-4 mb-4'>
              <div>
                <h3 className='font-semibold'>
                  Fast-track eligibility (apply now):
                </h3>
                <ul className='list-disc pl-5 text-sm'>
                  <li>IELTS ≥ 7.0 overall (balanced modules)</li>
                  <li>4-year engineering degree (verified)</li>
                  <li>Strong academics (≥ 70% GPA equivalent)</li>
                  <li>Financial capacity to commence the process</li>
                </ul>
              </div>
              <div className='flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0'>
                <Link href='/engineering'>
                  <Button>Apply Now — Engineering (Live)</Button>
                </Link>

                <Link href='/ielts'>
                  <Button variant='outline'>Check IELTS Readiness</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Pathway Section — Nursing */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
            <div className='inline-block bg-green-600 text-white text-xs px-2 py-1 rounded mb-2'>
              LIVE — Recruiting Now (2027)
            </div>
            <h2 className='text-2xl font-bold mb-2'>
              Nursing Pathway: Registration → Australia (2027)
            </h2>
            <p className='mb-4'>
              We are recruiting qualified nursing graduates now. If you meet the
              fast-track criteria below, apply today. If not, start with IELTS
              readiness and we'll route you into a nurture plan to reach the
              threshold quickly.
            </p>
            <div className='grid md:grid-cols-2 gap-4 mb-4'>
              <div>
                <h3 className='font-semibold'>
                  Fast-track eligibility (apply now):
                </h3>
                <ul className='list-disc pl-5 text-sm'>
                  <li>IELTS ≥ 7.0 overall, no band less than 7.0</li>
                  <li>4-year nursing degree or Master of Nursing Practice</li>
                  <li>
                    Active nursing registration in home country (AHPRA-eligible)
                  </li>
                  <li>Financial capacity to commence the process</li>
                </ul>
              </div>
              <div className='flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0'>
                <Link href='/nursing'>
                  <Button>Apply Now — Nursing (Live)</Button>
                </Link>
                <Link href='/ielts'>
                  <Button variant='outline'>Check IELTS Readiness</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini IELTS Self-Assessment */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-2xl font-bold mb-2'>
            Get your IELTS readiness signal in 3 minutes
          </h2>
          <p className='text-gray-600 mb-6'>
            Answer 3 quick questions to see whether you're ready to sit IELTS—or
            should prepare first.
          </p>
          <MiniIELTSAssessment />
        </div>
      </section>

      {/* How Inttlnt Works (4 steps) */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-2xl font-bold mb-8'>How Inttlnt Works</h2>
          <HowItWorks4Steps />
          <div className='mt-8'>
            <Link href='/ielts'>
              <Button>Start with IELTS Readiness →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Storyboard Section */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            See the journey before you start it
          </h2>
          <p className='text-center text-gray-600 mb-6'>
            Here's what success looks like when every stakeholder is aligned.
          </p>
          <Storyboard />
        </div>
      </section>

      {/* Pathway Cards */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <PathwayCards />
        </div>
      </section>

      {/* Channel Partner Teaser */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <ChannelPartnerTeaser />
        </div>
      </section>
    </div>
  )
}
