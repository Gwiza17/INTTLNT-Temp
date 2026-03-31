import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/marketplace/cohorts
// Optional query params: discipline, destination, country_of_origin
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = request.nextUrl

  let query = supabase
    .from('cohorts')
    .select('*')
    .eq('is_active', true)
    .order('discipline')
    .order('country_of_origin')

  const discipline = searchParams.get('discipline')
  const destination = searchParams.get('destination')
  const country = searchParams.get('country')

  if (discipline) query = query.eq('discipline', discipline)
  if (destination) query = query.eq('destination', destination)
  if (country)     query = query.eq('country_of_origin', country)

  const { data: cohorts, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cohorts: cohorts ?? [] })
}
