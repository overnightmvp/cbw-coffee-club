/**
 * FeaturedImage Component
 *
 * Optimized Next.js Image wrapper for blog post featured images.
 * Supports multiple variants (hero, card, og) with proper dimensions.
 *
 * Usage:
 *   <FeaturedImage
 *     src={post.featuredImage}
 *     alt={post.imageAlt}
 *     credit={post.imageCredit}
 *     variant="hero"
 *     priority
 *   />
 */

import Image from 'next/image'

interface FeaturedImageProps {
  src: string
  alt: string
  credit?: string
  priority?: boolean
  variant?: 'hero' | 'card' | 'og'
  className?: string
}

export function FeaturedImage({
  src,
  alt,
  credit,
  priority = false,
  variant = 'hero',
  className = '',
}: FeaturedImageProps) {
  const dimensions = {
    hero: { width: 1200, height: 630 },
    card: { width: 600, height: 400 },
    og: { width: 1200, height: 630 },
  }[variant]

  const aspectRatioClass = {
    hero: 'aspect-[1200/630]',
    card: 'aspect-[3/2]',
    og: 'aspect-[1200/630]',
  }[variant]

  return (
    <figure className={`mb-8 ${className}`}>
      <div className={`relative w-full overflow-hidden rounded-xl ${aspectRatioClass}`}>
        <Image
          src={src}
          alt={alt}
          {...dimensions}
          priority={priority}
          quality={85}
          className="object-cover w-full h-full"
        />
      </div>
      {credit && (
        <figcaption className="text-sm text-neutral-500 mt-2 text-center">
          Photo: {credit}
        </figcaption>
      )}
    </figure>
  )
}
