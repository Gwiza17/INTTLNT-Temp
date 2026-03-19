
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')
  const redirectTo = url.searchParams.get('redirect') || '/dashboard'

  if (!code && !tokenHash) {
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

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'magiclink',
    })
    if (error) {
      console.error('OTP verify error:', error)
      return NextResponse.redirect(new URL('/login?error=magiclink', url.origin))
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Code exchange error:', error)
      return NextResponse.redirect(new URL('/login?error=magiclink', url.origin))
    }
  }

  //Use redirect param instead of hardcoded /dashboard
  return NextResponse.redirect(new URL(redirectTo, url.origin))
}
