import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Determine user's primary role
  const role = await getUserRole(user.id)

  // Redirect to role-specific dashboard
  if (role) {
    redirect(`/dashboard/${role}`)
  } else {
    // If no role, check if they are an applicant
    const { data: applicant } = await supabase
      .from('applicants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (applicant) {
      redirect('/dashboard/applicant')
    } else {
      // New user with no role yet – maybe show a waiting page
      redirect('/dashboard/pending')
    }
  }
}