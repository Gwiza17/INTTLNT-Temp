import { Suspense } from 'react'
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

export default function EOIPage({ searchParams }: EOIPageProps) {
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
