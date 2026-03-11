import { createClient } from '@/lib/supabase/server'

interface InviteHistoryProps {
  stakeholderId: string
}

export async function InviteHistory({ stakeholderId }: InviteHistoryProps) {
  const supabase = createClient()

  const { data: invites } = await supabase
    .from('partner_invites')
    .select('id, email, status, sent_at, error_message, created_at')
    .eq('stakeholder_id', stakeholderId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!invites?.length) {
    return (
      <div className='text-center py-8 text-gray-400 text-sm'>
        No invites sent yet.
      </div>
    )
  }

  const statusStyle = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700'
      case 'failed':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className='space-y-3'>
      <h2 className='text-lg font-semibold'>Invite History</h2>
      <div className='rounded-lg border border-gray-200 overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-100 text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide'>
                Email
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide'>
                Status
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide'>
                Sent At
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 bg-white'>
            {invites.map((invite) => (
              <tr key={invite.id}>
                <td className='px-4 py-3 font-mono text-gray-700'>
                  {invite.email}
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(invite.status)}`}
                  >
                    {invite.status}
                  </span>
                  {invite.error_message && (
                    <span className='ml-2 text-xs text-gray-400'>
                      {invite.error_message}
                    </span>
                  )}
                </td>
                <td className='px-4 py-3 text-gray-500'>
                  {invite.sent_at
                    ? new Date(invite.sent_at).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
