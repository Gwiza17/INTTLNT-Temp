'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
        setIsMenuOpen(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

 const navLinks = [
   { href: '/', label: 'Home' },
   { href: '/ielts', label: 'IELTS Preparation' },
   { href: '/engineering', label: 'Engineering (Canada)' },
   { href: '/computer-science', label: 'CS (Canada)' },
   { href: '/teaching', label: 'Teaching (Canada)' },
   { href: '/nursing', label: 'Nursing (2027)' },
   { href: '/partner', label: 'Channel Partners' },
   { href: '/faq', label: 'FAQ' },
 ]
  return (
    <header
      className={`bg-slate-900 border-b border-white/10 sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='text-xl font-bold text-white'>
            INTTLNT
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-white/80 hover:text-white transition text-sm font-medium'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            <Link href='/login'>
              <Button size='sm' className='bg-white text-slate-900 hover:bg-gray-200'>
                Login
              </Button>
            </Link>
            <Link href='/engineering'>
              <Button size='sm'>Apply Now</Button>
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className='md:hidden text-white p-2'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
            aria-expanded={isMenuOpen}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-white/10 bg-slate-900'>
            <nav className='flex flex-col space-y-3'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-white/80 hover:text-white px-2 py-1 transition'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className='flex flex-col space-y-2 pt-4 border-t border-white/10'>
                <Link href='/login' onClick={() => setIsMenuOpen(false)}>
                  <Button className='w-full bg-white text-slate-900 hover:bg-gray-200'>
                    Login
                  </Button>
                </Link>
                <Link href='/engineering' onClick={() => setIsMenuOpen(false)}>
                  <Button className='w-full'>Apply Now</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}