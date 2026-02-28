import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getAllPosts } from '@/lib/posts'
import { ReadingTime } from '@/components/blog/ReadingTime'
import type { Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Coffee Cart Hire Blog | Melbourne Event Planning & Vendor Guides',
  description: 'Expert guides on hiring coffee carts in Melbourne, event planning tips, and vendor resources. Learn about pricing, permits, and best practices.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  // Group posts by category
  const guidePosts = posts.filter(p => p.category === 'guides')
  const otherPosts = posts.filter(p => p.category !== 'guides')

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Coffee Cart Hire Blog
        </h1>
        <p className="text-xl text-gray-600">
          Expert guides for event organizers and coffee cart vendors in Melbourne
        </p>
      </div>

      {/* Guide Posts */}
      {guidePosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">Event Planning Guides</h2>
            <Badge variant="default">For Organizers</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guidePosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Other Posts */}
      {otherPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* No posts state */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No blog posts published yet. Check back soon for expert guides!
          </p>
        </div>
      )}
    </div>
  )
}

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-3">
            <Badge variant="outline" className="capitalize">
              {post.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {post.readingTime && (
              <>
                <span>·</span>
                <ReadingTime minutes={post.readingTime} />
              </>
            )}
          </div>
          <span className="text-primary font-semibold group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  )
}
