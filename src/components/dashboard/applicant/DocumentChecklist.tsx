'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface DocumentChecklistProps {
  caseId: string
  requiredArtifacts: string[]
  uploadedDocTypes: string[]
}

export function DocumentChecklist({
  caseId,
  requiredArtifacts,
  uploadedDocTypes,
}: DocumentChecklistProps) {
  const [uploading, setUploading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleUpload = async (docType: string, file: File) => {
    setUploading(docType)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `applicants/${user.id}/cases/${caseId}/${docType}_${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase.from('documents').insert({
        case_id: caseId,
        document_type: docType,
        file_path: uploadData.path,
        owner_type: 'applicant',
      })

      if (dbError) throw dbError

      toast.success(`${docType.replace(/_/g, ' ')} uploaded successfully`)
      window.location.reload()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  if (!requiredArtifacts.length) {
    return (
      <Card>
        <CardContent className='p-6'>
          <p className='text-gray-600'>No documents required at this stage.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {requiredArtifacts.map((docType) => {
        const isUploaded = uploadedDocTypes.includes(docType)
        return (
          <Card key={docType}>
            <CardContent className='p-4 flex items-center justify-between'>
              <div>
                <p className='font-medium capitalize'>
                  {docType.replace(/_/g, ' ')}
                </p>
                {isUploaded ? (
                  <p className='text-sm text-green-600'>✓ Uploaded</p>
                ) : (
                  <p className='text-sm text-red-600'>Required</p>
                )}
              </div>
              {!isUploaded && (
                <div>
                  <input
                    type='file'
                    id={`file-${docType}`}
                    className='hidden'
                    accept='.pdf,.jpg,.jpeg,.png'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(docType, file)
                    }}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={uploading === docType}
                    onClick={() =>
                      document.getElementById(`file-${docType}`)?.click()
                    }
                  >
                    {uploading === docType ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
