/**
 * Authors - Centralized Author Metadata
 *
 * Stores author information for blog posts.
 * Supports mix of company (The Bean Route) + individual contributors.
 *
 * Usage:
 *   import { getAuthor } from '@/lib/authors'
 *   const author = getAuthor('sarah-chen')
 */

export interface Author {
  id: string
  name: string
  role: string
  bio: string
  avatar?: string
  email?: string
  social?: {
    twitter?: string
    linkedin?: string
  }
  url?: string
}

export const authors: Record<string, Author> = {
  'the-bean-route': {
    id: 'the-bean-route',
    name: 'The Bean Route',
    role: 'Editorial Team',
    bio: 'Melbourne\'s leading coffee cart marketplace connecting event organizers with specialty coffee vendors. We share insights on event coffee catering, vendor tips, and the Melbourne coffee scene.',
    avatar: '/authors/bean-route-logo.png',
    url: 'https://thebeanroute.com.au/about',
  },
  'sarah-chen': {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'Event Coffee Specialist',
    bio: '10+ years planning corporate events in Melbourne. Coffee cart hire expert and specialty coffee enthusiast helping event organizers create memorable coffee experiences.',
    avatar: '/authors/sarah-chen.jpg',
    email: 'sarah@thebeanroute.com.au',
    social: {
      linkedin: 'https://linkedin.com/in/sarahchen',
    },
  },
}

/**
 * Get author by ID
 * Falls back to 'the-bean-route' if author not found
 */
export function getAuthor(authorId?: string): Author {
  if (!authorId) return authors['the-bean-route']
  return authors[authorId] || authors['the-bean-route']
}

/**
 * Get all authors
 */
export function getAllAuthors(): Author[] {
  return Object.values(authors)
}
