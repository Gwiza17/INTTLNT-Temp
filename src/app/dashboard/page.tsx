import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = await getUserRole(user.id)

  if (role) {
    redirect(`/dashboard/${role}`)
  }

  const { data: applicant } = await supabase
    .from('applicants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (applicant) {
    redirect('/dashboard/applicant')
  }

  redirect('/dashboard/pending')
}
