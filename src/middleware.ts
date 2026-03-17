import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/middleware'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function linkAndGetStakeholder(userId: string, email: string | null) {
  const db = getServiceClient()

  if (email) {
    await db
      .from('applicants')
      .update({ user_id: userId })
      .eq('email', email)
      .neq('user_id', userId)

    await db
      .from('stakeholders')
      .update({ user_id: userId })
      .eq('email', email)
      .is('user_id', null)
  }

  const { data: stakeholder } = await db
    .from('stakeholders')
    .select('roles, status')
    .eq('user_id', userId)
    .maybeSingle()

  return stakeholder
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  const publicRoutes = [
    '/',
    '/login',
    '/callback',
    '/faq',
    '/eoi',
    '/eoi/success',
    '/engineering',
    '/nursing',
    '/ielts',
    '/partner',
    '/partner/apply',
    '/partner/demo',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ]
  const isPublic = publicRoutes.some((route) =>
    route === '/' ? path === '/' : path.startsWith(route),
  )

  if (!user && !isPublic) {
    url.pathname = '/login'
    url.searchParams.set('redirect', path + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  if (path.startsWith('/callback')) {
    return response
  }

  if (user && path === '/login') {
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Only redirect on exact /dashboard — sub-paths are already resolved
  if (user && path === '/dashboard') {
    const stakeholder = await linkAndGetStakeholder(user.id, user.email ?? null)

    if (stakeholder?.status === 'approved' && stakeholder.roles.length > 0) {
      const rolePath = stakeholder.roles[0].replaceAll('_', '-')
      url.pathname = `/dashboard/${rolePath}`
      return NextResponse.redirect(url)
    }

    if (stakeholder && stakeholder.status !== 'approved') {
      url.pathname = '/dashboard/pending'
      return NextResponse.redirect(url)
    }

    url.pathname = '/dashboard/applicant'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
