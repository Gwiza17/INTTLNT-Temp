'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface StageChangerProps {
  caseId: string
  currentStageId: string
  stages: Array<{ id: string; name: string; default_sla_days: number }>
}

export function StageChanger({
  caseId,
  currentStageId,
  stages,
}: StageChangerProps) {
  const [selectedStage, setSelectedStage] = useState(currentStageId)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = async () => {
    if (selectedStage === currentStageId) return

    setLoading(true)
    try {
      // Find the selected stage to get its default SLA days
      const stage = stages.find((s) => s.id === selectedStage)
      if (!stage) throw new Error('Stage not found')

      // Calculate SLA due date
      const now = new Date()
      const slaDueAt = new Date(now)
      slaDueAt.setDate(now.getDate() + stage.default_sla_days)

      const { error } = await supabase
        .from('cases')
        .update({
          current_stage_id: selectedStage,
          stage_entered_at: now.toISOString(),
          sla_due_at: slaDueAt.toISOString(),
        })
        .eq('id', caseId)

      if (error) throw error

      // Log to audit table
      const { error: auditError } = await supabase.from('audit_logs').insert({
        case_id: caseId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'stage_changed',
        old_value: { stage_id: currentStageId }, // also add old value!
        new_value: {
          stage_id: selectedStage,
          sla_due_at: slaDueAt.toISOString(),
        },
      })

      if (auditError) console.error('Audit insert failed:', auditError)
      router.refresh()
    } catch (error) {
      console.error('Error changing stage:', error)
      alert('Failed to change stage')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-end space-x-2'>
      <div className='flex-1'>
        <Select
          label='Change Stage'
          options={stages.map((s) => ({ value: s.id, label: s.name }))}
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
        />
      </div>
      <Button
        onClick={handleChange}
        disabled={selectedStage === currentStageId || loading}
      >
        {loading ? 'Updating...' : 'Update'}
      </Button>
    </div>
  )
}
