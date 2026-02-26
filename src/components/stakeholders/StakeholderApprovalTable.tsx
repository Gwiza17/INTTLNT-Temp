'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface Stakeholder {
  id: string
  name: string
  email: string
  org: string | null
  roles: string[]
  status: 'pending' | 'approved' | 'suspended'
  created_at: string
  partner_code: string | null
}

interface StakeholderApprovalTableProps {
  stakeholders: Stakeholder[]
}

export function StakeholderApprovalTable({
  stakeholders,
}: StakeholderApprovalTableProps) {
  const [processing, setProcessing] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async (id: string) => {
    setProcessing(id)
    try {
      const { error } = await supabase
        .from('stakeholders')
        .update({ status: 'approved' })
        .eq('id', id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Error approving stakeholder:', error)
      alert('Failed to approve')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    try {
      const { error } = await supabase
        .from('stakeholders')
        .update({ status: 'suspended' })
        .eq('id', id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Error rejecting stakeholder:', error)
      alert('Failed to reject')
    } finally {
      setProcessing(null)
    }
  }

  const pending = stakeholders.filter((s) => s.status === 'pending')
  const others = stakeholders.filter((s) => s.status !== 'pending')

  return (
    <div className='space-y-8'>
      {/* Pending Approvals Section */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>
          Pending Approvals ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className='text-gray-500'>No pending stakeholders.</p>
        ) : (
          <div className='space-y-4'>
            {pending.map((s) => (
              <Card key={s.id}>
                <CardContent className='p-6'>
                  <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div>
                      <p className='font-medium'>{s.name}</p>
                      <p className='text-sm text-gray-600'>{s.email}</p>
                      {s.org && (
                        <p className='text-sm text-gray-600'>{s.org}</p>
                      )}
                      <p className='text-sm text-gray-500 mt-1'>
                        Roles: {s.roles.join(', ')}
                      </p>
                      {s.partner_code && (
                        <p className='text-sm text-gray-500'>
                          Partner Code: {s.partner_code}
                        </p>
                      )}
                      <p className='text-xs text-gray-400 mt-2'>
                        Requested: {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex space-x-2'>
                      <Button
                        onClick={() => handleApprove(s.id)}
                        disabled={processing === s.id}
                      >
                        {processing === s.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => handleReject(s.id)}
                        disabled={processing === s.id}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Other Stakeholders Section */}
      {others.length > 0 && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>Other Stakeholders</h2>
          <div className='bg-white rounded-lg shadow overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Organization
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Roles
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {others.map((s) => (
                  <tr key={s.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>{s.name}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{s.email}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {s.org || '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {s.roles.join(', ')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          s.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : s.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
