'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push(redirect)
      }
    }
    checkUser()
  }, [router, redirect, supabase])

  useEffect(() => {
    const handleHashToken = async () => {
      if (typeof window === 'undefined') return
      if (!window.location.hash.includes('access_token')) return

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        window.location.replace('/dashboard')
      }
    }

    handleHashToken()
  }, [supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirectTo: redirect }),
    })

    if (!res.ok) {
      setMessage('Something went wrong. Please try again.')
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardContent className='p-8'>
          <div className='text-center mb-6'>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              Sign in to INTTLNT
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              We'll send a magic link to your email.
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleLogin}>
            <Input
              label='Email address'
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              autoComplete='email'
            />

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Sending...' : 'Send magic link'}
            </Button>

            {message && (
              <div className='mt-4 text-center text-sm text-gray-600 bg-blue-50 p-3 rounded'>
                {message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-gray-500'>Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
