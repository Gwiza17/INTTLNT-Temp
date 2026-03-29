import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function ComputerSciencePage() {
  return (
    <div className='bg-white'>
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Master of Computer Science - Canada
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-2'>
            Fast-Tracked Pathway to Global Tech Careers
          </p>
          <p className='text-lg text-gray-700 mb-8'>Study. Build. Scale.</p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/eoi?discipline=computer-science&destination=canada'>
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
          <p className='text-gray-700 mb-4'>
            Canada's technology sector is growing rapidly across:
          </p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
            {[
              'Artificial Intelligence',
              'Cybersecurity',
              'Software Engineering',
              'Data Science',
            ].map((item) => (
              <div
                key={item}
                className='bg-white p-4 rounded-lg shadow-sm text-center'
              >
                <span className='font-medium'>{item}</span>
              </div>
            ))}
          </div>
          <p className='text-gray-700'>
            Graduates access one of the world's most dynamic tech ecosystems.
          </p>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Program Overview</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <p className='text-gray-700 mb-4'>
                The Master of Computer Science prepares graduates for
                high-demand roles in software, AI, cybersecurity and data
                systems.
              </p>
              <p className='text-gray-700'>
                Programs combine advanced computing theory with applied industry
                experience.
              </p>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>Program Details</h3>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Duration</td>
                    <td>1.5 - 2 years</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Structure</td>
                    <td>Coursework / Project / Thesis</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium'>Industry</td>
                    <td>Co-op / research opportunities</td>
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
              'Algorithms and data structures',
              'Machine learning & AI',
              'Distributed systems',
              'Cybersecurity',
              'Software engineering',
              'Research project or thesis',
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
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            {[
              'Software Engineer',
              'Data Scientist',
              'Machine Learning Engineer',
              'Cybersecurity Analyst',
              'Cloud Engineer',
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
                  <p className='text-3xl font-bold'>$110,000 - $130,000 CAD</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className='text-2xl font-bold mb-4'>University Panel</h2>
              <Card>
                <CardContent className='p-6'>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Carleton University</li>
                    <li>University of Toronto</li>
                    <li>University of Waterloo</li>
                    <li>Simon Fraser University</li>
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
              <ul className='list-disc pl-5 space-y-2'>
                <li>Computer Science / IT / Engineering degree</li>
                <li>Programming experience</li>
                <li>IELTS 7.0+</li>
                <li>Strong analytical ability</li>
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
          <Link href='/eoi?discipline=computer-science&destination=canada'>
            <Button size='lg'>Apply Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
