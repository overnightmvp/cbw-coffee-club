import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, AdminSession } from '@/lib/session-config'

export const dynamic = 'force-dynamic'

export async function POST() {
    try {
        const cookieStore = await cookies()
        const session = await getIronSession<AdminSession>(cookieStore, sessionOptions)
        session.destroy()

        const response = NextResponse.json({ success: true })

        // Also explicitly clear the legacy cookie if it exists
        response.cookies.delete('admin_session')

        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
    }
}
