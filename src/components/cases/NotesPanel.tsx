'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm, FormProvider } from 'react-hook-form'

interface NotesPanelProps {
  caseId: string
}

export function NotesPanel({ caseId }: NotesPanelProps) {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const methods = useForm()

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('cases')
      .select('notes')
      .eq('id', caseId)
      .single()
    setNotes(data?.notes ? [{ content: data.notes }] : [])
  }

  useEffect(() => {
    fetchNotes()
  }, [caseId])

  const onSubmit = async (data: any) => {
    if (!data.note?.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cases')
        .update({ notes: data.note })
        .eq('id', caseId)

      if (error) throw error

      await fetchNotes()
      methods.reset()
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        {notes.map((note, idx) => (
          <div key={idx} className='p-3 bg-gray-50 rounded'>
            <p className='text-sm whitespace-pre-wrap'>{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className='text-sm text-gray-500'>No notes yet.</p>
        )}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-2'>
          <Input
            label='Add note'
            placeholder='Internal note...'
            {...methods.register('note')}
          />
          <Button type='submit' disabled={loading} size='sm'>
            {loading ? 'Saving...' : 'Save Note'}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
