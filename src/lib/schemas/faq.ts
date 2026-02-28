/**
 * FAQPage Schema Generator
 *
 * Generates Schema.org FAQPage structured data for blog posts with FAQ sections.
 * Triggered when post has `faq` array in frontmatter.
 *
 * Enables Google's FAQ rich snippets in search results.
 */

export interface FAQItem {
  question: string
  answer: string
}

export interface PostWithFAQ {
  slug: string
  title: string
  faq?: FAQItem[]
}

export function generateFAQSchema(post: PostWithFAQ) {
  if (!post.faq || post.faq.length === 0) {
    return null
  }

  const baseUrl = 'https://thebeanroute.com.au'

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/blog/${post.slug}#faq`,

    mainEntity: post.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
