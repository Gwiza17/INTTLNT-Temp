import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

// Admin client for writing invite records (bypasses RLS for updates)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  // 1. Auth — read session from cookie
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Look up stakeholder from session — never trust client for this
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id, name, partner_code')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return NextResponse.json(
      { error: 'Not an approved partner' },
      { status: 403 },
    )
  }

  // 3. Parse request body
  const { emails, customMessage } = await req.json()

  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: 'No emails provided' }, { status: 400 })
  }

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/eoi?code=${stakeholder.partner_code}`
  const results = { success: 0, failed: 0 }

  // 4. Send per email
  for (const rawEmail of emails) {
    const email = rawEmail?.trim().toLowerCase()

    if (!isValidEmail(email)) {
      results.failed++
      continue
    }

    // Insert invite record as pending
    const { data: invite, error: insertError } = await supabaseAdmin
      .from('partner_invites')
      .insert({
        stakeholder_id: stakeholder.id,
        email,
        referral_link: referralLink,
        custom_message: customMessage || null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError || !invite) {
      console.error(`Failed to insert invite for ${email}:`, insertError)
      results.failed++
      continue
    }

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@yourdomain.com',
        to: email,
        subject: `${stakeholder.name} invited you to apply`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
            <h2 style="margin-bottom: 8px; color: #111;">
              ${stakeholder.name} thinks you should explore this opportunity
            </h2>

            ${
              customMessage
                ? `<p style="color: #444; font-style: italic; border-left: 3px solid #e5e7eb; padding-left: 12px; margin: 16px 0;">
                    "${customMessage}"
                   </p>`
                : ''
            }

            <p style="color: #444;">
              You've been personally referred by ${stakeholder.name}.
              Click below to start your application — your partner code is already included in the link.
            </p>

            <div style="margin: 28px 0; text-align: center;">
              <a
                href="${referralLink}"
                style="background: #111; color: #fff; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;"
              >
                Start Your Application →
              </a>
            </div>

            <p style="font-size: 13px; color: #9ca3af;">
              Or copy this link: <a href="${referralLink}" style="color: #6b7280;">${referralLink}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">
              This invitation was sent on behalf of ${stakeholder.name}, a trusted partner.
              If you weren't expecting this, you can safely ignore it.
            </p>
          </div>
        `,
      })

      // Mark as sent
      await supabaseAdmin
        .from('partner_invites')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', invite.id)

      results.success++
    } catch (err: any) {
      console.error(`Failed to send email to ${email}:`, err)

      // Mark as failed with error
      await supabaseAdmin
        .from('partner_invites')
        .update({
          status: 'failed',
          error_message: err?.message ?? 'Unknown error',
        })
        .eq('id', invite.id)

      results.failed++
    }
  }

  return NextResponse.json(results)
}
