import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ChannelPartnerTeaser() {
  return (
    <div className="bg-blue-50 p-6 rounded-lg text-center">
      <h3 className="text-xl font-semibold mb-2">Are you an association, registration body, or alumni network?</h3>
      <p className="text-gray-600 mb-4">Help your members access verified pathways and track progress transparently.</p>
      <Link href="/partner">
        <Button>Become a Channel Partner</Button>
      </Link>
    </div>
  )
}