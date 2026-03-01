import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS, used only for routing decisions
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname
  console.log('middleware user:', user?.email, 'path:', path)

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

  if (!user && !isPublic) {
    url.pathname = '/login'
    url.searchParams.set('redirect', path + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  if (user && path === '/login') {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  if (user && path === '/dashboard') {
    const db = getServiceClient()

    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles, status')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('user.id:', user.id)
    console.log('stakeholder:', JSON.stringify(stakeholder))

    if (
      stakeholder &&
      stakeholder.status === 'approved' &&
      stakeholder.roles.length > 0
    ) {
      const role = stakeholder.roles[0]
      url.pathname = `/dashboard/${role}`
      return NextResponse.redirect(url)
    }

    const { data: applicant } = await db
      .from('applicants')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('applicant:', JSON.stringify(applicant))

    if (applicant) {
      url.pathname = '/dashboard/applicant'
      return NextResponse.redirect(url)
    }

    url.pathname = '/dashboard/pending'
    return NextResponse.redirect(url)
  }

  // Role-based route protection — also use service client
  if (user && path.startsWith('/dashboard/admin')) {
    const db = getServiceClient()
    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('admin')) {
      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  if (user && path.startsWith('/dashboard/funder')) {
    const db = getServiceClient()
    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('funder')) {
      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  if (user && path.startsWith('/dashboard/migration-agent')) {
    const db = getServiceClient()
    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('migration_agent')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  if (user && path.startsWith('/dashboard/education-provider')) {
    const db = getServiceClient()
    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('education_provider')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  if (user && path.startsWith('/dashboard/employer')) {
    const db = getServiceClient()
    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('employer')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  if (user && path.startsWith('/dashboard/channel-partner')) {
    const db = getServiceClient()
    const { data: stakeholder } = await db
      .from('stakeholders')
      .select('roles')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!stakeholder || !stakeholder.roles.includes('channel_partner')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
