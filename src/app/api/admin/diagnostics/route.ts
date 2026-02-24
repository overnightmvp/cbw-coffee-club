import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      brevo_api_key: {
        configured: !!process.env.BREVO_API_KEY,
        value: process.env.BREVO_API_KEY ? `${process.env.BREVO_API_KEY.substring(0, 10)}...` : 'NOT SET'
      },
      database_uri: {
        configured: !!process.env.DATABASE_URI,
        value: process.env.DATABASE_URI ? 'CONFIGURED' : 'NOT SET'
      },
      supabase_url: {
        configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
      },
      supabase_service_role: {
        configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        value: process.env.SUPABASE_SERVICE_ROLE_KEY ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...` : 'NOT SET'
      },
      base_url: {
        configured: !!process.env.NEXT_PUBLIC_BASE_URL,
        value: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'
      }
    }
  }

  return NextResponse.json(diagnostics)
}
