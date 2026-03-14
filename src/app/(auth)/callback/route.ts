import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  // Default fallback if something fails
  let redirectTo = '/dashboard/applicant'

  if (!code) {
    return NextResponse.redirect(new URL(redirectTo, url.origin))
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

  // Exchange magic link code for a session
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

  // Link applicant/stakeholder records (idempotent)
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

  // Fetch stakeholder to determine role
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('roles, status')
    .eq('user_id', userId)
    .maybeSingle()

  // Determine redirect based on stakeholder status/role
  if (stakeholder) {
    if (stakeholder.status !== 'approved') {
      redirectTo = '/dashboard/pending'
    } else if (stakeholder.roles.length > 0) {
      redirectTo = `/dashboard/${stakeholder.roles[0].replaceAll('_', '-')}`
    }
  }

  return NextResponse.redirect(new URL(redirectTo, url.origin))
}
