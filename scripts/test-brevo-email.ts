#!/usr/bin/env tsx
/**
 * Brevo Email Testing Utility
 * Tests transactional email sending with the current configuration
 */

import { BrevoClient } from '@getbrevo/brevo'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const brevoApiKey = process.env.BREVO_API_KEY

if (!brevoApiKey) {
  console.error('❌ ERROR: BREVO_API_KEY not found in environment variables')
  process.exit(1)
}

const client = new BrevoClient({ apiKey: brevoApiKey })

async function sendTestEmail(recipientEmail: string): Promise<void> {
  try {
    console.log(`\n🧪 Testing Brevo Email Configuration`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📧 Recipient: ${recipientEmail}`)
    console.log(`📤 Sender: noreply@coffeecartsmelbourne.com`)

    const result = await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: 'noreply@coffeecartsmelbourne.com',
        name: 'Coffee Cart Marketplace'
      },
      to: [{ email: recipientEmail }],
      subject: '☕ Test Email - Brevo Configuration Verification',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #6B4226 0%, #3B2A1A 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #F5C842; font-size: 28px; font-weight: 700;">
                        ✅ Email Test Successful
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #3B2A1A; font-size: 22px;">Brevo Configuration Verified</h2>

                      <p style="margin: 0 0 16px 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;">
                        This is a test email to verify your Brevo transactional email configuration.
                      </p>

                      <div style="background-color: #FAF5F0; border-left: 4px solid #F5C842; padding: 20px; margin: 24px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 12px 0; color: #6B4226; font-size: 16px;">Configuration Details:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #4A4A4A; font-size: 14px; line-height: 1.8;">
                          <li><strong>Sender Email:</strong> noreply@coffeecartsmelbourne.com</li>
                          <li><strong>Sender Name:</strong> Coffee Cart Marketplace</li>
                          <li><strong>API Provider:</strong> Brevo (SendinBlue)</li>
                          <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
                        </ul>
                      </div>

                      <p style="margin: 24px 0 0 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;">
                        If you received this email, your transactional email system is working correctly! ☕
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #FAF5F0; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; color: #6B4226; font-size: 16px; font-weight: 600;">
                        The Bean Route — Coffee Cart Marketplace
                      </p>
                      <p style="margin: 8px 0 0 0; color: #8B8B8B; font-size: 14px;">
                        Melbourne, Australia
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    })

    console.log(`\n✅ SUCCESS: Email sent successfully!`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📬 Message ID: ${(result as any).messageId}`)
    console.log(`\n💡 Check the recipient's inbox (including spam folder)`)
    console.log(`\n`)
  } catch (error: any) {
    console.error(`\n❌ ERROR: Failed to send test email`)
    console.error(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.error(`Message: ${error.message}`)
    if (error.response?.body) {
      console.error(`Response:`, JSON.stringify(error.response.body, null, 2))
    }
    console.error(`\n`)
    process.exit(1)
  }
}

// Main execution
const recipientEmail = process.argv[2]

if (!recipientEmail || !recipientEmail.includes('@')) {
  console.error('❌ Usage: npm run test:email <recipient@example.com>')
  process.exit(1)
}

sendTestEmail(recipientEmail)
