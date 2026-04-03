import Link from 'next/link'
import { ReactNode } from 'react'
import { SignOutButton } from '@/components/auth/SignOutButton'

interface ApplicantLayoutProps {
  children: ReactNode
}

export default function ApplicantLayout({ children }: ApplicantLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex'>
        <aside className='w-64 bg-navy text-white min-h-screen p-6 flex flex-col'>
          <h2 className='text-xl font-bold mb-6'>My Dashboard</h2>
          <nav className='space-y-2 flex-1'>
            <Link
              href='/dashboard/applicant'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Overview
            </Link>
          </nav>
          <div className='pt-6 border-t border-white/10'>
            <SignOutButton />
          </div>
        </aside>
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}
