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
    '/eoi',
    '/eoi/success',
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

  // If user is logged in and at /dashboard, redirect to role-specific dashboard
  if (user && path === '/dashboard') {
    const { data: stakeholder } = await supabase
      .from('stakeholders')
      .select('roles, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (
      stakeholder &&
      stakeholder.status === 'approved' &&
      stakeholder.roles.length > 0
    ) {
      const role = stakeholder.roles[0]
      url.pathname = `/dashboard/${role}`
      return NextResponse.redirect(url)
    }

    // Then check applicant
    const { data: applicant } = await supabase
      .from('applicants')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (applicant) {
      url.pathname = '/dashboard/applicant'
      return NextResponse.redirect(url)
    }

    url.pathname = '/dashboard/pending'
    return NextResponse.redirect(url)
  }

  // Protect admin routes: only allow users with admin role
  if (user && path.startsWith('/dashboard/admin')) {
    const { data: stakeholder } = await supabase
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('admin')) {
      // Not an admin – redirect to /dashboard which will further redirect to their role
      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
