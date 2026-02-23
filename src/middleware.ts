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
  console.log('middleware user:', user?.email, 'path:', path)

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/callback',
    '/engineering',
    '/nursing',
    '/ielts',
    '/partner',
    '/faq',
  ]
  const isPublic = publicRoutes.some((route) =>
    route === '/' ? path === '/' : path.startsWith(route),
  )

  // If user is not logged in and route is protected, redirect to login
  // preserving the full path + query string so they return to the right place
  if (!user && !isPublic) {
    url.pathname = '/login'
    url.searchParams.set('redirect', path + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login, redirect to dashboard
  if (user && path === '/login') {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
