import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'

  console.log('Callback route hit', { code, redirectTo })

  if (!code) {
    // If no code, redirect to home
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          },
        },
      },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Exchange error:', error)
      // Redirect to login with error
      return NextResponse.redirect(
        new URL('/login?error=Unable to sign in', requestUrl.origin),
      )
    }

    // Success: redirect to intended page
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.redirect(
      new URL('/login?error=Unexpected error', requestUrl.origin),
    )
  }
}
