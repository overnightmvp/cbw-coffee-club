import React from 'react'

interface SkeletonProps {
    className?: string
    style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-neutral-200 rounded \${className}`}
            style={style}
        />
    )
}

export function VendorCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 px-2 rounded-full" />
                    <Skeleton className="h-5 w-16 px-2 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
            </div>
        </div>
    )
}
