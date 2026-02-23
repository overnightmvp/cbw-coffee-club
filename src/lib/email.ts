import { BrevoClient } from '@getbrevo/brevo'

const brevoApiKey = process.env.BREVO_API_KEY

if (!brevoApiKey) {
  console.warn('BREVO_API_KEY not configured. Email sending will be skipped.')
}

const client = brevoApiKey ? new BrevoClient({ apiKey: brevoApiKey }) : null

/**
 * Send an email via Brevo (formerly Sendinblue)
 * Server-side only - never call from client components
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param html - HTML email body
 * @returns Promise resolving to success status
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!client || !brevoApiKey) {
    console.log('[EMAIL SKIPPED] No BREVO_API_KEY configured')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${html.substring(0, 200)}...`)
    return false
  }

  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: { email: 'noreply@coffeecartsmelbourne.com', name: 'Coffee Cart Marketplace' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    })

    console.log(`[EMAIL SENT] To ${to}: ${subject}`)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
