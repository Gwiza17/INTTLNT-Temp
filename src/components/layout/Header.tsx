'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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
        setIsDropdownOpen(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.dropdown-wrapper')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/livepathways', label: 'Live Pathways', hasDropdown: true },
    { href: '/partner', label: 'Channel Partners' },
    { href: '/ielts', label: 'IELTS Prep' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ]

  const pathwayLinks = [
    {
      href: '/engineering',
      label: 'Engineering Masters → Canada',
      badge: 'LIVE',
    },
    {
      href: '/computer-science',
      label: 'Computer Science → Canada',
      badge: 'LIVE',
    },
    { href: '/teaching', label: 'Teaching (STEM) → Canada', badge: 'LIVE' },
    {
      href: '/nursing',
      label: 'Nursing Practice → Australia',
      badge: 'LIVE ',
    },
  ]

  return (
    <header
      className={`bg-navy border-b border-white/10 sticky top-0 z-50 transition-transform duration-300 ${
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
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className='relative dropdown-wrapper'>
                  <button
                    className='text-white/80 hover:text-white transition text-sm font-medium flex items-center gap-1'
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className='absolute top-full left-0 w-full h-2' />
                      <div className='absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border py-2 z-50'>
                        {pathwayLinks.map((pathway) => (
                          <Link
                            key={pathway.href}
                            href={pathway.href}
                            className='block px-4 py-3 hover:bg-gray-50 transition'
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <div className='flex items-center justify-between'>
                              <span className='text-sm text-gray-900'>
                                {pathway.label}
                              </span>
                              <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
                                {pathway.badge}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-white/80 hover:text-white transition text-sm font-medium'
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            <Link href='/login'>
              <Button
                variant='outline'
                size='sm'
                className='text-white border-white hover:bg-white hover:text-slate-900'
              >
                Login
              </Button>
            </Link>
            <Link href='/eoi'>
              <Button size='sm'>Apply Now</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-white/10 bg-navy'>
            <nav className='flex flex-col space-y-3'>
              <div className='space-y-1'>
                <button
                  className='text-white/80 px-2 py-1 font-medium text-sm flex items-center gap-1 w-full text-left'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Live Pathways
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>
                {isDropdownOpen &&
                  pathwayLinks.map((pathway) => (
                    <Link
                      key={pathway.href}
                      href={pathway.href}
                      className='flex items-center justify-between text-white/70 hover:text-white pl-4 pr-2 py-1 text-sm transition'
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsDropdownOpen(false)
                      }}
                    >
                      <span>{pathway.label}</span>
                      <span className='text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full'>
                        {pathway.badge}
                      </span>
                    </Link>
                  ))}
              </div>

              {navLinks
                .filter((l) => !l.hasDropdown)
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='text-white/80 hover:text-white px-2 py-1 transition text-sm'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

              <div className='flex flex-col space-y-2 pt-4 border-t border-white/10'>
                <Link href='/login' onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant='outline'
                    className='w-full text-white border-white hover:bg-white hover:text-slate-900'
                  >
                    Login
                  </Button>
                </Link>
                <Link href='/eoi' onClick={() => setIsMenuOpen(false)}>
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
