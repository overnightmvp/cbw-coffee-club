import { supabaseAdmin } from './supabase-admin'

interface RateLimitConfig {
    identifier: string
    action: string
    maxRequests: number
    interval: string // PostgreSQL interval string, e.g., '1 hour', '24 hours'
}

/**
 * Check if a request exceeds the rate limit for a given identifier and action.
 * Uses a database-backed atomic function for serverless safety.
 */
export async function isRateLimited(config: RateLimitConfig): Promise<boolean> {
    const { identifier, action, maxRequests, interval } = config

    try {
        const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
            p_identifier: identifier,
            p_action: action,
            p_max_requests: maxRequests,
            p_interval: interval,
        })

        if (error) {
            console.error('Rate limit RPC error:', error)
            return false // Fail open to avoid blocking users on DB issues
        }

        return !data // If check_rate_limit returns false, it IS rate limited
    } catch (err) {
        console.error('Rate limit utility error:', err)
        return false
    }
}

/**
 * Helper to get a client identifier (IP or composite)
 */
export function getClientIdentifier(request: Request, additionalKey?: string): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

    if (additionalKey) {
        return `\${ip}:\${additionalKey}`
    }

    return ip
}
