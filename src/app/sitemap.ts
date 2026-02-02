import { getAllVendors } from '@/lib/vendors'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thebeanroute.com.au'

const staticPages = [
  { url: '/', priority: 1.0 },
  { url: '/app', priority: 0.8 },
  { url: '/contractors', priority: 0.7 },
  { url: '/contractors/how-to-hire', priority: 0.6 },
  { url: '/contractors/coffee-cart-costs', priority: 0.6 },
  { url: '/vendors-guide', priority: 0.7 },
  { url: '/vendors-guide/get-listed', priority: 0.6 },
  { url: '/vendors-guide/grow-your-business', priority: 0.6 },
  { url: '/jobs', priority: 0.6 },
  { url: '/vendors/register', priority: 0.7 },
]

export default function sitemap() {
  const vendors = getAllVendors()

  const vendorPages = vendors.map((vendor) => ({
    url: `${baseUrl}/vendors/${vendor.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page.priority,
  }))

  return [...staticEntries, ...vendorPages]
}
