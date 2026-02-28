/**
 * ReadingTime Component
 *
 * Displays estimated reading time with a clock icon.
 * Used in blog post headers and listing cards.
 *
 * Usage:
 *   <ReadingTime minutes={post.readingTime} />
 */

import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  minutes: number
  className?: string
}

export function ReadingTime({ minutes, className = '' }: ReadingTimeProps) {
  return (
    <div className={`flex items-center gap-1.5 text-sm text-neutral-600 ${className}`}>
      <Clock className="h-4 w-4" />
      <span>{minutes} min read</span>
    </div>
  )
}
