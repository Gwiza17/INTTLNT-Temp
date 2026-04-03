/**
 * Notification utilities for Sprint 3 Marketplace
 * Handles email notifications for interest events
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface InterestNotificationData {
  candidateEmail: string
  candidateName: string
  stakeholderName: string
  stakeholderOrg: string
  cohortName: string
  discipline: string
  stakeholderNote?: string
  candidateRef: string
}

export interface RevealNotificationData {
  stakeholderEmail: string
  stakeholderName: string
  candidateName?: string  // Only if approved
  candidateEmail?: string // Only if approved
  candidateRef: string
  cohortName: string
  status: 'approved' | 'declined'
  candidatePhone?: string
  candidateLinkedIn?: string
}

/**
 * Send email notification to candidate when stakeholder expresses interest
 */
export async function sendInterestNotification(data: InterestNotificationData) {
  try {
    const subject = `New Interest in Your Profile - ${data.cohortName}`
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0B1F3B; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .stakeholder-note { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; font-style: italic; }
        .highlight { color: #0B1F3B; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Interest in Your Profile</h1>
            <p>A stakeholder is interested in connecting with you</p>
        </div>
        
        <div class="content">
            <p>Dear <span class="highlight">${data.candidateName}</span>,</p>
            
            <p>Great news! <strong>${data.stakeholderName}</strong> from <strong>${data.stakeholderOrg}</strong> has expressed interest in your profile in the <span class="highlight">${data.cohortName}</span> cohort.</p>
            
            <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📋 Profile Details</h3>
                <p><strong>Candidate Reference:</strong> ${data.candidateRef}</p>
                <p><strong>Cohort:</strong> ${data.cohortName}</p>
                <p><strong>Discipline:</strong> ${data.discipline}</p>
            </div>
            
            ${data.stakeholderNote ? `
            <div class="stakeholder-note">
                <h4>💬 Message from ${data.stakeholderName}:</h4>
                <p>"${data.stakeholderNote}"</p>
            </div>
            ` : ''}
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Log in to your INTTLNT dashboard</li>
                <li>Review the interest request details</li>
                <li>Choose to approve or decline sharing your contact information</li>
                <li>If approved, your full details will be shared with the stakeholder</li>
            </ol>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/applicant/interests" class="button">
                    Review Interest Request
                </a>
            </div>
            
            <p><small><strong>Privacy Note:</strong> Your personal information remains private until you approve sharing. Only anonymous profile data has been visible to stakeholders.</small></p>
        </div>
        
        <div class="footer">
            <p>This email was sent by INTTLNT - Global Talent Mobility Platform</p>
            <p>If you have questions, contact us at support@inttlnt.com</p>
        </div>
    </div>
</body>
</html>
    `

    const { data: result, error } = await resend.emails.send({
      from: 'INTTLNT <notifications@inttlnt.com>',
      to: [data.candidateEmail],
      subject: subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Failed to send interest notification:', error)
      return { success: false, error }
    }

    console.log('Interest notification sent successfully:', result)
    return { success: true, data: result }

  } catch (error) {
    console.error('Error sending interest notification:', error)
    return { success: false, error }
  }
}

/**
 * Send email notification to stakeholder when candidate responds to interest
 */
export async function sendRevealNotification(data: RevealNotificationData) {
  try {
    const isApproved = data.status === 'approved'
    const subject = isApproved 
      ? `Contact Details Shared - ${data.candidateRef}` 
      : `Interest Declined - ${data.candidateRef}`
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isApproved ? '#10b981' : '#ef4444'}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .contact-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .declined-info { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .highlight { color: #0B1F3B; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${isApproved ? '✅ Contact Details Shared' : '❌ Interest Declined'}</h1>
            <p>Update on your interest request for ${data.candidateRef}</p>
        </div>
        
        <div class="content">
            <p>Dear <span class="highlight">${data.stakeholderName}</span>,</p>
            
            ${isApproved ? `
            <p>Excellent news! The candidate <strong>${data.candidateName}</strong> has approved sharing their contact details with you.</p>
            
            <div class="contact-info">
                <h3>📞 Contact Information</h3>
                <p><strong>Name:</strong> ${data.candidateName}</p>
                <p><strong>Email:</strong> ${data.candidateEmail}</p>
                ${data.candidatePhone ? `<p><strong>Phone:</strong> ${data.candidatePhone}</p>` : ''}
                ${data.candidateLinkedIn ? `<p><strong>LinkedIn:</strong> ${data.candidateLinkedIn}</p>` : ''}
                <p><strong>Reference:</strong> ${data.candidateRef}</p>
                <p><strong>Cohort:</strong> ${data.cohortName}</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Reach out to the candidate directly using the contact information above</li>
                <li>Schedule an initial conversation to discuss opportunities</li>
                <li>Continue the conversation through your preferred channels</li>
            </ul>
            
            <p><em>We recommend reaching out within 48 hours while your request is fresh in the candidate's mind.</em></p>
            ` : `
            <p>Unfortunately, the candidate has declined to share their contact details at this time.</p>
            
            <div class="declined-info">
                <h3>ℹ️ What This Means</h3>
                <p><strong>Candidate Reference:</strong> ${data.candidateRef}</p>
                <p><strong>Cohort:</strong> ${data.cohortName}</p>
                <p>The candidate has chosen not to proceed with contact sharing for now. This could be due to timing, fit, or other personal factors.</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Continue browsing other candidates in the marketplace</li>
                <li>Consider expressing interest in similar profiles</li>
                <li>The candidate may become available in the future</li>
            </ul>
            `}
        </div>
        
        <div class="footer">
            <p>This email was sent by INTTLNT - Global Talent Mobility Platform</p>
            <p>Visit your dashboard to manage more interests: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard">Dashboard</a></p>
        </div>
    </div>
</body>
</html>
    `

    const { data: result, error } = await resend.emails.send({
      from: 'INTTLNT <notifications@inttlnt.com>',
      to: [data.stakeholderEmail],
      subject: subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Failed to send reveal notification:', error)
      return { success: false, error }
    }

    console.log('Reveal notification sent successfully:', result)
    return { success: true, data: result }

  } catch (error) {
    console.error('Error sending reveal notification:', error)
    return { success: false, error }
  }
}

/**
 * Send a simple text-based notification for environments without HTML support
 */
export async function sendSimpleInterestNotification(data: InterestNotificationData) {
  try {
    const subject = `New Interest in Your Profile - ${data.cohortName}`
    const textContent = `
Dear ${data.candidateName},

Great news! ${data.stakeholderName} from ${data.stakeholderOrg} has expressed interest in your profile in the ${data.cohortName} cohort.

Profile Details:
- Candidate Reference: ${data.candidateRef}
- Cohort: ${data.cohortName}  
- Discipline: ${data.discipline}

${data.stakeholderNote ? `Message from ${data.stakeholderName}: "${data.stakeholderNote}"` : ''}

Next Steps:
1. Log in to your INTTLNT dashboard
2. Review the interest request details  
3. Choose to approve or decline sharing your contact information
4. If approved, your full details will be shared with the stakeholder

Review your interest requests: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/applicant/interests

Privacy Note: Your personal information remains private until you approve sharing.

Best regards,
The INTTLNT Team
    `

    const { data: result, error } = await resend.emails.send({
      from: 'INTTLNT <notifications@inttlnt.com>',
      to: [data.candidateEmail],
      subject: subject,
      text: textContent,
    })

    if (error) {
      console.error('Failed to send simple interest notification:', error)
      return { success: false, error }
    }

    return { success: true, data: result }

  } catch (error) {
    console.error('Error sending simple interest notification:', error)
    return { success: false, error }
  }
}
