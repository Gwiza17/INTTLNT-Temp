import Link from 'next/link'
import { ReactNode } from 'react'
import { SignOutButton } from '@/components/auth/SignOutButton'

interface PartnerLayoutProps {
  children: ReactNode
}

export default function PartnerLayout({ children }: PartnerLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex'>
        <aside className='w-64 bg-navy text-white min-h-screen p-6 flex flex-col'>
          <h2 className='text-xl font-bold mb-6'>Partner Dashboard</h2>
          <nav className='space-y-2 flex-1'>
            <Link
              href='/dashboard/channel-partner'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Overview
            </Link>
            <Link
              href='/dashboard/channel-partner/referrals'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              My Referrals
            </Link>
            <Link
              href='/dashboard/channel-partner/invites'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Send Invites
            </Link>
            <Link
              href='/dashboard/channel-partner/links'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Generate Links
            </Link>
            <Link
              href='/dashboard/channel-partner/cohorts'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Cohort Marketplace
            </Link>
            <Link
              href='/dashboard/channel-partner/analytics'
              className='block py-2 px-4 rounded hover:bg-white/10'
            >
              Analytics
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
