/**
 * ItemList Schema Generator
 *
 * Generates Schema.org ItemList structured data for listicle/roundup posts.
 * Used for posts with contentType='listicle' or titles like "Top 10", "Best X"
 *
 * Automatically extracts list items from H3 numbered headings.
 */

import type { Post } from './blog-posting'

export function generateItemListSchema(post: Post) {
  const baseUrl = 'https://thebeanroute.com.au'

  // Parse markdown H3 numbered headings as list items
  // Matches: "### 1. Title" or "### 1) Title" or "### #1 Title"
  const itemRegex = /^###\s+(?:#?\d+[.)\s]+)(.*?)$/gm
  const itemMatches = Array.from(post.content.matchAll(itemRegex))

  if (itemMatches.length === 0) {
    // Fallback: try H2 headings if no H3 numbered items found
    const h2Regex = /^##\s+(?:#?\d+[.)\s]+)(.*?)$/gm
    const h2Matches = Array.from(post.content.matchAll(h2Regex))

    if (h2Matches.length === 0) {
      return null // No list items found
    }

    return generateList(baseUrl, post, h2Matches)
  }

  return generateList(baseUrl, post, itemMatches)
}

function generateList(
  baseUrl: string,
  post: Post,
  itemMatches: RegExpMatchArray[]
) {
  const items = itemMatches.map((match, index) => {
    const itemName = match[1].trim()

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: itemName,
      url: `${baseUrl}/blog/${post.slug}#item-${index + 1}`,
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${baseUrl}/blog/${post.slug}#itemlist`,

    name: post.title,
    description: post.excerpt,

    numberOfItems: items.length,
    itemListElement: items,
  }
}
