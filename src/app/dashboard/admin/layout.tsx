import Link from 'next/link'
import { ReactNode } from 'react'
import { SignOutButton } from '@/components/auth/SignOutButton'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex'>
        <aside className='w-64 bg-navy text-white min-h-screen p-6 flex flex-col'>
          <h2 className='text-xl font-bold mb-6'>Admin Dashboard</h2>
          <nav className='space-y-2 flex-1'>
            <Link
              href='/dashboard/admin'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Overview
            </Link>
            <Link
              href='/dashboard/admin/cases'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Cases
            </Link>
            <Link
              href='/dashboard/admin/stakeholders'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Stakeholders
            </Link>
            <Link
              href='/dashboard/admin/stages'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Stages
            </Link>
            <Link
              href='/dashboard/admin/analytics'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Analytics
            </Link>
            <Link
              href='/dashboard/admin/audit'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Audit Logs
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
