'use client'

import { useState } from 'react'
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
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const supabase = createClient()

  const docTypeNames: Record<string, string> = {
    passport: 'Passport',
    degree: 'Degree Certificate',
    transcripts: 'Transcripts',
    ielts: 'IELTS Result',
    proof_of_funds: 'Proof of Funds',
    partner_docs: 'Partner Documents',
    other: 'Other',
  }

  const isUploaded = (docType: string) => {
    return (uploadedDocTypes || []).includes(docType)
  }

  const handleUpload = async (docType: string, file: File) => {
    setUploadingFor(docType)
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
        verified_status: false,
      })

      if (dbError) throw dbError

      window.location.reload()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploadingFor(null)
    }
  }

  return (
    <div className='space-y-4'>
      {requiredArtifacts.length === 0 ? (
        <p className='text-gray-500'>No documents required at this stage.</p>
      ) : (
        requiredArtifacts.map((docType) => (
          <Card key={docType}>
            <CardContent className='p-4 flex items-center justify-between'>
              <div>
                <p className='font-medium'>
                  {docTypeNames[docType] || docType}
                </p>
                {isUploaded(docType) ? (
                  <p className='text-sm text-green-600'>✓ Uploaded</p>
                ) : (
                  <p className='text-sm text-yellow-600'>Required</p>
                )}
              </div>
              {!isUploaded(docType) && (
                <div className='flex items-center space-x-2'>
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
                    size='sm'
                    onClick={() =>
                      document.getElementById(`file-${docType}`)?.click()
                    }
                    disabled={uploadingFor === docType}
                  >
                    {uploadingFor === docType ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
