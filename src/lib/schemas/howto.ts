/**
 * HowTo Schema Generator
 *
 * Generates Schema.org HowTo structured data for step-by-step guides.
 * Used for posts with contentType='howto' or titles containing "How to"
 *
 * Automatically extracts steps from H2 headings in markdown.
 */

import type { Post } from './blog-posting'

export function generateHowToSchema(post: Post) {
  const baseUrl = 'https://thebeanroute.com.au'

  // Parse markdown H2 headings as steps
  // Matches: "## Step 1: Title" or "## Title" or "## Step 1 - Title"
  const stepRegex = /^##\s+(?:Step\s+\d+[:\-]?\s+)?(.*?)$/gm
  const stepMatches = Array.from(post.content.matchAll(stepRegex))

  const steps = stepMatches.map((match, index) => {
    const stepText = match[1].trim()

    // Extract content between this heading and next heading
    const startIndex = match.index || 0
    const nextMatch = stepMatches[index + 1]
    const endIndex = nextMatch?.index || post.content.length
    const stepContent = post.content.slice(startIndex, endIndex)

    // Extract first paragraph as step description
    const paragraphMatch = stepContent.match(/\n\n([^\n]+)\n/)
    const description = paragraphMatch ? paragraphMatch[1] : ''

    return {
      '@type': 'HowToStep',
      position: index + 1,
      name: stepText,
      text: description,
      url: `${baseUrl}/blog/${post.slug}#step-${index + 1}`,
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${baseUrl}/blog/${post.slug}#howto`,

    name: post.title,
    description: post.excerpt,

    // Featured image
    image: post.featuredImage ? {
      '@type': 'ImageObject',
      url: `${baseUrl}${post.featuredImage}`,
      width: 1200,
      height: 630,
    } : undefined,

    // Time estimate (reading time as proxy for completion time)
    totalTime: post.readingTime ? `PT${post.readingTime}M` : undefined,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'AUD',
      value: '0', // Free guide
    },

    // Steps extracted from content
    step: steps,

    // Supply/tools (can be extended based on content)
    supply: [],
    tool: [],
  }
}
