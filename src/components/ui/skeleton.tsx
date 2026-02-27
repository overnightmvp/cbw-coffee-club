import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Skeleton - Branded loading placeholder with brown palette
 * Animates from brown-100 to brown-50 for subtle shimmer effect
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-brown-100 rounded', className)}
      style={style}
    />
  )
}
