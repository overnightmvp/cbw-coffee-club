import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * FormSkeleton - Loading placeholder for form inputs
 * Use when loading form data or waiting for form initialization
 */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array(fields)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Label skeleton */}
            <Skeleton className="h-4 w-24" />
            {/* Input skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

      {/* Submit button skeleton */}
      <div className="pt-4">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  )
}

/**
 * FormModalSkeleton - Skeleton for modal with form
 */
export function FormModalSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Form fields */}
        <FormSkeleton fields={4} />
      </div>
    </Card>
  )
}
