import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, AdminSession } from './session-config'

/**
 * Get current admin session (server-side only)
 * Returns null if no valid session exists
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<AdminSession>(cookieStore, sessionOptions)

    if (!session.email) {
      console.log('[AUTH] No email found in iron-session cookie')
      return null
    }

    // Check expiration (iron-session handles this, but we keep it for backward compatibility)
    if (session.expires && session.expires < Date.now()) {
      return null
    }

    return session as AdminSession
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}
