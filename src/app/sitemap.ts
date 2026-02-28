/**
 * Sitemap Generator
 *
 * Generates XML sitemap for all public pages including:
 * - Static pages (home, marketplace, directories)
 * - Dynamic blog posts (from markdown files)
 * - Vendor pages (from Supabase)
 * - Job listings (from Supabase)
 *
 * Automatically updates when content changes.
 */

import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { supabase } from '@/lib/supabase-client'

const baseUrl = 'https://thebeanroute.com.au'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/app`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coffee-shops`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Blog posts
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Vendor pages (fetch from Supabase)
  const { data: vendors } = await supabase
    .from('vendors')
    .select('slug, updated_at')
    .eq('verified', true)

  const vendorPages: MetadataRoute.Sitemap = vendors?.map((vendor) => ({
    url: `${baseUrl}/vendors/${vendor.slug}`,
    lastModified: vendor.updated_at ? new Date(vendor.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  // Job listings (recent open jobs only)
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, created_at')
    .eq('status', 'open')
    .gte('event_date', new Date().toISOString())
    .limit(100)

  const jobPages: MetadataRoute.Sitemap = jobs?.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(job.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  })) || []

  return [...staticPages, ...blogPages, ...vendorPages, ...jobPages]
}
