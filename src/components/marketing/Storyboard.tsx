import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const characters = [
  { name: 'Amina', role: 'Channel Partner', desc: 'promotes the program locally' },
  { name: 'Tawanda', role: 'Applicant', desc: 'wants to migrate via education' },
  { name: 'Rudo', role: 'Spouse — Nurse', desc: 'strengthens household readiness' },
  { name: 'Priya', role: 'Inttlnt Admin', desc: 'orchestrates each milestone' },
  { name: 'Kofi', role: 'Funder', desc: 'reviews eligible, fundable profiles' },
  { name: 'Sophie', role: 'Education Provider', desc: 'issues admission outcomes' },
  { name: 'Michael', role: 'Migration Agent', desc: 'executes visa milestones' },
]

const journeySteps = [
  'Amina shares a referral link to a webinar for the Engineering pathway.',
  'Tawanda visits the Inttlnt website, completes the mini IELTS readiness check, and registers interest.',
  'He creates an account and submits his intake profile (degree, GPA, experience, funds, IELTS status).',
  'Inttlnt automatically routes him to Apply Now (if IELTS ≥ 7.0 and financially ready) or into IELTS nurturing.',
  'Tawanda completes a full IELTS assessment and uses exam availability search to plan the earliest feasible test date.',
  'Tawanda invites Rudo to add her profile. Inttlnt generates a Couples Readiness Score.',
  'Once eligible, Priya invites Kofi (Funder) to review the portfolio and issue a conditional offer.',
  'Priya generates an admission pack for Sophie (Education Provider), including conditional finance evidence.',
  'When offers become unconditional, Michael (Migration Agent) runs visa documentation, medicals, biometrics, and submission milestones.',
  'Tawanda relocates with a clear checklist. Everyone sees progress, accountability, and what’s next.',
]

export default function Storyboard() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">See the journey before you start it.</h3>
      <p className="text-gray-600 mb-6">Here's what success looks like when every stakeholder is aligned.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Characters</h4>
          <ul className="space-y-2">
            {characters.map((c) => (
              <li key={c.name} className="text-sm">
                <span className="font-medium">{c.name}</span> ({c.role}): {c.desc}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Journey</h4>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            {journeySteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link href="/ielts">
          <Button>Check IELTS Readiness → Apply (if eligible)</Button>
        </Link>
      </div>
    </div>
  )
}