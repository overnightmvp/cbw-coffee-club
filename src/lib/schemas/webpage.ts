/**
 * WebPage Schema Generator
 *
 * Generates Schema.org WebPage structured data for blog post pages.
 * Provides page context and relationship to website.
 *
 * Always generated for all blog posts.
 */

export interface PostForWebPage {
  slug: string
  title: string
  excerpt?: string
  publishedAt: string
  updatedAt?: string
  featuredImage?: string
}

export function generateWebPageSchema(post: PostForWebPage) {
  const baseUrl = 'https://thebeanroute.com.au'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/blog/${post.slug}#webpage`,

    url: `${baseUrl}/blog/${post.slug}`,
    name: post.title,
    description: post.excerpt,

    // Part of website
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: 'The Bean Route',
      url: baseUrl,
    },

    // Primary image
    primaryImageOfPage: post.featuredImage ? {
      '@type': 'ImageObject',
      url: `${baseUrl}${post.featuredImage}`,
      width: 1200,
      height: 630,
    } : undefined,

    // Dates
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,

    // Page type indicators
    inLanguage: 'en-AU',
    potentialAction: {
      '@type': 'ReadAction',
      target: [`${baseUrl}/blog/${post.slug}`],
    },
  }
}
