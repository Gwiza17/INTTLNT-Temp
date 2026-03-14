import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, redirectTo } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `https://inttlnt.com/callback?redirect=${encodeURIComponent(redirectTo || '/dashboard')}`,
    },
  })

  if (error || !data) {
    console.error('generateLink error:', error)
    return NextResponse.json({ error: error?.message }, { status: 400 })
  }

  const magicLink = data.properties.action_link

  const { error: resendError } = await resend.emails.send({
    from: 'noreply@inttlnt.com',
    to: email,
    subject: 'Your magic link — INTTLNT',
    html: getMagicLinkTemplate(magicLink),
  })

  if (resendError) {
    console.error('Resend error:', resendError)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

function getMagicLinkTemplate(link: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Magic Link</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Josefin+Sans:wght@200;300;400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #080c12; font-family: 'Josefin Sans', sans-serif; -webkit-font-smoothing: antialiased; padding: 48px 16px; }
    .wrapper { max-width: 560px; margin: 0 auto; }
    .card { background: linear-gradient(160deg, #0f1520 0%, #0a0f1a 100%); border: 1px solid rgba(120, 160, 255, 0.12); border-radius: 4px; padding: 56px 52px 48px; position: relative; overflow: hidden; }
    .accent-line { position: absolute; top: 0; left: 52px; right: 52px; height: 1px; background: linear-gradient(90deg, transparent, rgba(130, 170, 255, 0.6), transparent); }
    .sigil { width: 40px; height: 40px; margin-bottom: 36px; position: relative; z-index: 1; }
    .sigil svg { width: 100%; height: 100%; }
    .eyebrow { font-family: 'Josefin Sans', sans-serif; font-weight: 300; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(130, 170, 255, 0.7); margin-bottom: 14px; position: relative; z-index: 1; }
    h2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 38px; color: #e8edf8; line-height: 1.1; letter-spacing: -0.01em; margin-bottom: 20px; position: relative; z-index: 1; }
    .divider { width: 32px; height: 1px; background: rgba(130, 170, 255, 0.35); margin-bottom: 20px; position: relative; z-index: 1; }
    p { font-family: 'Josefin Sans', sans-serif; font-weight: 200; font-size: 13.5px; line-height: 1.8; color: rgba(180, 195, 225, 0.7); margin-bottom: 36px; letter-spacing: 0.04em; position: relative; z-index: 1; }
    .cta-wrap { position: relative; z-index: 1; margin-bottom: 40px; }
    .cta { display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, rgba(100, 140, 255, 0.15) 0%, rgba(80, 110, 220, 0.1) 100%); border: 1px solid rgba(130, 160, 255, 0.35); border-radius: 2px; color: #c8d8ff; text-decoration: none; font-family: 'Josefin Sans', sans-serif; font-weight: 300; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; }
    .footnote { font-size: 11px; color: rgba(140, 160, 200, 0.4); margin-bottom: 0; letter-spacing: 0.05em; }
    .footnote a { color: rgba(130, 170, 255, 0.5); text-decoration: underline; text-underline-offset: 3px; }
    .footer { margin-top: 28px; text-align: center; }
    .footer-text { font-family: 'Josefin Sans', sans-serif; font-weight: 200; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(130, 150, 200, 0.25); }
    .stars { position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: rgba(160, 200, 255, 0.25); }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="accent-line"></div>
      <div class="stars">
        <div class="star" style="top:18%;right:12%"></div>
        <div class="star" style="top:42%;right:8%;width:1px;height:1px;opacity:.5"></div>
        <div class="star" style="top:72%;right:18%;opacity:.7"></div>
        <div class="star" style="top:28%;right:24%;width:1px;height:1px"></div>
        <div class="star" style="top:88%;right:6%;opacity:.4"></div>
      </div>
      <div class="sigil">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="19" stroke="rgba(130,170,255,0.25)" stroke-width="0.75"/>
          <path d="M20 6 L20 34" stroke="rgba(130,170,255,0.2)" stroke-width="0.5"/>
          <path d="M6 20 L34 20" stroke="rgba(130,170,255,0.2)" stroke-width="0.5"/>
          <path d="M20 8 L26 20 L20 32 L14 20 Z" stroke="rgba(130,170,255,0.5)" stroke-width="0.75" fill="rgba(100,140,255,0.06)"/>
          <circle cx="20" cy="20" r="3" fill="rgba(140,175,255,0.6)"/>
          <circle cx="20" cy="20" r="5" stroke="rgba(130,170,255,0.3)" stroke-width="0.5" fill="none"/>
        </svg>
      </div>
      <div class="eyebrow">Secure Access</div>
      <h2>Your magic<br/>link awaits.</h2>
      <div class="divider"></div>
      <p>Click the link below to sign in instantly — no password required. This link is unique to you and expires in 24 hours.</p>
      <div class="cta-wrap">
        <a href="${link}" class="cta">Sign In Securely</a>
      </div>
      <p class="footnote">
        If you didn't request this, you can safely ignore it.<br/>
        Having trouble? <a href="mailto:devs@inttlnt.com">Contact support</a>
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">Sent with care &nbsp;·&nbsp; Do not share this link</p>
    </div>
  </div>
</body>
</html>`
}