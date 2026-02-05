---
created: 2026-02-04T19:30
title: Optimize vendor page for SEO/GEO/AEO with conversion-focused design
area: ui
files:
  - src/app/vendors/[slug]/page.tsx
  - src/components/seo/JsonLd.tsx
  - src/lib/vendors.ts
---

## Problem

Current vendor detail pages (`/vendors/[slug]`) need optimization for:
- **SEO (Search Engine Optimization)**: Better keyword targeting, meta descriptions, content structure
- **GEO (Geographic/Local SEO)**: Melbourne suburbs targeting, local business schema
- **AEO (Answer Engine Optimization)**: Structured data for AI assistants and voice search
- **Conversion optimization**: Copywriting, internal linking, global design sections that drive inquiry form submissions

The page exists but lacks strategic content architecture, internal link structure, and conversion-optimized design patterns.

## Solution

Multi-phase approach:

1. **SEO/GEO audit:**
   - Analyze current vendor page structure
   - Identify keyword opportunities (Melbourne coffee carts, suburbs, event types)
   - Add geo-targeted content sections

2. **AEO structured data:**
   - Enhance `JsonLd.tsx` with LocalBusiness schema
   - Add FAQ schema for common vendor questions
   - Implement breadcrumb navigation

3. **Copywriting & content:**
   - Add compelling vendor USP sections
   - Create conversion-focused CTAs
   - Write geo-targeted content blocks

4. **Internal linking:**
   - Link to `/contractors/how-to-hire-coffee-cart`
   - Cross-link related vendors by suburb/specialty
   - Add contextual links to job board

5. **Design sections:**
   - Social proof section (reviews/testimonials placeholder)
   - "Why book [vendor]?" conversion block
   - Trust indicators (verified badge, response time)

**Research needed:** Use context7 MCP to check best practices for local service business SEO and conversion optimization patterns.
