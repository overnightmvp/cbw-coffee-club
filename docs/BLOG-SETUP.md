# Blog Setup Guide

## Overview

The Bean Route blog is integrated with Payload CMS for content management. The blog infrastructure is production-ready and optimized for SEO.

## Routes

- **Blog List**: `/blog` - Shows all published posts grouped by category
- **Blog Post**: `/blog/[slug]` - Individual post pages with full content
- **Admin CMS**: `/admin` - Payload CMS for creating/editing posts

## Architecture

### Pages
- `src/app/blog/page.tsx` - Blog list page with category grouping
- `src/app/blog/[slug]/page.tsx` - Blog post detail page

### Components
- `src/components/blog/RichTextRenderer.tsx` - Renders Lexical editor content
- Blog navigation integrated in `src/components/navigation/Header.tsx`

### Data Layer
- Payload CMS Posts collection (`src/collections/Posts.ts`)
- PostgreSQL database via Supabase
- Separate `payload` schema (no conflicts with existing tables)

## Payload Posts Collection

### Standard Fields
- **title**: Post title (auto-generates slug)
- **slug**: URL-friendly slug (auto-generated, can customize)
- **excerpt**: Meta description (max 160 chars)
- **content**: Lexical rich text editor
- **featuredImage**: Upload from Media collection
- **status**: draft | published | scheduled
- **publishedAt**: Publish date/time
- **category**: event-focused | coffee-education

### SEO Fields
- **targetKeywords**: Array of target keywords
- **searchIntent**: What users are looking for
- **metaDescription**: Custom meta description (overrides excerpt)
- **ogImage**: Social media image (defaults to featured image)

### Editorial Metadata
- **priority**: quick-win | authority | conversion | specialized
- **difficulty**: low | medium | high
- **trafficPotential**: Estimated monthly search volume
- **outline**: Structured outline from markdown

### Conversion Tracking
- **conversionGoal**: job_posting | vendor_signup | inquiry
  - Determines CTA at bottom of post

### Internal Linking
- **internalLinks**: Related posts to link within content
- **relatedPosts**: Posts shown in "Related Articles" section

## Creating Your First Post

### Option 1: Via Payload Admin (Recommended)

1. **Start dev server**: `npm run dev`
2. **Access admin**: http://localhost:3000/admin
3. **Go to Posts**: Click "Posts" in left sidebar
4. **Create New Post**: Click "Create New"
5. **Fill in fields**:
   - Title: "Coffee Cart Hire Melbourne: Complete Pricing Guide 2026"
   - Category: event-focused
   - Priority: quick-win
   - Conversion Goal: inquiry
   - Status: draft (change to published when ready)
6. **Add content**: Use rich text editor
7. **Publish**: Change status to "published"

### Option 2: Import from Markdown Outlines

The 30 blog topic outlines in `docs/blog-topics/` can be expanded and imported:

1. Choose a topic (start with Quick Wins 1-8)
2. Expand the outline to full 3,000-4,000 word article
3. Create post in Payload admin
4. Copy content into Lexical editor
5. Add SEO metadata from outline
6. Upload featured image
7. Set conversion goal and publish

## Content Strategy Priority

### Phase 1: Quick Wins (Weeks 1-4)
Write these 8 topics first for maximum impact:

1. Coffee Cart Hire Melbourne Pricing Guide (event-focused/01)
2. How to Hire Coffee Cart Corporate Events (event-focused/02)
3. Top 10 Mobile Coffee Carts Melbourne (event-focused/03)
4. Coffee Cart vs Barista Station (event-focused/05)
5. How to Start Mobile Coffee Cart Business Melbourne (coffee-education/01)
6. Coffee Cart Wedding Melbourne Guide (event-focused/04)
7. Coffee Cart Setup Requirements (event-focused/06)
8. Coffee Cart Capacity Calculator (event-focused/08)

See `docs/blog-topics/CONTENT-STRATEGY.md` for full 24-week plan.

