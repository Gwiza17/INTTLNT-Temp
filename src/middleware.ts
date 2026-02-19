import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  // Define public routes (accessible without login)
  const publicRoutes = [
    '/',
    '/login',
    '/callback',
    '/engineering',
    '/nursing',
    '/ielts',
    '/partner',
    '/eoi',
  ]
  const isPublic = publicRoutes.some((route) => path.startsWith(route))

  // If user is not logged in and trying to access protected route, redirect to login
  if (!user && !isPublic && path.startsWith('/dashboard')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (user && path === '/login') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
