import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const redirectParam = url.searchParams.get('redirect') || '/dashboard'

  if (!code) {
    return NextResponse.redirect(new URL(redirectParam, url.origin))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  )

  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !session?.user?.email) {
    console.error('Magic link error:', error)
    return NextResponse.redirect(new URL('/login?error=magiclink', url.origin))
  }

  const userId = session.user.id
  const email = session.user.email

  await supabase
    .from('applicants')
    .update({ user_id: userId })
    .eq('email', email)
    .neq('user_id', userId)

  await supabase
    .from('stakeholders')
    .update({ user_id: userId })
    .eq('email', email)
    .is('user_id', null)

  // Redirect to /dashboard and let middleware handle role-based routing
  return NextResponse.redirect(new URL('/dashboard', url.origin))
}
