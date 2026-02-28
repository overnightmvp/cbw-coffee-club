/**
 * Reading Time Calculator
 *
 * Calculates estimated reading time for blog post content.
 * Algorithm: word count / 225 WPM (average adult reading speed)
 *
 * Usage:
 *   import { calculateReadingTime } from '@/lib/reading-time'
 *   const minutes = calculateReadingTime(post.content)
 */

const WORDS_PER_MINUTE = 225

/**
 * Calculate reading time in minutes
 * Removes frontmatter, code blocks, and images for accurate count
 *
 * @param content - Raw markdown content
 * @returns Reading time in minutes (minimum 1)
 */
export function calculateReadingTime(content: string): number {
  // Remove frontmatter (YAML between --- markers)
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links (keep text, remove URL)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')

  const wordCount = cleanContent.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE)

  return Math.max(1, minutes) // Minimum 1 minute
}

/**
 * Format reading time for display
 *
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`
}
