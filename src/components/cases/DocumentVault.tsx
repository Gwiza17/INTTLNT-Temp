'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FileInput } from '@/components/ui/FileInput'
import { useForm, FormProvider } from 'react-hook-form'

interface DocumentVaultProps {
  caseId: string
}

export function DocumentVault({ caseId }: DocumentVaultProps) {
  const [docs, setDocs] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const methods = useForm()

  const fetchDocs = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', caseId)
      .order('uploaded_at', { ascending: false })
    setDocs(data || [])
  }

  useEffect(() => {
    fetchDocs()
  }, [caseId])

  const handleUpload = async (data: any) => {
    const file = data.newDocument?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `cases/${caseId}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create document record
      const { error: dbError } = await supabase.from('documents').insert({
        case_id: caseId,
        document_type: 'other',
        file_path: uploadData.path,
        owner_type: 'admin', // or could be 'applicant' depending
      })

      if (dbError) throw dbError

      fetchDocs()
      methods.reset()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='space-y-4'>
      {/* Document list */}
      <div className='space-y-2'>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className='flex items-center justify-between p-2 bg-gray-50 rounded'
          >
            <span className='text-sm truncate'>
              {doc.file_path.split('/').pop()}
            </span>
            <a
              href={
                supabase.storage.from('documents').getPublicUrl(doc.file_path)
                  .data.publicUrl
              }
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline text-sm'
            >
              View
            </a>
          </div>
        ))}
        {docs.length === 0 && (
          <p className='text-sm text-gray-500'>No documents uploaded yet.</p>
        )}
      </div>

      {/* Upload form */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleUpload)}
          className='space-y-2'
        >
          <FileInput
            name='newDocument'
            label='Add new document'
            accept='.pdf,.jpg,.jpeg,.png'
            maxSize={10}
          />
          <Button type='submit' disabled={uploading} size='sm'>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
