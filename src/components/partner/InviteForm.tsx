'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { parse } from 'papaparse'

interface InviteFormProps {
  stakeholder: {
    id: string
    partner_code: string
    name: string
  }
  referralLink: string
}

type SendResult = { success: number; failed: number }
type Tab = 'single' | 'bulk'

export function InviteForm({ stakeholder, referralLink }: InviteFormProps) {
  const [tab, setTab] = useState<Tab>('single')
  const [singleEmail, setSingleEmail] = useState('')
  const [bulkEmailsRaw, setBulkEmailsRaw] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendInvites = async (emails: string[]) => {
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/partner/send-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails, customMessage }),
    })

    const data = await res.json()
    if (!res.ok) {
      alert(data.error ?? 'Failed to send invites')
    } else {
      setResult(data)
      setSingleEmail('')
      setBulkEmailsRaw('')
      setCsvFile(null)
      setCustomMessage('')
      router.refresh()
    }
    setLoading(false)
  }

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!singleEmail.trim()) return
    await sendInvites([singleEmail.trim()])
  }

  const handleBulkPaste = async () => {
    const emails = bulkEmailsRaw
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes('@'))
    if (!emails.length) return alert('No valid emails found')
    await sendInvites(emails)
  }

  const handleCsvUpload = () => {
    if (!csvFile) return

    parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        const emails = (parsed.data as any[])
          .map((row) => row.email || row.Email || row[Object.keys(row)[0]])
          .map((e: string) => e?.trim().toLowerCase())
          .filter((e) => e && e.includes('@'))

        if (!emails.length) return alert('No valid emails found in CSV')
        await sendInvites(emails)
      },
      error: (err) => alert('Error parsing CSV: ' + err.message),
    })
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      tab === t
        ? 'bg-black text-white'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    }`

  return (
    <Card>
      <CardHeader>
        <h2 className='text-lg font-semibold'>Your Referral Link</h2>
        <div className='flex items-center gap-2 mt-1'>
          <code className='flex-1 text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 break-all select-all'>
            {referralLink}
          </code>
          <button
            onClick={copyLink}
            className='text-sm px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap'
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </CardHeader>

      <CardContent className='space-y-5'>
        {/* Tabs */}
        <div className='flex gap-2 bg-gray-100 p-1 rounded-lg w-fit'>
          <button
            className={tabClass('single')}
            onClick={() => setTab('single')}
          >
            Single Email
          </button>
          <button className={tabClass('bulk')} onClick={() => setTab('bulk')}>
            Paste Emails
          </button>
          <button
            className={tabClass('csv' as Tab)}
            onClick={() => setTab('csv' as Tab)}
          >
            CSV Upload
          </button>
        </div>

        {/* Custom message — shared across all tabs */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Custom Message{' '}
            <span className='text-gray-400 font-normal'>(optional)</span>
          </label>
          <textarea
            rows={2}
            className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none'
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder='Add a personal note to your invite email…'
          />
        </div>

        {/* Single */}
        {tab === 'single' && (
          <form onSubmit={handleSingleSubmit} className='space-y-3'>
            <input
              type='email'
              required
              value={singleEmail}
              onChange={(e) => setSingleEmail(e.target.value)}
              placeholder='applicant@example.com'
              className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black'
            />
            <Button type='submit' disabled={loading}>
              {loading ? 'Sending…' : 'Send Invite'}
            </Button>
          </form>
        )}

        {/* Bulk paste */}
        {tab === 'bulk' && (
          <div className='space-y-3'>
            <textarea
              rows={6}
              className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none'
              value={bulkEmailsRaw}
              onChange={(e) => setBulkEmailsRaw(e.target.value)}
              placeholder={`Paste emails separated by newlines, commas, or semicolons:\njohn@example.com\njane@example.com, sara@example.com`}
            />
            {bulkEmailsRaw && (
              <p className='text-xs text-gray-400'>
                {
                  bulkEmailsRaw
                    .split(/[\n,;]+/)
                    .map((e) => e.trim())
                    .filter((e) => e.includes('@')).length
                }{' '}
                emails detected
              </p>
            )}
            <Button
              onClick={handleBulkPaste}
              disabled={loading || !bulkEmailsRaw.trim()}
            >
              {loading ? 'Sending…' : 'Send Invites'}
            </Button>
          </div>
        )}

        {/* CSV */}
        {tab === ('csv' as Tab) && (
          <div className='space-y-3'>
            <div>
              <input
                type='file'
                accept='.csv'
                onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
              />
              <p className='text-xs text-gray-400 mt-1'>
                CSV must have an <code>email</code> column.
              </p>
            </div>
            <Button onClick={handleCsvUpload} disabled={loading || !csvFile}>
              {loading ? 'Sending…' : 'Upload & Send'}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800'>
            <p className='font-semibold'>
              ✓ {result.success} invite{result.success !== 1 ? 's' : ''} sent
            </p>
            {result.failed > 0 && (
              <p className='mt-1 text-red-600'>
                {result.failed} failed — check invite history below.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
