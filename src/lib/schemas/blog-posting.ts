/**
 * BlogPosting Schema Generator
 *
 * Generates Schema.org BlogPosting structured data for blog posts.
 * Used as default schema type for general articles.
 */

import type { Author } from '../authors'

export interface Post {
  slug: string
  title: string
  excerpt?: string
  content: string
  publishedAt: string
  updatedAt?: string
  category?: string
  keywords?: string[]
  readingTime?: number
  featuredImage?: string
  imageAlt?: string
  speakableSections?: string[]
}

export function generateBlogPostingSchema(post: Post, author: Author) {
  const baseUrl = 'https://thebeanroute.com.au'

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${baseUrl}/blog/${post.slug}#blogposting`,

    // Core content
    headline: post.title,
    alternativeHeadline: post.excerpt,
    description: post.excerpt,
    articleBody: post.content.slice(0, 5000), // First 5000 chars for LLM context

    // Word count for quality signal
    wordCount: post.content.split(/\s+/).length,

    // Dates (critical for freshness ranking)
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,

    // Images
    image: post.featuredImage ? {
      '@type': 'ImageObject',
      url: `${baseUrl}${post.featuredImage}`,
      width: 1200,
      height: 630,
      caption: post.imageAlt || post.title,
    } : undefined,

    // Author (dynamic type based on role)
    author: {
      '@type': author.role === 'Editorial Team' ? 'Organization' : 'Person',
      name: author.name,
      url: author.url || `${baseUrl}/about`,
      ...(author.role !== 'Editorial Team' && {
        jobTitle: author.role,
        email: author.email,
      }),
    },

    // Publisher (always The Bean Route)
    publisher: {
      '@type': 'Organization',
      name: 'The Bean Route',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 600,
        height: 60,
      },
    },

    // Main entity (canonical page reference)
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },

    // SEO metadata
    keywords: post.keywords?.join(', '),
    timeRequired: post.readingTime ? `PT${post.readingTime}M` : undefined,
    articleSection: post.category,

    // Voice search optimization (speakable)
    ...(post.speakableSections && post.speakableSections.length > 0 && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: post.speakableSections.map(id => `#${id}`),
      },
    }),
  }
}
