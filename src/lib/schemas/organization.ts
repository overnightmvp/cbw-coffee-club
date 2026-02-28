/**
 * Organization Schema Generator
 *
 * Generates Schema.org Organization structured data for The Bean Route.
 * Represents the publisher/company entity.
 *
 * Always included on blog pages for brand identity.
 */

export function generateOrganizationSchema() {
  const baseUrl = 'https://thebeanroute.com.au'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,

    name: 'The Bean Route',
    url: baseUrl,

    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 600,
      height: 60,
    },

    description: 'Melbourne\'s leading coffee cart marketplace connecting event organizers with specialty coffee vendors. We curate quality mobile baristas for corporate events, weddings, festivals, and private functions.',

    // Contact information
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
      addressRegion: 'Victoria',
      addressCountry: 'Australia',
    },

    // Social media profiles (add when created)
    sameAs: [
      // 'https://facebook.com/thebeanroute',
      // 'https://instagram.com/thebeanroute',
      // 'https://twitter.com/thebeanroute',
    ],

    // Business type
    '@additionalType': 'https://schema.org/OnlineMarketplace',
  }
}
