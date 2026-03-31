import Link from 'next/link'
import { ReactNode } from 'react'

interface EducationProviderLayoutProps {
  children: ReactNode
}

export default function EducationProviderLayout({
  children,
}: EducationProviderLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex'>
        <aside className='w-64 bg-navy text-white min-h-screen p-6'>
          <h2 className='text-xl font-bold mb-6'>
            Education Provider Dashboard
          </h2>
          <nav className='space-y-2'>
            <Link
              href='/dashboard/education-provider'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              My Cohorts
            </Link>
            <Link
              href='/dashboard/education-provider/cohorts'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Cohort Marketplace
            </Link>
            <Link
              href='/dashboard/education-provider/analytics'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Pipeline Analytics
            </Link>
          </nav>
        </aside>
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}
