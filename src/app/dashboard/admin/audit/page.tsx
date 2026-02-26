import { createClient } from '@/lib/supabase/server'
import { AuditLogTable } from '@/components/audit/AuditLogTable'

export default async function AuditPage() {
  const supabase = createClient()

  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching audit logs:', error)
    return <div>Error loading audit logs</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Trail</h1>
      <AuditLogTable logs={logs || []} />
    </div>
  )
}