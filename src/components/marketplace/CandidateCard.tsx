'use client'

import { useState } from 'react'
import { User, Briefcase, GraduationCap, BarChart2, Clock, TrendingUp } from 'lucide-react'
import type { CandidateProfile } from '@/types/marketplace'
import RevealModal from './RevealModal'

interface CandidateCardProps {
  candidate: CandidateProfile
  /** Pass true when the viewer is an authenticated, approved stakeholder */
  canExpressInterest?: boolean
  /** If the stakeholder already expressed interest, pass the status */
  interestStatus?: 'pending' | 'approved' | 'declined' | null
}

const SCORE_COLOUR = (score: number | null) => {
  if (!score) return 'bg-gray-100 text-gray-500'
  if (score >= 75) return 'bg-green-100 text-green-700'
  if (score >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-600'
}

const INTEREST_BADGE: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-600 border-red-200',
}

export default function CandidateCard({
  candidate,
  canExpressInterest = false,
  interestStatus = null,
}: CandidateCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(interestStatus)

  return (
    <>
      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4'>

        {/* Top row */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-[#0B1F3B]/8 flex items-center justify-center flex-shrink-0 border border-[#0B1F3B]/10'>
              <User size={18} className='text-[#0B1F3B]' />
            </div>
            <div>
              <p className='font-bold text-[#0B1F3B] text-sm'>{candidate.candidate_ref}</p>
              <p className='text-xs text-gray-500'>{candidate.country} · {candidate.age_range}</p>
            </div>
          </div>

          {/* Opportunity score */}
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${SCORE_COLOUR(candidate.opportunity_score)}`}>
            {candidate.opportunity_score != null ? `${candidate.opportunity_score} / 100` : 'N/A'}
          </span>
        </div>

        {/* Details grid */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <Detail Icon={GraduationCap} label='Education' value={candidate.education_level} />
          <Detail Icon={Briefcase}    label='Experience' value={`${candidate.years_experience} yrs`} />
          <Detail Icon={TrendingUp}   label='IELTS (pred.)' value={candidate.ielts_predicted_score != null ? String(candidate.ielts_predicted_score) : '—'} />
          <Detail Icon={Clock}        label='Ready in' value={candidate.readiness_timeline ?? '—'} />
        </div>

        {/* Pathway badge */}
        {candidate.recommended_pathway && (
          <p className='text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2'>
            <BarChart2 size={11} className='inline mr-1 text-amber-500' />
            {candidate.recommended_pathway}
          </p>
        )}

        {/* CTA */}
        <div className='mt-auto pt-2 border-t border-gray-100'>
          {currentStatus ? (
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${INTEREST_BADGE[currentStatus]}`}>
              Interest: {currentStatus}
            </span>
          ) : canExpressInterest ? (
            <button
              onClick={() => setShowModal(true)}
              className='w-full text-sm font-semibold text-white bg-[#0B1F3B] hover:bg-[#0B1F3B]/80 rounded-xl py-2 transition-colors'
            >
              Express Interest
            </button>
          ) : (
            <p className='text-xs text-gray-400 text-center'>Log in as a stakeholder to express interest</p>
          )}
        </div>
      </div>

      {showModal && (
        <RevealModal
          candidateRef={candidate.candidate_ref}
          candidateProfileId={candidate.id}
          onClose={() => setShowModal(false)}
          onSuccess={(status) => {
            setCurrentStatus(status)
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}

function Detail({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className='flex items-center gap-1.5 text-gray-600'>
      <Icon size={12} className='text-gray-400 flex-shrink-0' />
      <span className='text-gray-400'>{label}:</span>
      <span className='font-medium truncate'>{value}</span>
    </div>
  )
}
