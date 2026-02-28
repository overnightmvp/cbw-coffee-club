/**
 * Schema Orchestrator - Master Schema Generator
 *
 * Dynamically generates appropriate Schema.org JSON-LD markup for blog posts.
 * Combines multiple schemas based on content type and frontmatter fields.
 *
 * Usage:
 *   import { generateAllSchemas } from '@/lib/schemas'
 *   const schemas = generateAllSchemas(post)
 *   <JsonLd data={schemas} />
 */

import { getAuthor } from '../authors'
import { generateBlogPostingSchema } from './blog-posting'
import { generateHowToSchema } from './howto'
import { generateItemListSchema } from './itemlist'
import { generateFAQSchema } from './faq'
import { generateBreadcrumbSchema } from './breadcrumbs'
import { generateVendorMentionsSchema } from './vendor-mentions'
import { generateOrganizationSchema } from './organization'
import { generatePersonSchema } from './person'
import { generateWebPageSchema } from './webpage'

import type { FAQItem } from './faq'
import type { VendorMention } from './vendor-mentions'

/**
 * Extended Post interface with all optional SEO fields
 */
export interface Post {
  slug: string
  title: string
  excerpt?: string
  content: string
  publishedAt: string
  updatedAt?: string
  status: 'published' | 'draft'
  category?: string
  author?: string
  featuredImage?: string
  imageAlt?: string
  imageCredit?: string
  keywords?: string[]
  readingTime?: number
  metaDescription?: string
  contentType?: 'howto' | 'article' | 'listicle' | 'review' | 'guide'
  faq?: FAQItem[]
  vendorMentions?: VendorMention[]
  canonical?: string
  noindex?: boolean
  speakableSections?: string[]
  relatedPosts?: string[]
}

/**
 * Generate all appropriate schemas for a blog post
 *
 * Schema Selection Logic:
 * 1. Always include: BreadcrumbList, WebPage, Organization
 * 2. Content schema (one of): HowTo, ItemList, BlogPosting
 * 3. Optional additions: FAQPage, LocalBusiness (vendor mentions), Person (individual author)
 *
 * Returns schemas in @graph format for efficient loading
 */
export function generateAllSchemas(post: Post) {
  const author = getAuthor(post.author)
  const schemas: any[] = []

  // ALWAYS INCLUDE: Core navigation and context schemas
  schemas.push(generateBreadcrumbSchema(post))
  schemas.push(generateWebPageSchema(post))
  schemas.push(generateOrganizationSchema())

  // CONTENT-SPECIFIC SCHEMA (only one)
  // Priority: HowTo > ItemList > BlogPosting
  const isHowTo = post.contentType === 'howto' ||
                  post.title.toLowerCase().includes('how to') ||
                  post.title.toLowerCase().startsWith('how ')

  const isListicle = post.contentType === 'listicle' ||
                     /^(top|best)\s+\d+/i.test(post.title) ||
                     /\d+\s+(ways|tips|steps|reasons)/i.test(post.title)

  if (isHowTo) {
    schemas.push(generateHowToSchema(post))
  } else if (isListicle) {
    const itemListSchema = generateItemListSchema(post)
    if (itemListSchema) {
      schemas.push(itemListSchema)
    } else {
      // Fallback to BlogPosting if no list items detected
      schemas.push(generateBlogPostingSchema(post, author))
    }
  } else {
    // Default: BlogPosting for general articles
    schemas.push(generateBlogPostingSchema(post, author))
  }

  // OPTIONAL ADDITIONS: FAQPage schema
  if (post.faq && post.faq.length > 0) {
    const faqSchema = generateFAQSchema(post)
    if (faqSchema) {
      schemas.push(faqSchema)
    }
  }

  // OPTIONAL ADDITIONS: LocalBusiness schemas (vendor mentions)
  if (post.vendorMentions && post.vendorMentions.length > 0) {
    const vendorSchemas = generateVendorMentionsSchema(post, post.vendorMentions)
    schemas.push(...vendorSchemas)
  }

  // OPTIONAL ADDITIONS: Person schema (individual author)
  if (author.role !== 'Editorial Team') {
    const personSchema = generatePersonSchema(author)
    if (personSchema) {
      schemas.push(personSchema)
    }
  }

  // Return as @graph for efficient loading
  // Filter out null/undefined schemas
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.filter(Boolean),
  }
}

/**
 * Get schema count for debugging/validation
 */
export function getSchemaCount(post: Post): number {
  const schemas = generateAllSchemas(post)
  return schemas['@graph'].length
}

/**
 * Export individual generators for testing/custom use
 */
export {
  generateBlogPostingSchema,
  generateHowToSchema,
  generateItemListSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateVendorMentionsSchema,
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebPageSchema,
}
