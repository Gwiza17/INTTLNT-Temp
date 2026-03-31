'use client'

import { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'

interface RevealModalProps {
  candidateRef: string
  candidateProfileId: string
  onClose: () => void
  onSuccess: (status: 'pending') => void
}

export default function RevealModal({
  candidateRef,
  candidateProfileId,
  onClose,
  onSuccess,
}: RevealModalProps) {
  const [note, setNote]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/marketplace/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_profile_id: candidateProfileId, stakeholder_note: note }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Something went wrong')
      }

      onSuccess('pending')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative'>

        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
        >
          <X size={20} />
        </button>

        <h2 className='text-[#0B1F3B] font-black text-xl mb-1'>Express Interest</h2>
        <p className='text-gray-500 text-sm mb-5'>
          You are expressing interest in <span className='font-semibold text-[#0B1F3B]'>{candidateRef}</span>.
          The candidate will be notified and must approve before their contact details are shared with you.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>
              Why are you interested? <span className='text-gray-400 font-normal'>(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder='e.g. Strong match for our nursing cohort intake in Q3…'
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B1F3B]/20 resize-none'
            />
          </div>

          {error && (
            <p className='text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2'>{error}</p>
          )}

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-sm font-bold text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60'
            >
              {loading ? <Loader2 size={16} className='animate-spin' /> : <Send size={15} />}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
