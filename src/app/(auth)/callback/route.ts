import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )

  if (code) {
    // ✅ Use exchangeCodeForSession for SSR / magic link
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Magic link session error:', error)
      return NextResponse.redirect(
        new URL('/login?error=magiclink', requestUrl.origin),
      )
    }

    // Optionally link DB records (applicants / stakeholders)
    if (session?.user?.email) {
      await supabase
        .from('applicants')
        .update({ user_id: session.user.id })
        .eq('email', session.user.email)
        .neq('user_id', session.user.id)

      await supabase
        .from('stakeholders')
        .update({ user_id: session.user.id })
        .eq('email', session.user.email)
        .is('user_id', null)
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
