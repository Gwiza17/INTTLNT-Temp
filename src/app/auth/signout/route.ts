import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
export async function POST(request: Request) {
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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {}
        },
      },
    },
  )

  await supabase.auth.signOut()

  const response = NextResponse.redirect(new URL('/', request.url))

  // Clear the auth cookies on the response itself
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.includes('auth-token') || cookie.name.includes('sb-')) {
      response.cookies.delete(cookie.name)
    }
  })

  return response
}
