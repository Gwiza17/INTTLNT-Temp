import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function PathwayCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-green-600 text-sm font-semibold mb-2">LIVE — Recruiting Now</div>
          <h3 className="text-xl font-bold mb-2">Engineering (Live)</h3>
          <p className="text-gray-600 mb-4">Masters → Canada (Ottawa)</p>
          <Link href="/engineering">
            <Button>Apply Now</Button>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-gray-500 text-sm font-semibold mb-2">Coming 2027</div>
          <h3 className="text-xl font-bold mb-2">Nursing (2027)</h3>
          <p className="text-gray-600 mb-4">Australia Undergraduate + Masters</p>
          <Link href="/nursing">
            <Button variant="outline">Register Interest</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}