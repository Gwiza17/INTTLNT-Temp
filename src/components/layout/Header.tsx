'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='bg-white shadow-sm'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-xl font-bold text-gray-900'>
              INTTLNT
            </Link>
            <div className='hidden md:ml-10 md:flex md:space-x-8'>
              <Link
                href='/engineering'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'
              >
                Engineering
              </Link>
              <Link
                href='/nursing'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'
              >
                Nursing
              </Link>
              <Link
                href='/ielts'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'
              >
                IELTS
              </Link>
              <Link
                href='/partner'
                className='text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium'
              >
                Partners
              </Link>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Link href='/login'>
              <Button variant='outline' size='sm'>
                Sign In
              </Button>
            </Link>
            <Link href='/eoi'>
              <Button size='sm'>Start EOI</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
