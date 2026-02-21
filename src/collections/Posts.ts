import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: ({ req }) => {
      // Public: published posts only
      if (!req.user) {
        return {
          status: {
            equals: 'published',
          },
        }
      }
      // Authenticated: all posts
      return true
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    // Standard Fields
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Auto-generated from title (can be customized)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 160,
      label: 'Excerpt (Meta Description)',
      admin: {
        description: 'Brief summary for search engines and social media (max 160 chars)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Post Content',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'Main image displayed at the top of the post',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish Date',
      admin: {
        position: 'sidebar',
        description: 'Scheduled or actual publish date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // Category & Conversion
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Event Focused', value: 'event-focused' },
        { label: 'Coffee Education', value: 'coffee-education' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'conversionGoal',
      type: 'select',
      required: true,
      options: [
        { label: 'Job Posting', value: 'job_posting' },
        { label: 'Vendor Signup', value: 'vendor_signup' },
        { label: 'Inquiry', value: 'inquiry' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Primary conversion goal for CTAs',
      },
    },

    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Keywords',
      fields: [
        {
          name: 'targetKeywords',
          type: 'array',
          label: 'Target Keywords',
          admin: {
            description: 'Primary keywords from content strategy',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'searchIntent',
          type: 'text',
          label: 'Search Intent',
          admin: {
            description: 'What users are looking for when searching these keywords',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          label: 'Custom Meta Description',
          admin: {
            description: 'Override the excerpt for search engines (optional)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
          admin: {
            description: 'Custom social media image (defaults to featured image)',
          },
        },
      ],
    },

    // Editorial Metadata (preserved from markdown)
    {
      name: 'editorial',
      type: 'group',
      label: 'Editorial Metadata',
      admin: {
        description: 'Planning data from content strategy',
      },
      fields: [
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Quick Win', value: 'quick-win' },
            { label: 'Authority', value: 'authority' },
            { label: 'Conversion', value: 'conversion' },
            { label: 'Specialized', value: 'specialized' },
          ],
          defaultValue: 'quick-win',
          admin: {
            description: 'Content strategy priority tier',
          },
        },
        {
          name: 'difficulty',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
          defaultValue: 'medium',
          admin: {
            description: 'Keyword ranking difficulty',
          },
        },
        {
          name: 'trafficPotential',
          type: 'number',
          label: 'Traffic Potential',
          admin: {
            description: 'Estimated monthly search volume',
          },
        },
        {
          name: 'outline',
          type: 'json',
          label: 'Content Outline',
          admin: {
            description: 'Structured outline with sections and word counts (from markdown)',
          },
        },
      ],
    },

    // Internal Linking
    {
      name: 'internalLinks',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Internal Links',
      admin: {
        description: 'Related articles to link within this post',
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Related Posts',
      admin: {
        description: 'Posts to display in "Related Articles" section (auto-populated by category if empty)',
      },
    },
  ],
  timestamps: true,
}

export default Posts
