import Link from 'next/link'
import { ReactNode } from 'react'

interface EmployerLayoutProps {
  children: ReactNode
}

export default function EmployerLayout({ children }: EmployerLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex'>
        <aside className='w-64 bg-navy text-white min-h-screen p-6'>
          <h2 className='text-xl font-bold mb-6'>Employer Dashboard</h2>
          <nav className='space-y-2'>
            <Link
              href='/dashboard/employer'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Candidate Pool Analytics
            </Link>
            <Link
              href='/dashboard/employer/cohorts'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Talent Pipeline
            </Link>
          </nav>
        </aside>
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}
