/**
 * AuthorByline Component
 *
 * Displays author information with avatar and metadata.
 * Supports both company (Organization) and individual (Person) authors.
 *
 * Usage:
 *   <AuthorByline author={author} publishedAt={post.publishedAt} />
 */

import Image from 'next/image'
import type { Author } from '@/lib/authors'

interface AuthorBylineProps {
  author: Author
  publishedAt: string
  updatedAt?: string
  className?: string
}

export function AuthorByline({
  author,
  publishedAt,
  updatedAt,
  className = '',
}: AuthorBylineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Author Avatar */}
      {author.avatar && (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Author Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-neutral-900">{author.name}</span>
          {author.role && (
            <>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-600">{author.role}</span>
            </>
          )}
        </div>

        {/* Publication Date */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          {updatedAt && updatedAt !== publishedAt && (
            <>
              <span>·</span>
              <span>Updated {formatDate(updatedAt)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
