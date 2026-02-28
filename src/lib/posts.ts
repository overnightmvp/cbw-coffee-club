import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { calculateReadingTime } from './reading-time'

const postsDirectory = path.join(process.cwd(), 'content/posts')

/**
 * Blog Post Interface (Enhanced for SEO)
 *
 * All new fields are optional for backward compatibility with existing posts.
 * Fields will be auto-filled with defaults where applicable.
 */
export interface Post {
  // Required core fields
  slug: string
  title: string
  publishedAt: string
  status: 'published' | 'draft'
  content: string

  // Original optional fields
  category?: string
  excerpt?: string

  // SEO enhancements
  updatedAt?: string
  author?: string
  featuredImage?: string
  imageAlt?: string
  imageCredit?: string
  keywords?: string[]
  readingTime?: number
  metaDescription?: string

  // Content structure hints
  contentType?: 'howto' | 'article' | 'listicle' | 'review' | 'guide'
  faq?: Array<{ question: string; answer: string }>
  vendorMentions?: Array<{ slug: string; name: string }>

  // Advanced SEO
  canonical?: string
  noindex?: boolean
  speakableSections?: string[]
  relatedPosts?: string[]
}

/**
 * Get all published posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Auto-calculate reading time if not provided
      const readingTime = data.readingTime || calculateReadingTime(content)

      return {
        // Required fields
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        publishedAt: data.publishedAt || new Date().toISOString(),
        status: data.status || 'draft',
        content,

        // Original optional fields
        category: data.category,
        excerpt: data.excerpt,

        // New SEO fields (all optional)
        updatedAt: data.updatedAt,
        author: data.author,
        featuredImage: data.featuredImage,
        imageAlt: data.imageAlt,
        imageCredit: data.imageCredit,
        keywords: data.keywords,
        readingTime,
        metaDescription: data.metaDescription,

        // Content structure
        contentType: data.contentType,
        faq: data.faq,
        vendorMentions: data.vendorMentions,

        // Advanced
        canonical: data.canonical,
        noindex: data.noindex,
        speakableSections: data.speakableSections,
        relatedPosts: data.relatedPosts,
      } as Post
    })
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return posts
}

/**
 * Get a single post by slug
 * Returns null if not found
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    // Try direct slug match first
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Auto-calculate reading time if not provided
      const readingTime = data.readingTime || calculateReadingTime(content)

      return {
        // Required fields
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        publishedAt: data.publishedAt || new Date().toISOString(),
        status: data.status || 'draft',
        content,

        // Original optional fields
        category: data.category,
        excerpt: data.excerpt,

        // New SEO fields (all optional)
        updatedAt: data.updatedAt,
        author: data.author,
        featuredImage: data.featuredImage,
        imageAlt: data.imageAlt,
        imageCredit: data.imageCredit,
        keywords: data.keywords,
        readingTime,
        metaDescription: data.metaDescription,

        // Content structure
        contentType: data.contentType,
        faq: data.faq,
        vendorMentions: data.vendorMentions,

        // Advanced
        canonical: data.canonical,
        noindex: data.noindex,
        speakableSections: data.speakableSections,
        relatedPosts: data.relatedPosts,
      }
    }

    // Fallback: search all posts for matching frontmatter slug
    const posts = getAllPosts()
    return posts.find(post => post.slug === slug) || null
  } catch {
    return null
  }
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(post => post.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts
    .map(post => post.category)
    .filter((cat): cat is string => !!cat)
  return Array.from(new Set(categories))
}
