import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-sm font-semibold text-gray-600 tracking-wider uppercase'>
              About
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  href='/about'
                  className='text-gray-500 hover:text-gray-900'
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href='/team'
                  className='text-gray-500 hover:text-gray-900'
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-600 tracking-wider uppercase'>
              Pathways
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  href='/engineering'
                  className='text-gray-500 hover:text-gray-900'
                >
                  Engineering (Canada)
                </Link>
              </li>
              <li>
                <Link
                  href='/nursing'
                  className='text-gray-500 hover:text-gray-900'
                >
                  Nursing (Australia)
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-600 tracking-wider uppercase'>
              Resources
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  href='/ielts'
                  className='text-gray-500 hover:text-gray-900'
                >
                  IELTS
                </Link>
              </li>
              <li>
                <Link href='/faq' className='text-gray-500 hover:text-gray-900'>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-600 tracking-wider uppercase'>
              Legal
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  href='/privacy'
                  className='text-gray-500 hover:text-gray-900'
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-gray-500 hover:text-gray-900'
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t pt-8 text-center text-gray-400'>
          &copy; {new Date().getFullYear()} INTTLNT. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
