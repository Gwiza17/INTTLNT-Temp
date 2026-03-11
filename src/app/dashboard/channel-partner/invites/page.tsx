import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InviteForm } from '@/components/partner/InviteForm'
import { InviteHistory } from '@/components/partner/InviteHistory'

export default async function InvitesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id, partner_code, name')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return <div>Not authorized as channel partner</div>
  }

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/eoi?code=${stakeholder.partner_code}`

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold'>Send Invites</h1>
        <p className='text-sm text-gray-500 mt-1'>
          Invite people using your referral link — individually or via CSV
          upload.
        </p>
      </div>
      <InviteForm stakeholder={stakeholder} referralLink={referralLink} />
      <InviteHistory stakeholderId={stakeholder.id} />
    </div>
  )
}
