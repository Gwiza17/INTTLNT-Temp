import { createClient } from '@/lib/supabase/server'

export async function getUserRole(userId: string): Promise<string | null> {
  const supabase = createClient()
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('roles, status')
    .eq('user_id', userId)
    .single()

  if (stakeholder && stakeholder.status === 'approved' && stakeholder.roles.length > 0) {
    return stakeholder.roles[0] // primary role
  }
  return null
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('roles')
    .eq('user_id', userId)
    .single()
  return stakeholder?.roles.includes('admin') ?? false
}

// Add more role checks as needed