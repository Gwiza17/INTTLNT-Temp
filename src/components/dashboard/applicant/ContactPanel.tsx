import { Mail, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

interface ContactPanelProps {
  ownerName?: string | null
  ownerEmail?: string | null
  ownerWhatsapp?: string | null
  ownerRole?: string | null
}

export function ContactPanel({
  ownerName,
  ownerEmail,
  ownerWhatsapp,
  ownerRole,
}: ContactPanelProps) {
  const hasOwner = ownerName && (ownerEmail || ownerWhatsapp)

  return (
    <Card>
      <CardHeader>
        <h2 className='text-xl font-semibold'>Your Case Contact</h2>
      </CardHeader>
      <CardContent className='p-6'>
        {hasOwner ? (
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-500'>Assigned {ownerRole}</p>
              <p className='font-medium'>{ownerName}</p>
            </div>
            {ownerEmail && (
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4 text-gray-400' />
                <a
                  href={`mailto:${ownerEmail}`}
                  className='text-blue-600 hover:underline'
                >
                  {ownerEmail}
                </a>
              </div>
            )}
            {ownerWhatsapp && (
              <div className='flex items-center space-x-2'>
                <MessageCircle className='h-4 w-4 text-gray-400' />
                <a
                  href={`https://wa.me/${ownerWhatsapp.replace(/\D/g, '')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {ownerWhatsapp}
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className='text-gray-600'>
            No specific contact assigned yet. Your case is being processed and
            someone will reach out soon.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
