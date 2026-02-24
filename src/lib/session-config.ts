import { SessionOptions } from 'iron-session'

export interface AdminSession {
    email: string
    expires: number
}

export const sessionOptions: SessionOptions = {
    password: process.env.ADMIN_SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
    cookieName: 'admin_session_signed',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
    },
}
