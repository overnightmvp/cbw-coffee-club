/**
 * Person Schema Generator
 *
 * Generates Schema.org Person structured data for individual blog authors.
 * Skipped for company author ("The Bean Route").
 *
 * Improves author credibility signals for Google E-E-A-T.
 */

import type { Author } from '../authors'

export function generatePersonSchema(author: Author) {
  // Skip for company/editorial team author
  if (author.role === 'Editorial Team') {
    return null
  }

  const baseUrl = 'https://thebeanroute.com.au'

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/authors/${author.id}#person`,

    name: author.name,
    jobTitle: author.role,
    description: author.bio,

    // Profile image
    image: author.avatar ? {
      '@type': 'ImageObject',
      url: `${baseUrl}${author.avatar}`,
      width: 200,
      height: 200,
    } : undefined,

    // Contact
    email: author.email,
    url: author.url || `${baseUrl}/authors/${author.id}`,

    // Social profiles
    sameAs: author.social ? Object.values(author.social).filter(Boolean) : [],

    // Employment
    worksFor: {
      '@type': 'Organization',
      name: 'The Bean Route',
      url: baseUrl,
    },

    // Knowledge area
    knowsAbout: [
      'Event Coffee Catering',
      'Mobile Coffee Carts',
      'Specialty Coffee',
      'Event Planning',
      'Melbourne Coffee Scene',
    ],
  }
}
