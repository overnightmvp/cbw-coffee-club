#!/usr/bin/env tsx
/**
 * Direct Brevo API test using fetch (bypassing SDK)
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const apiKey = process.env.BREVO_API_KEY

if (!apiKey) {
  console.error('❌ No API key found')
  process.exit(1)
}

async function testDirect(recipient: string) {
  console.log(`\n🧪 Testing Brevo API (Direct HTTP)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📧 Recipient: ${recipient}`)
  console.log(`🔑 API Key: ${apiKey.substring(0, 30)}...`)

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Coffee Cart Marketplace',
          email: 'noreply@coffeecartsmelbourne.com'
        },
        to: [{ email: recipient }],
        subject: '☕ Direct API Test',
        htmlContent: '<html><body><h1>Direct API Test</h1><p>If you see this, the API works!</p></body></html>'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`\n❌ HTTP ${response.status}: ${response.statusText}`)
      console.error(`Response:`, JSON.stringify(data, null, 2))
      process.exit(1)
    }

    console.log(`\n✅ SUCCESS!`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.error(`\n❌ ERROR:`, error.message)
    process.exit(1)
  }
}

const recipient = process.argv[2] || 'test@example.com'
testDirect(recipient)
