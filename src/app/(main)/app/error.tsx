'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 text-6xl">☕️</div>
            <h2 className="mb-2 text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                Something went wrong!
            </h2>
            <p className="mb-8 max-w-md text-neutral-600">
                We couldn't load the coffee carts. This might be a temporary hiccup in the brew.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={reset}
                    className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold"
                >
                    Try again
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                >
                    Go back home
                </Button>
            </div>
        </div>
    )
}
