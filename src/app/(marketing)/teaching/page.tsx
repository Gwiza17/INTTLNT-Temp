import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function TeachingPage() {
  return (
    <div className='bg-white'>
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Master of Teaching (STEM) - Canada
          </h1>
          <p className='text-xl text-gray-600 mb-2'>
            Pathway to Certified Teaching Careers
          </p>
          <p className='text-lg text-gray-700 mb-8'>Study. Qualify. Teach.</p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/eoi?discipline=teaching&destination=canada'>
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

      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Why This Pathway?</h2>
          <p className='mb-4'>There is ongoing demand for teachers in:</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
            {[
              'Mathematics',
              'Science (Physics, Chemistry, Biology)',
              'Technology education',
            ].map((item) => (
              <div
                key={item}
                className='bg-white p-4 rounded-lg shadow-sm text-center'
              >
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p>
            This pathway leads to teacher certification and classroom
            employment.
          </p>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Program Overview</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <p>
                The Master of Teaching (STEM) prepares graduates to become
                certified teachers in Canada, particularly in high-demand
                subjects such as mathematics and science.
              </p>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>Program Details</h3>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Duration</td>
                    <td>~20 months</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Structure</td>
                    <td>Coursework + practicum</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium'>Outcome</td>
                    <td>Teacher certification pathway</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Typical Course Structure</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              'Curriculum and instruction',
              'Learning theory and pedagogy',
              'Educational psychology',
              'Classroom management',
              'Teaching practicum (real classrooms)',
            ].map((item) => (
              <div key={item} className='bg-white p-4 rounded-lg shadow-sm'>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Career Outcomes</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              'Secondary school teacher',
              'STEM educator',
              'Curriculum specialist',
              'Education consultant',
            ].map((role) => (
              <div key={role} className='bg-gray-50 p-4 rounded-lg text-center'>
                <p className='font-medium'>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>Estimated Cost</h2>
              <Card>
                <CardContent className='p-6'>
                  <p className='text-3xl font-bold'>$130,000 - $150,000 CAD</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className='text-2xl font-bold mb-4'>University Panel</h2>
              <Card>
                <CardContent className='p-6'>
                  <ul className='list-disc pl-5'>
                    <li>University of Toronto (OISE)</li>
                    <li>University of Ottawa</li>
                    <li>York University</li>
                    <li>Ontario Tech University</li>
                    <li>University of Alberta</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Candidate Profile</h2>
          <Card>
            <CardContent className='p-6'>
              <ul className='list-disc pl-5'>
                <li>STEM degree (Math, Science, Engineering)</li>
                <li>Strong academic record (70%+)</li>
                <li>IELTS 7.0+</li>
                <li>Teaching or mentoring experience preferred</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className='py-12 bg-blue-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>
            Fast-tracked, funded and supported.
          </h2>
          <Link href='/eoi?discipline=teaching&destination=canada'>
            <Button size='lg'>Apply Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
