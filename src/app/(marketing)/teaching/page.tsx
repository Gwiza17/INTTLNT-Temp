import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function TeachingPage() {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Master of Teaching (STEM) - Canada
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-4'>
            Fast-Tracked Pathway to Teaching Careers in Canada
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

      {/* Program Overview */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Program Overview</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <p className='text-gray-700 mb-4'>
                The Master of Teaching (MT) at the Ontario Institute for Studies
                in Education (OISE), University of Toronto, is one of Canada's
                leading teacher education programs.
              </p>
              <p className='text-gray-700 mb-4'>
                This program prepares graduates to become certified teachers in
                Ontario schools, with strong demand for teachers in STEM
                subjects such as mathematics and science.
              </p>
              <p className='text-gray-700'>
                Graduates of the program are recommended to the Ontario College
                of Teachers (OCT), which qualifies them to teach in Ontario's
                public education system.
              </p>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>Program Details</h3>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Program</td>
                    <td className='py-2'>Master of Teaching (MT)</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Institution</td>
                    <td className='py-2'>OISE, University of Toronto</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Program Length</td>
                    <td className='py-2'>20 months (Full-time)</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Qualification</td>
                    <td className='py-2'>Master of Teaching</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Certification</td>
                    <td className='py-2'>
                      Recommendation to Ontario College of Teachers
                    </td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium'>Teaching Division</td>
                    <td className='py-2'>
                      Intermediate / Senior (Grades 7–12)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Pathway */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Why This Pathway?</h2>
          <p className='text-gray-700 mb-4'>
            Canada continues to expand its education system and requires
            qualified teachers, particularly in:
          </p>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
            {[
              'Mathematics',
              'Physics',
              'Chemistry',
              'Biology',
              'Technology / STEM',
            ].map((item) => (
              <div
                key={item}
                className='bg-white p-3 rounded-lg text-center shadow-sm'
              >
                <span className='text-sm font-medium'>{item}</span>
              </div>
            ))}
          </div>
          <p className='text-gray-700'>
            This pathway allows internationally qualified graduates to:
          </p>
          <ul className='list-disc pl-6 mt-2 space-y-1 text-gray-700'>
            <li>Earn a graduate teaching qualification</li>
            <li>Become eligible for teacher certification in Ontario</li>
            <li>Build a long-term career in Canada's education system</li>
          </ul>
        </div>
      </section>

      {/* STEM Teaching Specialisations */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>
            STEM Teaching Specialisations
          </h2>
          <p className='mb-4'>Common STEM combinations include:</p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
            {[
              'Mathematics + Physics',
              'Mathematics + Computer Science',
              'Biology + Chemistry',
              'Chemistry + General Science',
              'Physics + Mathematics',
            ].map((combo) => (
              <div key={combo} className='bg-gray-50 p-3 rounded-lg'>
                <span className='font-medium'>{combo}</span>
              </div>
            ))}
          </div>
          <p className='text-gray-700'>
            This pathway is particularly suitable for graduates with degrees in:
          </p>
          <div className='flex flex-wrap gap-2 mt-2'>
            {[
              'Engineering',
              'Physics',
              'Mathematics',
              'Computer Science',
              'Science disciplines',
            ].map((item) => (
              <span
                key={item}
                className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Career Pathway */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Career Pathway</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {[
              'Secondary school teacher (Grades 7-12)',
              'STEM educator',
              'Curriculum developer',
              'Education consultant',
              'Educational technology specialist',
            ].map((role) => (
              <div key={role} className='bg-white p-4 rounded-lg shadow-sm'>
                <p className='font-medium text-center'>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Program Structure</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Year 1</h3>
              <ul className='list-disc pl-5 space-y-1'>
                <li>Teaching foundations</li>
                <li>Curriculum design</li>
                <li>Classroom observation</li>
              </ul>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Year 2</h3>
              <ul className='list-disc pl-5 space-y-1'>
                <li>Advanced pedagogy</li>
                <li>Classroom practicum</li>
                <li>Teaching placements in Ontario schools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Estimated Costs & Funding */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>
                Estimated Cost of Study
              </h2>
              <Card>
                <CardContent className='p-6'>
                  <table className='w-full'>
                    <tbody>
                      <tr className='border-b'>
                        <td className='py-2 font-medium'>Tuition</td>
                        <td className='py-2'>~$41,000 per year</td>
                      </tr>
                      <tr className='border-b'>
                        <td className='py-2 font-medium'>Living expenses</td>
                        <td className='py-2'>~$30,000 per year</td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium'>Total (program)</td>
                        <td className='py-2 font-bold'>
                          ~$140,000 – $150,000 CAD
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className='text-2xl font-bold mb-4'>Funding Options</h2>
              <Card>
                <CardContent className='p-6'>
                  <p className='mb-4'>
                    Qualified candidates may be eligible for international
                    student education loans through lenders such as:
                  </p>
                  <ul className='list-disc pl-5 space-y-1 mb-4'>
                    <li>MPOWER Financing</li>
                    <li>Prodigy Finance</li>
                    <li>EdFin</li>
                  </ul>
                  <p>
                    These financing options may cover tuition fees, living
                    expenses, and study related costs.
                  </p>
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
              <p className='mb-4'>Strong candidates typically have:</p>
              <ul className='list-disc pl-5 space-y-2'>
                <li>Bachelor's degree in STEM or related discipline</li>
                <li>Academic average equivalent to 70–75%+</li>
                <li>Strong English proficiency (IELTS / PTE equivalent)</li>
                <li>Evidence of teaching, tutoring or leadership experience</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Inttlnt Advantage */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>The Inttlnt Advantage</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-bold mb-2'>1. Preparation</h3>
                <p>
                  IELTS preparation, candidate screening and pathway guidance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-bold mb-2'>2. Admission & Visa</h3>
                <p>
                  University application support, study permit guidance,
                  pre-departure support
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-bold mb-2'>3. Career Transition</h3>
                <p>
                  Settlement support in Canada, education career guidance,
                  long-term migration strategy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className='py-8 bg-white border-t'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-sm text-gray-500 italic'>
            Important Disclaimer: Admission, financing, and employment outcomes
            depend on the candidate's qualifications and external factors.
            Inttlnt does not guarantee university admission, loan approval, or
            employment outcomes. However, we provide strategic support and
            preparation to help candidates successfully navigate each stage.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className='py-12 bg-blue-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Apply for the Next Intake</h2>
          <p className='text-lg text-gray-700 mb-6'>
            If you are interested in teaching STEM subjects in Canada, this
            pathway may be suitable for you.
          </p>
          <Link href='/eoi?discipline=teaching&destination=canada'>
            <Button size='lg'>Register Your Interest</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
