import * as brevo from '@getbrevo/brevo'

const brevoApiKey = process.env.BREVO_API_KEY

if (!brevoApiKey) {
  console.warn('BREVO_API_KEY not configured. Email sending will be skipped.')
}

const apiInstance = new brevo.TransactionalEmailsApi()
if (brevoApiKey) {
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoApiKey)
}

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
  if (!brevoApiKey) {
    console.log('[EMAIL SKIPPED] No BREVO_API_KEY configured')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${html.substring(0, 200)}...`)
    return false
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { email: 'noreply@coffeecartsmelbourne.com', name: 'Coffee Cart Marketplace' }
    sendSmtpEmail.to = [{ email: to }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html

    await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log(`[EMAIL SENT] To ${to}: ${subject}`)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
