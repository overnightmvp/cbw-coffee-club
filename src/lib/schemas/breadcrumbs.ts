/**
 * BreadcrumbList Schema Generator
 *
 * Generates Schema.org BreadcrumbList structured data for navigation hierarchy.
 * Improves site hierarchy display in Google search results.
 *
 * Always generated for all blog posts.
 */

export interface PostForBreadcrumb {
  slug: string
  title: string
  category?: string
}

export function generateBreadcrumbSchema(post: PostForBreadcrumb) {
  const baseUrl = 'https://thebeanroute.com.au'

  // Capitalize category for display
  const capitalizeCategory = (cat?: string) => {
    if (!cat) return 'Articles'
    return cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/blog/${post.slug}#breadcrumb`,

    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: capitalizeCategory(post.category),
        item: `${baseUrl}/blog?category=${post.category || 'all'}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  }
}
