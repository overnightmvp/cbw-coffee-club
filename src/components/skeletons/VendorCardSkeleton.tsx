import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * VendorCardSkeleton - Loading placeholder for vendor cards
 * Matches the structure of VendorCard component
 */
export function VendorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-t-lg" />

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Subtitle skeleton */}
        <Skeleton className="h-4 w-1/2" />

        {/* Badges skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </Card>
  )
}

/**
 * VendorCardSkeletonGrid - Grid of skeleton cards for browse page
 */
export function VendorCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
    </div>
  )
}
