import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function EngineeringPracticePage() {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Master of Engineering Practice - Canada
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-2'>
            Fast-Tracked Pathway to Engineering Careers
          </p>
          <p className='text-lg text-gray-700 mb-8'>Study. Practice. Lead.</p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/eoi?discipline=engineering-practice&destination=canada'>
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

      {/* Why This Pathway */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Why This Pathway?</h2>
          <p className='text-gray-700 mb-4'>
            Canada continues to invest heavily in:
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            {[
              'Infrastructure and construction',
              'Energy and renewables',
              'Manufacturing and automation',
            ].map((item) => (
              <div
                key={item}
                className='bg-white p-4 rounded-lg shadow-sm text-center'
              >
                <span className='font-medium'>{item}</span>
              </div>
            ))}
          </div>
          <p className='text-gray-700'>This pathway enables you to:</p>
          <ul className='list-disc pl-6 mt-2 space-y-1 text-gray-700'>
            <li>Gain a Canadian engineering qualification</li>
            <li>Build industry-ready experience</li>
            <li>Transition into professional engineering roles</li>
          </ul>
        </div>
      </section>

      {/* Program Overview */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Program Overview</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <p className='text-gray-700 mb-4'>
                The Master of Engineering Practice is designed for engineers
                looking to transition into global careers in Canada.
              </p>
              <p className='text-gray-700'>
                This program combines technical engineering with real-world
                application and business skills, preparing graduates for
                industry roles across infrastructure, energy, and technology
                sectors.
              </p>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>Program Details</h3>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Duration</td>
                    <td className='py-2'>2 years</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Structure</td>
                    <td className='py-2'>Coursework + applied practice</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium'>Outcome</td>
                    <td className='py-2'>
                      Industry-ready engineering professional
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Typical Course Structure</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              'Engineering systems & design',
              'Project management & delivery',
              'Applied engineering analytics',
              'Business and leadership for engineers',
              'Industry project / capstone',
            ].map((item) => (
              <div key={item} className='bg-white p-4 rounded-lg shadow-sm'>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Outcomes */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Career Outcomes</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              'Project Engineer',
              'Mechanical / Civil Engineer',
              'Systems Engineer',
              'Engineering Consultant',
            ].map((role) => (
              <div key={role} className='bg-gray-50 p-4 rounded-lg text-center'>
                <p className='font-medium'>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Costs & University Panel */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>Estimated Cost</h2>
              <Card>
                <CardContent className='p-6'>
                  <p className='text-3xl font-bold text-gray-900'>
                    $140,000 - $160,000 CAD
                  </p>
                  <p className='text-gray-600 mt-2'>
                    (total, tuition + living)
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className='text-2xl font-bold mb-4'>University Panel</h2>
              <Card>
                <CardContent className='p-6'>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Carleton University</li>
                    <li>University of Waterloo</li>
                    <li>University of Alberta</li>
                    <li>University of Calgary</li>
                    <li>University of Ottawa</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Profile */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Candidate Profile</h2>
          <Card>
            <CardContent className='p-6'>
              <ul className='list-disc pl-5 space-y-2'>
                <li>Engineering degree (70%+)</li>
                <li>2+ years experience preferred</li>
                <li>IELTS 7.0+</li>
                <li>Financial capacity for upfront costs</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Inttlnt Advantage */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-2xl font-bold mb-6'>The Inttlnt Advantage</h2>
          <div className='flex flex-wrap justify-center gap-4'>
            {['Preparation', 'Admission', 'Funding', 'Visa', 'Career'].map(
              (step, index) => (
                <div
                  key={step}
                  className='bg-white px-6 py-3 rounded-full shadow-sm'
                >
                  <span className='font-medium'>
                    {index + 1}. {step}
                  </span>
                </div>
              ),
            )}
          </div>
          <p className='text-gray-700 mt-6'>
            We manage your journey from start to success.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className='py-12 bg-blue-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>
            Fast-tracked, funded and supported.
          </h2>
          <p className='text-lg text-gray-700 mb-6'>
            Start your engineering career in Canada today.
          </p>
          <Link href='/eoi?discipline=engineering-practice&destination=canada'>
            <Button size='lg'>Apply Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
