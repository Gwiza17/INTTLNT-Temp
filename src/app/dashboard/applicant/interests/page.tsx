'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Bell, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface InterestRecord {
  id: string
  status: 'pending' | 'approved' | 'declined'
  expressed_at: string
  stakeholder_note: string | null
  stakeholders: { name: string; org: string; roles: string[] } | null
  candidate_marketplace_profiles: {
    candidate_ref: string
    discipline: string
    cohorts: { name: string; destination: string } | null
  } | null
}

const STATUS_STYLE = {
  pending:  { bg: 'bg-amber-50  border-amber-200',  text: 'text-amber-700',  Icon: Clock,         label: 'Pending your response' },
  approved: { bg: 'bg-green-50  border-green-200',  text: 'text-green-700',  Icon: CheckCircle,   label: 'You approved — contact shared' },
  declined: { bg: 'bg-red-50    border-red-200',    text: 'text-red-600',    Icon: XCircle,       label: 'Declined' },
}

export default function CandidateInterestsPage() {
  const [interests, setInterests]   = useState<InterestRecord[]>([])
  const [loading, setLoading]       = useState(true)
  const [expanded, setExpanded]     = useState<string | null>(null)
  const [resolving, setResolving]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: applicant } = await supabase
        .from('applicants')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!applicant) return

      const { data: profiles } = await supabase
        .from('candidate_marketplace_profiles')
        .select('id')
        .eq('applicant_id', applicant.id)

      if (!profiles || profiles.length === 0) {
        setLoading(false)
        return
      }

      const profileIds = profiles.map((p) => p.id)

      const { data } = await supabase
        .from('marketplace_interest')
        .select(`
          id, status, expressed_at, stakeholder_note,
          stakeholders ( name, org, roles ),
          candidate_marketplace_profiles (
            candidate_ref, discipline,
            cohorts ( name, destination )
          )
        `)
        .in('candidate_profile_id', profileIds)
        .order('expressed_at', { ascending: false })

      setInterests((data as any) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function resolve(interestId: string, action: 'approved' | 'declined') {
    setResolving(interestId)
    try {
      const res = await fetch('/api/marketplace/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interest_id: interestId, action }),
      })
      if (res.ok) {
        setInterests((prev) =>
          prev.map((i) => i.id === interestId ? { ...i, status: action } : i),
        )
        setExpanded(null)
      }
    } finally {
      setResolving(null)
    }
  }

  const pending  = interests.filter((i) => i.status === 'pending')
  const resolved = interests.filter((i) => i.status !== 'pending')

  return (
    <div>
      <div className='flex items-center gap-3 mb-6'>
        <Bell size={22} className='text-amber-500' />
        <div>
          <h1 className='text-2xl font-bold text-[#0B1F3B]'>Stakeholder Interest</h1>
          <p className='text-gray-500 text-sm'>Organisations interested in your profile. Approve to share your contact details.</p>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center py-16'>
          <Loader2 size={28} className='animate-spin text-gray-300' />
        </div>
      ) : interests.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <Bell size={36} className='text-gray-200 mx-auto mb-3' />
            <p className='text-gray-500 font-semibold'>No interest requests yet</p>
            <p className='text-gray-400 text-sm mt-1'>When a stakeholder expresses interest in your profile, it will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-6'>
          {/* Pending */}
          {pending.length > 0 && (
            <section>
              <h2 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-3'>
                Awaiting Your Response ({pending.length})
              </h2>
              <div className='space-y-3'>
                {pending.map((interest) => (
                  <InterestRow
                    key={interest.id}
                    interest={interest}
                    expanded={expanded === interest.id}
                    onToggle={() => setExpanded(expanded === interest.id ? null : interest.id)}
                    onResolve={resolve}
                    resolving={resolving === interest.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Resolved */}
          {resolved.length > 0 && (
            <section>
              <h2 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-3'>
                Past Requests ({resolved.length})
              </h2>
              <div className='space-y-3'>
                {resolved.map((interest) => (
                  <InterestRow
                    key={interest.id}
                    interest={interest}
                    expanded={expanded === interest.id}
                    onToggle={() => setExpanded(expanded === interest.id ? null : interest.id)}
                    onResolve={resolve}
                    resolving={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function InterestRow({
  interest,
  expanded,
  onToggle,
  onResolve,
  resolving,
}: {
  interest: InterestRecord
  expanded: boolean
  onToggle: () => void
  onResolve: (id: string, action: 'approved' | 'declined') => void
  resolving: boolean
}) {
  const s = STATUS_STYLE[interest.status]
  const cohortName = interest.candidate_marketplace_profiles?.cohorts?.name ?? '—'
  const orgName    = interest.stakeholders?.org ?? interest.stakeholders?.name ?? 'Unknown organisation'

  return (
    <div className={`rounded-2xl border ${s.bg} transition-all`}>
      {/* Row header */}
      <button onClick={onToggle} className='w-full flex items-center justify-between px-5 py-4 text-left gap-3'>
        <div className='flex items-center gap-3'>
          <s.Icon size={18} className={s.text} />
          <div>
            <p className='font-semibold text-[#0B1F3B] text-sm'>{orgName}</p>
            <p className='text-xs text-gray-500'>{cohortName} · {new Date(interest.expressed_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
          {expanded ? <ChevronUp size={16} className='text-gray-400' /> : <ChevronDown size={16} className='text-gray-400' />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className='px-5 pb-5 border-t border-white/60 pt-4'>
          {interest.stakeholders && (
            <div className='text-sm text-gray-600 mb-3'>
              <p><span className='font-medium'>Organisation:</span> {interest.stakeholders.org}</p>
              <p><span className='font-medium'>Role:</span> {interest.stakeholders.roles?.join(', ')}</p>
            </div>
          )}

          {interest.stakeholder_note && (
            <p className='text-sm text-gray-600 bg-white/70 rounded-xl px-4 py-3 mb-4 italic'>
              "{interest.stakeholder_note}"
            </p>
          )}

          {interest.status === 'pending' && (
            <div className='flex gap-3'>
              <button
                onClick={() => onResolve(interest.id, 'approved')}
                disabled={resolving}
                className='flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60'
              >
                {resolving ? <Loader2 size={14} className='animate-spin' /> : <CheckCircle size={14} />}
                Approve &amp; Share Details
              </button>
              <button
                onClick={() => onResolve(interest.id, 'declined')}
                disabled={resolving}
                className='flex-1 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-bold rounded-xl text-sm transition-colors disabled:opacity-60'
              >
                Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
