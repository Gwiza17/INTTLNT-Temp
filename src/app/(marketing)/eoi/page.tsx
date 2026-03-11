import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EOIForm from '@/components/forms/EOIForm'

interface EOIPageProps {
  searchParams?: {
    discipline?: string | string[]
    destination?: string | string[]
    code?: string | string[]
    pathway?: string | string[]
    market?: string | string[]
  }
}

export default async function EOIPage({ searchParams }: EOIPageProps) {
  // Check auth before the user sees anything — eliminates the double-submit loop
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Rebuild the full query string so they land back exactly where they were
    const params = new URLSearchParams()
    if (typeof searchParams?.code === 'string')
      params.set('code', searchParams.code)
    if (typeof searchParams?.discipline === 'string')
      params.set('discipline', searchParams.discipline)
    if (typeof searchParams?.destination === 'string')
      params.set('destination', searchParams.destination)
    if (typeof searchParams?.pathway === 'string')
      params.set('pathway', searchParams.pathway)
    if (typeof searchParams?.market === 'string')
      params.set('market', searchParams.market)

    const returnTo = params.toString() ? `/eoi?${params.toString()}` : '/eoi'
    redirect(`/login?redirect=${encodeURIComponent(returnTo)}`)
  }

  // Everything below is unchanged from your original
  const discipline =
    typeof searchParams?.discipline === 'string'
      ? searchParams.discipline
      : typeof searchParams?.pathway === 'string'
        ? searchParams.pathway
        : undefined

  const destination =
    typeof searchParams?.destination === 'string'
      ? searchParams.destination
      : typeof searchParams?.market === 'string'
        ? searchParams.market
        : undefined

  const referralCode =
    typeof searchParams?.code === 'string' ? searchParams.code : undefined

  const initialPathway =
    discipline && destination ? { discipline, destination } : undefined

  return (
    <div className='max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold mb-2'>Expression of Interest</h1>
      <p className='text-gray-600 mb-6'>
        Tell us about yourself – it takes about 5 minutes.
      </p>
      <Suspense fallback={<div>Loading form...</div>}>
        <EOIForm
          initialPathway={initialPathway}
          initialReferralCode={referralCode}
        />
      </Suspense>
    </div>
  )
}
