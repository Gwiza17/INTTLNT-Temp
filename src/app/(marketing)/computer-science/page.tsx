import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function ComputerSciencePage() {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-b from-blue-50 to-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Master of Computer Science - Canada
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mb-4'>
            Fast-Tracked Pathway to Global Technology Careers
          </p>
          <p className='text-lg text-gray-700 mb-8'>Study. Build. Innovate.</p>
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

      {/* Program Overview */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Program Overview</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <p className='text-gray-700 mb-4'>
                The Master of Computer Science (MCS) at Carleton University
                prepares graduates for advanced careers in software engineering,
                artificial intelligence, cybersecurity, and data systems.
              </p>
              <p className='text-gray-700 mb-4'>
                The program is delivered through the Ottawa-Carleton Institute
                for Computer Science, a joint graduate institute between
                Carleton University and the University of Ottawa.
              </p>
              <p className='text-gray-700'>
                Graduates gain advanced technical expertise and access to one of
                Canada's strongest technology ecosystems.
              </p>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>Program Details</h3>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Program</td>
                    <td className='py-2'>Master of Computer Science (MCS)</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Institution</td>
                    <td className='py-2'>Carleton University</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Location</td>
                    <td className='py-2'>Ottawa, Canada</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Program Length</td>
                    <td className='py-2'>~2 years</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-2 font-medium'>Study Mode</td>
                    <td className='py-2'>Full-time</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium'>Industry Exposure</td>
                    <td className='py-2'>Co-op opportunities available</td>
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
            Technology talent is in global demand. Canada continues to expand
            its technology sector across:
          </p>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
            {[
              'Artificial Intelligence',
              'Cybersecurity',
              'Software Engineering',
              'Cloud Computing',
              'Data Science',
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
            This pathway allows internationally qualified candidates to:
          </p>
          <ul className='list-disc pl-6 mt-2 space-y-1 text-gray-700'>
            <li>Earn a globally recognised computer science degree</li>
            <li>Gain access to Canada's growing technology job market</li>
            <li>Build a long-term career in software and AI industries</li>
          </ul>
        </div>
      </section>

      {/* Specialisation Areas */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Specialisation Areas</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {[
              'Artificial Intelligence',
              'Machine Learning',
              'Data Science',
              'Software Engineering',
              'Cybersecurity',
              'Distributed Systems',
              'Algorithms and Theory',
            ].map((item) => (
              <div key={item} className='bg-gray-50 p-3 rounded-lg'>
                <span className='font-medium'>{item}</span>
              </div>
            ))}
          </div>
          <p className='mt-6 text-gray-700'>
            The program is particularly suited for candidates with undergraduate
            degrees in:
          </p>
          <div className='flex flex-wrap gap-2 mt-2'>
            {[
              'Computer Science',
              'Software Engineering',
              'Electrical Engineering',
              'Information Technology',
              'Mathematics',
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

      {/* Career Pathways */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Career Pathways</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {[
              'Software Engineer',
              'Machine Learning Engineer',
              'Data Scientist',
              'Cybersecurity Analyst',
              'Cloud Architect',
              'Systems Engineer',
            ].map((role) => (
              <div key={role} className='bg-white p-4 rounded-lg shadow-sm'>
                <p className='font-medium text-center'>{role}</p>
              </div>
            ))}
          </div>
          <p className='mt-6 text-gray-700'>
            Technology professionals remain among the most in-demand workers
            globally.
          </p>
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
                <li>Advanced computer science coursework</li>
                <li>Research preparation</li>
                <li>Specialisation selection</li>
              </ul>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Year 2</h3>
              <ul className='list-disc pl-5 space-y-1'>
                <li>Research project or thesis</li>
                <li>Industry collaboration</li>
                <li>Co-op opportunities (optional)</li>
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
                        <td className='py-2'>~$26,600 per year</td>
                      </tr>
                      <tr className='border-b'>
                        <td className='py-2 font-medium'>Living expenses</td>
                        <td className='py-2'>~$30,000 per year</td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium'>Total (2 years)</td>
                        <td className='py-2 font-bold'>
                          ~$110,000 – $120,000 CAD
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
                    International students may qualify for education financing
                    through providers such as:
                  </p>
                  <ul className='list-disc pl-5 space-y-1 mb-4'>
                    <li>MPOWER Financing</li>
                    <li>Prodigy Finance</li>
                    <li>EdFin</li>
                  </ul>
                  <p>
                    Loans may help cover tuition fees, living expenses, and
                    study related costs.
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
                <li>Bachelor's degree in Computer Science or related field</li>
                <li>Academic average equivalent to 70–75%+</li>
                <li>English proficiency (IELTS / PTE equivalent)</li>
                <li>
                  Programming experience in languages such as Python, Java, or
                  C++
                </li>
              </ul>
              <p className='mt-4'>
                Candidates with professional experience in software development
                or data analysis are also strong applicants.
              </p>
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
                  English readiness support, profile assessment and pathway
                  guidance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-bold mb-2'>2. Admission & Visa</h3>
                <p>University application support, study permit preparation</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-bold mb-2'>3. Career Transition</h3>
                <p>
                  Settlement guidance in Canada, technology career preparation,
                  global mobility strategy
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
            Important Disclaimer: Admission, financing and employment outcomes
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
          <h2 className='text-3xl font-bold mb-4'>Start Your Application</h2>
          <p className='text-lg text-gray-700 mb-6'>
            If you are interested in building a global technology career in
            Canada, this pathway may be suitable for you.
          </p>
          <Link href='/eoi?discipline=computer-science&destination=canada'>
            <Button size='lg'>Register Your Interest</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
