// app/api/auth/magic-link/route.ts
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, redirectTo } = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // needs service role to generate links
  )

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `https://inttlnt.com/callback?redirect=${encodeURIComponent(redirectTo || '/dashboard')}`,
    },
  })

  if (error || !data) {
    return NextResponse.json({ error: error?.message }, { status: 400 })
  }

  const magicLink = data.properties.action_link

  await resend.emails.send({
    from: 'noreply@inttlnt.com',
    to: email,
    subject: 'Your magic link',
    html: getMagicLinkTemplate(magicLink), // your HTML template with link injected
  })

  return NextResponse.json({ success: true })
}

function getMagicLinkTemplate(link: string) {
  // paste your magic link HTML template here, replacing {{ .ConfirmationURL }} with the link
  return `... <a href="${link}" class="cta">Sign In Securely</a> ...`
}
