'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Copy, Check } from 'lucide-react'

export default function LinkGenerator() {
  const [partnerCode, setPartnerCode] = useState('')
  const [campaign, setCampaign] = useState('')
  const [market, setMarket] = useState('')
  const [pathway, setPathway] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchPartnerCode = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('stakeholders')
        .select('partner_code')
        .eq('user_id', user.id)
        .single()
      if (data) setPartnerCode(data.partner_code)
    }
    fetchPartnerCode()
  }, [])

  const generateLink = () => {
    const base = window.location.origin
    const params = new URLSearchParams()
    if (partnerCode) params.set('code', partnerCode)
    if (campaign) params.set('campaign', campaign)
    if (market) params.set('market', market)
    if (pathway) params.set('pathway', pathway)
    setGeneratedLink(`${base}/eoi?${params.toString()}`)
    setCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Generate Referral Links</h1>

      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Customize Your Link</h2>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Campaign (optional)'
              placeholder='e.g., webinar-spring'
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
            />
            <Select
              label='Market (optional)'
              options={[
                { value: '', label: 'All Markets' },
                { value: 'south-africa', label: 'South Africa' },
                { value: 'kenya', label: 'Kenya' },
                { value: 'nigeria', label: 'Nigeria' },
              ]}
              value={market}
              onChange={(e) => setMarket(e.target.value)}
            />
            <Select
              label='Pathway (optional)'
              options={[
                { value: '', label: 'All Pathways' },
                { value: 'engineering', label: 'Engineering Canada' },
                { value: 'nursing', label: 'Nursing Australia' },
              ]}
              value={pathway}
              onChange={(e) => setPathway(e.target.value)}
            />
          </div>
          <Button onClick={generateLink}>Generate Link</Button>

          {generatedLink && (
            <div className='mt-4 p-4 bg-gray-100 rounded flex items-center justify-between'>
              <code className='text-sm break-all'>{generatedLink}</code>
              <Button variant='outline' size='sm' onClick={copyToClipboard}>
                {copied ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Your Base Link</h2>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-gray-600 mb-2'>
            You can also manually add parameters to any link:
          </p>
          <code className='bg-gray-100 p-2 rounded block text-sm'>
            {window.location.origin}/eoi?code={partnerCode}
            &campaign=NAME&market=REGION&pathway=DISCIPLINE
          </code>
        </CardContent>
      </Card>
    </div>
  )
}