## SEO Best Practices

### Metadata
- **Title**: Include target keyword, max 60 chars
- **Meta Description**: Clear value prop, max 160 chars
- **Keywords**: 3-5 target keywords per post
- **Headings**: Use H2/H3 hierarchy with keywords

### Internal Linking
- Link to vendor directory (/) from event-focused posts
- Link to vendor registration from coffee-education posts
- Cross-link related articles
- Use descriptive anchor text

### Images
- **Featured Image**: 1200x630px for social sharing
- **Alt Text**: Descriptive with keywords
- **File Size**: Optimize to <200KB
- **Format**: WebP preferred, fallback to JPG

### Schema Markup
- BlogPosting schema automatically added
- Include FAQ schema for Q&A sections (manual)
- Update author/publisher details in JsonLd component

## Conversion Optimization

### CTAs by Conversion Goal

**job_posting** (Event organizers):
- Primary: "Post Your Event" → /jobs/create
- Secondary: "Browse Vendors" → /

**vendor_signup** (Coffee cart vendors):
- Primary: "Become a Vendor" → /vendors/register
- Secondary: "View Vendor Resources" → /vendors-guide

**inquiry** (Booking inquiries):
- Primary: "Browse Vendors" → /
- Secondary: "Get a Quote" → inquiry form

### Call-Out Boxes
Add these manually in content:
- Quick wins: 🔥 emoji, green highlight
- Authority: 💡 emoji, blue highlight
- Conversion: 🎯 emoji, purple highlight
- Vendor resources: 📚 emoji, orange highlight

## Performance Monitoring

### Analytics Setup (Todo)
Track these metrics per content strategy:
- Organic traffic by post
- Conversion rates (inquiry form, vendor signup, job posting)
- Time on page, bounce rate
- Keyword rankings

### Success Targets
- **Month 3**: 1,000 organic visitors/month
- **Month 6**: 5,000 organic visitors/month
- **Month 12**: 15,000+ organic visitors/month
- **Conversion Rate**: 2-5% inquiry submissions
- **Engagement**: 3+ min time on page, <50% bounce rate

## Content Workflow

### Writing Process
1. **Choose topic** from content strategy priority list
2. **Expand outline** to full 3,000-4,000 words
3. **Research current data** (pricing, trends, stats)
4. **Write in Payload admin** or local markdown
5. **Add internal links** to vendor directory, related posts
6. **Optimize SEO** (title, meta, keywords, headings)
7. **Upload images** (featured + in-content)
8. **Preview** as draft
9. **Publish** when ready

### Update Frequency
- **New posts**: 3-4/week initially, then 1-2/week
- **Pricing Guide**: Update annually
- **Coffee Trends**: Update annually with new year
- **Seasonal**: Update quarterly

## Next Steps

1. ✅ Blog infrastructure set up
2. ⏳ Write Quick Win #1: Pricing Guide
3. ⏳ Write Quick Win #2: Corporate Events
4. ⏳ Write Quick Win #3: Top 10 Vendors
5. ⏳ Set up analytics tracking
6. ⏳ Create promotion strategy (social, email)

## Troubleshooting

### Build Errors
- Check Payload config is correct: `src/payload.config.ts`
- Verify DATABASE_URI in `.env.local`
- Ensure Payload secret is set: `PAYLOAD_SECRET`

### Rich Text Not Rendering
- Check RichTextRenderer supports all Lexical node types
- View raw content in browser devtools
- Test with simple paragraph content first

### SEO Metadata Missing
- Verify fields filled in Payload admin
- Check `generateMetadata` function in page.tsx
- Inspect page source for meta tags

## Resources

- **Content Strategy**: `docs/blog-topics/CONTENT-STRATEGY.md`
- **Topic Outlines**: `docs/blog-topics/event-focused/` and `coffee-education/`
- **Payload Docs**: https://payloadcms.com/docs
- **Lexical Docs**: https://lexical.dev
