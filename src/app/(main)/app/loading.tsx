import { VendorCardSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-neutral-200 animate-pulse rounded" />
                    <div className="h-4 w-48 bg-neutral-200 animate-pulse rounded" />
                </div>
                <div className="h-10 w-48 bg-neutral-200 animate-pulse rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <VendorCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
