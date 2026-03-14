import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

type StakeholderRow = {
  id: string
  name: string
  email: string
  roles: string[]
  user_id: string | null
  org: string | null
  partner_code: string | null
  status: string
  phone: string | null
  country: string | null
  city: string | null
}

// Format role from snake_case/kebab-case to human-readable
function formatRole(role: string) {
  return role
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function POST(req: NextRequest) {
  // 1. Auth — only admins can approve
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the caller is an admin
  const { data: adminStakeholder } = await supabaseAdmin
    .from('stakeholders')
    .select('roles')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminStakeholder?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse request body
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json(
      { error: 'Missing stakeholder id' },
      { status: 400 },
    )
  }

  // 3. Fetch the stakeholder being approved
  const result = await supabaseAdmin
    .from('stakeholders')
    .select('id, name, email, roles, user_id, org, partner_code, status')
    .eq('id', id)
    .maybeSingle()

  if (result.error || !result.data) {
    return NextResponse.json(
      { error: 'Stakeholder not found' },
      { status: 404 },
    )
  }

  const typedStakeholder = result.data as unknown as StakeholderRow

  // 4. If user_id is missing, create auth user and get their id
  let userId = typedStakeholder.user_id

  if (!userId && typedStakeholder.email) {
    // Check if they already exist in auth
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const users = (authUsers?.users ?? []) as { id: string; email?: string }[]
    const existingUser = users.find(
      (u) => u.email?.toLowerCase() === typedStakeholder.email.toLowerCase(),
    )

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create auth user silently — no email sent by Supabase
      // We send our own custom email via Resend below
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: typedStakeholder.email,
          email_confirm: true,
        })

      if (createError) {
        console.error('Failed to create user:', createError)
      } else {
        userId = newUser.user.id
      }
    }
  }

  // 5. Update status to approved and ensure user_id is linked
  const { error: updateError } = await supabaseAdmin
    .from('stakeholders')
    .update({
      status: 'approved',
      ...(userId ? { user_id: userId } : {}),
    })
    .eq('id', id)

  if (updateError) {
    console.error('Error approving stakeholder:', updateError)
    return NextResponse.json(
      { error: 'Failed to approve stakeholder' },
      { status: 500 },
    )
  }

  // 6. Log audit
  await supabaseAdmin.from('audit_logs').insert({
    user_id: user.id,
    action: 'stakeholder_approved',
    new_value: { stakeholder_id: id, status: 'approved' },
  })

  // 7. Send approval email via Resend
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`
  const roleLabel = typedStakeholder.roles?.length
    ? typedStakeholder.roles.map(formatRole).join(', ')
    : 'Stakeholder'

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@yourdomain.com',
      to: typedStakeholder.email,
      subject: 'Your account has been approved',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h2 style="margin-bottom: 8px; color: #111;">
            You're approved, ${typedStakeholder.name}!
          </h2>

          <p style="color: #444;">
            Your account has been reviewed and approved. You now have access to the platform as a
            <strong>${roleLabel}</strong>.
          </p>

          <div style="margin: 28px 0; text-align: center;">
            <a
              href="${loginUrl}"
              style="background: #111; color: #fff; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;"
            >
              Log in to your dashboard →
            </a>
          </div>

          <p style="font-size: 13px; color: #9ca3af;">
            Or copy this link: <a href="${loginUrl}" style="color: #6b7280;">${loginUrl}</a>
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">
            If you weren't expecting this email, you can safely ignore it.
          </p>
        </div>
      `,
    })
  } catch (emailErr: any) {
    console.error('Failed to send approval email:', emailErr?.message)
  }

  return NextResponse.json({ success: true })
}
