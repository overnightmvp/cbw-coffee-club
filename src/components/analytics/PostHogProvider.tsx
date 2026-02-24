'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// Only initialize PostHog if a valid API key is provided
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false // Handled manually for SPA-like transitions in Next.js
    })
}

export function PostHogPageview(): null {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Only track if PostHog is initialized (key was provided)
        if (pathname && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            let url = window.origin + pathname
            if (searchParams && searchParams.toString()) {
                url = url + '?' + searchParams.toString()
            }
            posthog.capture('$pageview', {
                '$current_url': url,
            })
        }
    }, [pathname, searchParams])

    return null
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    // If no PostHog key is configured, just render children without analytics
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        return <>{children}</>
    }

    return (
        <PostHogProvider client={posthog}>
            <PostHogPageview />
            {children}
        </PostHogProvider>
    )
}
