/**
 * LocalBusiness Schema Generator (Vendor Mentions)
 *
 * Generates Schema.org LocalBusiness structured data for coffee vendors mentioned in blog posts.
 * Triggered when post has `vendorMentions` array in frontmatter.
 *
 * Creates knowledge graph connections and improves local SEO.
 */

export interface VendorMention {
  slug: string
  name: string
}

export interface PostWithVendors {
  slug: string
  vendorMentions?: VendorMention[]
}

export function generateVendorMentionsSchema(
  post: PostWithVendors,
  vendors: VendorMention[]
) {
  if (!vendors || vendors.length === 0) {
    return []
  }

  const baseUrl = 'https://thebeanroute.com.au'

  return vendors.map(vendor => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/vendors/${vendor.slug}#localbusiness`,

    name: vendor.name,
    url: `${baseUrl}/vendors/${vendor.slug}`,

    // Service area
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
      addressRegion: 'Victoria',
      addressCountry: 'Australia',
    },

    // Business type
    '@additionalType': 'https://schema.org/FoodEstablishment',
    servesCuisine: 'Coffee',

    // Mentioned in (link back to blog post)
    subjectOf: {
      '@type': 'BlogPosting',
      url: `${baseUrl}/blog/${post.slug}`,
    },
  }))
}
