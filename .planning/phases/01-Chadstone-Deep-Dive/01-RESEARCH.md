# Phase 1: Chadstone Deep-Dive - Research

**Researched:** 2026-02-23
**Domain:** Content Strategy, SEO, Blog Infrastructure, Geographic Coverage
**Confidence:** HIGH (Payload CMS integrated, architecture validated, geography defined)

## Summary

The Bean Route has established infrastructure for a 30-day Chadstone-focused content blitz: Payload CMS is integrated for blog management, the Next.js architecture supports internal linking, Supabase provides vendor data, and the geographic strategy is locked. This phase requires careful content planning: 30 posts across 4 categories, batch-writing workflow, SEO keyword targeting, and internal linking between posts and vendor profiles. Key gaps are the detailed Chadstone area definition, specific venue selection criteria, and the growth loop activation timing.

**Primary recommendation:** Before writing content, lock the 7-day batch writing cadence (Wed-Sun content planning, Mon-Tue publication), define "Chadstone area" boundaries for location guides (Fountain Gate, Westfield, immediate surrounds), and create a internal linking matrix mapping 30 posts to each other and vendor profiles.

## Standard Stack

### Core Payload CMS Setup
| Component | Version | Status | Purpose |
|-----------|---------|--------|---------|
| Payload CMS | 3.75.0 | Live | Blog management (collections, scheduling, publishing) |
| Next.js | 15.4.11 | Live | Blog rendering via App Router |
| PostgreSQL (Supabase) | 15+ | Live | Payload CMS backend (schema: `payload`) |
| Lexical RichText | 3.75.0 | Live | Post content editing |

**Install:** Already in `package.json` via `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`

### Posts Collection Structure
Payload `Posts` collection (`src/collections/Posts.ts`) has:
- **Core fields:** title, slug, excerpt (meta description, max 160 chars), content (rich text), featuredImage
- **Status & Publishing:** status (draft/published/scheduled), publishedAt (date + time)
- **Category:** Strict enum: "event-focused" OR "coffee-education"
- **Conversion:** conversionGoal (job_posting, vendor_signup, or inquiry)
- **SEO fields:** targetKeywords (array), searchIntent (text), metaDescription, ogImage
- **Editorial metadata:** priority (quick-win/authority/conversion/specialized), difficulty (low/medium/high), trafficPotential (number), outline (JSON)
- **Linking:** internalLinks (relationship to other posts), relatedPosts (relationship, auto-populated if empty)
- **Timestamps:** createdAt, updatedAt automatic

**Current limitations:**
- No blog route (`/blog/*`) created yet — posts exist in Payload but need rendering endpoint
- No "location" field for geographic tagging (location guides need suburb/area tagging for phase 2)
- Categories limited to 2 options (needs expansion for venue spotlights, location guides, how-to guides)
- No featured/hero post pinning, no post ordering by date

### Vendor Data Integration
| Data Source | Structure | Usage in Content |
|-------------|-----------|------------------|
| Seed vendors | 10 hardcoded in `src/lib/vendors.ts` | Spotlight links, internal linking |
| Supabase `vendors` table | Replaces hardcoded after admin approval | Future: dynamic venue spotlights |
| Suburbs list | 23 hardcoded in `/vendors/register` | Reference for location guide scope |

**Key data available:**
- business_name, specialty, suburbs[], price_min/max, capacity_min/max, tags[], verified
- For coffee shops: physical_address, opening_hours, amenities
- vendor_type: 'mobile_cart' | 'coffee_shop' | 'barista'

## Architecture Patterns

### Blog Route & Template Structure (NOT YET BUILT)
**What:** Create `/blog/[slug]` route to render Payload posts with SEO metadata, internal links, and CTAs

**Pattern (to implement):**
```typescript
// app/(main)/blog/[slug]/page.tsx
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug) // from Payload API
  return (
    <>
      <BlogPostTemplate
        title={post.title}
        excerpt={post.excerpt}
        content={post.content}
        internalLinks={post.internalLinks} // rendered as "Related posts" sidebar
        conversionGoal={post.conversionGoal} // determines CTA: "Book Now", "Register", "Learn More"
        publishedAt={post.publishedAt}
      />
    </>
  )
}
```

### Content Categories & Post Types (PHASE 1 Scope)
**Four post types for 30-post target:**

1. **Venue Spotlights (10 posts)** — Individual coffee shops/carts in Chadstone
   - Category: "event-focused" (can be booked for events)
   - Target: High-intent local keywords ("Best coffee in Chadstone", "[Shop Name] Chadstone")
   - ConversionGoal: vendor_signup or job_posting (organizers find specific venues)
   - Internal links: 2-3 related posts (location guides, how-to guides, coffee education)
   - Length: 800-1200 words

2. **Location Guides (7 posts)** — "Best Coffee in [Area]" with multiple venue links
   - Category: "event-focused"
   - Target: Suburb-specific keywords ("Coffee carts Chadstone", "Mobile barista Fountain Gate")
   - ConversionGoal: vendor_signup (driving browsing → discovery → booking)
   - Internal links: Spotlight posts (5-10 per guide), how-to guides (2-3)
   - Length: 1500-2000 words (comprehensive area coverage)

3. **How-To Guides (5 posts)** — Split between vendors & organizers
   - Category: Vendor guides = "event-focused"; Organizer guides = "event-focused"
   - Target: Commercial intent ("How to hire coffee carts", "Coffee cart pricing")
   - ConversionGoal: vendor_signup (vendors) or job_posting (organizers)
   - Examples from PROJECT.md: "How to Price Your Cart", "Growing Your Coffee Cart Business", "Guide to Hiring Coffee Carts", "Event Catering Planning"
   - Internal links: 3-5 related posts, 2-3 spotlight links
   - Length: 1200-1500 words

4. **Coffee Education (8 posts)** — Foundational knowledge building authority
   - Category: "coffee-education"
   - Target: Informational keywords ("How to spot good coffee", "L-Theanine benefits")
   - ConversionGoal: inquiry or vendor_signup (trust-building, not immediate action)
   - Examples from PROJECT.md: "How to Spot Good Coffee", "Benefits of Coffee", "L-Theanine & Coffee", "Is Decaf Really Coffee?", "Why Coffee Tastes Different in Different Cups", "The Barista Relationship", "What Makes a Great Barista"
   - Internal links: 2-3 related education posts, 1-2 spotlight links (apply knowledge to real vendors)
   - Length: 800-1200 words

**Not in Phase 1 scope:**
- Meta-roundups ("Best coffee across all Melbourne")
- Video content, interactive tools
- Vendor guides on advanced topics (reserved for Phase 2)

### Internal Linking Strategy

**Goal:** Create a dense knowledge graph where:
- Each venue spotlight links to 2-3 location guides (organizes by area)
- Each location guide links to 5-10 spotlights (comprehensive area coverage)
- How-to guides link to relevant spotlights (apply vendor pricing to real examples)
- Coffee education posts link to how-to guides (knowledge → action pathway)

**Implementation:**
- Use Payload's `internalLinks` field (relationship type, many-to-many)
- Render as "Related Articles" sidebar or footer section
- Each post should have 3-5 internal links (minimum for linking juice distribution)
- Coffee education → how-to guides → spotlights forms a buyer journey funnel

**Example linking architecture (30-post matrix):**
```
Location Guides (7):
  ├─ "Best Coffee Carts in Chadstone" → 8-10 spotlight posts
  ├─ "Coffee Near Fountain Gate" → 5-7 spotlights
  ├─ "Westfield Chadstone Coffee" → 3-5 spotlights
  └─ [4 more micro-area guides]

Spotlights (10):
  ├─ Each links to 2-3 parent location guides
  ├─ Each links to 1-2 how-to guides (pricing, event planning)
  └─ Each links to 1-2 coffee education posts

How-To Guides (5):
  ├─ Vendor guides → 3-5 spotlights (real examples)
  ├─ Organizer guides → 3-5 spotlights (reference venues)
  └─ Cross-link vendor↔organizer guides (both audiences matter)

Coffee Education (8):
  ├─ Each → 2-3 related education posts (topic progression)
  ├─ Each → 1-2 how-to guides (knowledge application)
  └─ Each → 1-2 spotlights (trust-building with real vendors)
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Blog management (scheduling, versioning, drafts) | Custom MD file system with git | Payload CMS (already integrated) | Payload handles permissions, scheduling, revision history; custom systems are fragile |
| Blog rendering (SEO, metadata, image optimization) | Manual Next.js route + markdown parser | Payload + built-in Next.js Image component | Payload abstracts schema management; manual parsing loses type safety |
| Content linking (related posts, internal nav) | Manual slug matching in posts | Payload relationship fields + relatedPosts | Payload enforces referential integrity; manual slug matching breaks with edits |
| Venue discovery in content | Hardcode venue URLs in posts | Payload relationship field for spotlight links | Allows dynamic venue updates without post re-publishing |
| Internal linking matrix | Spreadsheet + manual linking | Payload internalLinks relationship | Bidirectional linking, trackable, query-able |

**Key insight:** Payload CMS solves the "content web" problem. Manual approaches break at scale (30+ posts with 5+ internal links each = 150+ relationships to track manually).

## Chadstone Area Geographic Definition (PENDING DECISION)

**Current scope from PROJECT.md:**
- "Chadstone and immediate surroundings (Fountain Gate, Westfield Chadstone area)"

**Suburbs to research:**
| Suburb | Status | Notes |
|--------|--------|-------|
| Chadstone | Core | Primary suburb, includes Westfield Chadstone mall |
| Fountain Gate | Core | Adjacent to Chadstone, mixed residential/commercial |
| Malvern | Adjacent | South of Chadstone |
| Glen Iris | Adjacent | West of Chadstone |
| Oakleigh | Adjacent | East of Chadstone |
| Mount Waverley | Adjacent | South-east |
| Bentleigh | Possible | Part of Phase 2 per ROADMAP |

**Decision needed for planner:**
1. How tight is "immediate surroundings"? (5km radius? Just Fountain Gate? Full surrounding suburbs?)
2. How many location guides for Phase 1? (Planner said 7 — suggests Chadstone core + 5-6 micro-areas or adjacent suburbs)
3. Geographic tags on posts (needed for phase 2 expansion when similar posts created for Knox/Notting Hill/Bentleigh)

**Recommendation:** Lock to Chadstone + Fountain Gate + Glen Iris for Phase 1 location guides (= 3-4 main guides), with Malvern/Oakleigh micro-guides (= 3-4 smaller guides). This gives clear geographic boundaries and doesn't overlap Phase 2.

## Venue Selection for Spotlights (10 posts)

**Source:** Vendor seed data in `src/lib/vendors.ts` + Supabase `vendors` table (after approvals)

**Current seed vendors:** 10 hardcoded, but their suburbs not confirmed yet. Need to:
1. Filter vendors by suburb (Chadstone, Fountain Gate, Glen Iris, Malvern)
2. Identify how many spotlights each vendor gets (1 per vendor = 10 spotlights)
3. Verify vendor types (mobile carts vs coffee shops — both relevant for organizers)

**Spotlight link strategy:**
- Each spotlight post (800-1200 words) should link to vendor profile (`/vendors/[slug]`)
- "Book Now" CTA on spotlights → `/vendors/[slug]` inquiry form
- Spotlight posts are the top-of-funnel to vendor discovery

**Decision needed:** Are 10 vendors enough for Chadstone area? Or are some seed vendors outside Phase 1 geography? (Recommendation: Focus spotlights on vendors actually serving Chadstone; save others for Phase 2/3)

## Common Pitfalls

### Pitfall 1: Ignoring Blog Route Implementation
**What goes wrong:** Content exists in Payload but users can't reach it because `/blog/[slug]` route doesn't exist
**Why it happens:** Assumption that "CMS integrated" means "blog site live" — but Payload is just the backend
**How to avoid:** Implement `/app/(main)/blog/[slug]/page.tsx` before week 1 content publishes
**Warning signs:** Posts published in Payload admin but `/blog/post-slug` returns 404

### Pitfall 2: Weak Internal Linking (Missed SEO Juice)
**What goes wrong:** Posts exist but don't link to each other; no "Related Articles" section; readers bounce instead of navigating deeper
**Why it happens:** Manual linking is tedious; planner assumes posts can link "later" after content is written
**How to avoid:** Map linking matrix BEFORE writing (see Architecture Patterns above); assign internal links during Payload creation
**Warning signs:** Google Analytics shows 0-2% of traffic coming from internal navigation; high bounce rate on blog posts

### Pitfall 3: Category Mismatch with Content
**What goes wrong:** Spotlights categorized as "coffee-education" instead of "event-focused"; related posts don't display correctly
**Why it happens:** Posts.ts collection has only 2 categories; new types don't fit cleanly
**How to avoid:** Expand Posts.ts categories to include "venue-spotlight", "location-guide", "how-to-guide", "coffee-education" (or use editorial.priority field instead)
**Warning signs:** Editor confused about which category to pick; relatedPosts auto-populate incorrectly

### Pitfall 4: Geographic Ambiguity Kills Guides
**What goes wrong:** Location guide titled "Best Coffee Near Chadstone" is vague; unclear if suburbs are included; overlaps with other guides
**Why it happens:** "Immediate surroundings" interpreted differently by each writer
**How to avoid:** Create a geographic taxonomy (locked before content writing): Chadstone, Fountain Gate, Glen Iris are separate guides; Malvern gets its own guide
**Warning signs:** Reader confusion about coverage; multiple posts claiming to cover "Chadstone area"

### Pitfall 5: Growth Loop Ad Placement Timing (Conversion Issue)
**What goes wrong:** Blog posts go live Day 1-30, but free coffee ads don't activate until Day 45; new vendors see blog content but no incentive to sign up
**Why it happens:** Ads planned for Phase 2 per ROADMAP; planner didn't realize content is live before growth loop
**How to avoid:** Decide: activate ads Day 1 (launch with content) or schedule posts to publish staggered after ads go live?
**Warning signs:** High blog traffic but zero organic registrations; ads and content misaligned

### Pitfall 6: Venue Spotlights Without Verified Vendor Data
**What goes wrong:** Write spotlights for 10 vendors, but only 3 are confirmed in Supabase; publish outdated info; vendors angry
**Why it happens:** Assumption that seed data = approved vendors; no sync between Payload posts and Supabase vendor table
**How to avoid:** Lock venue list BEFORE writing spotlights; verify business names, suburbs, hours, specialties in Supabase
**Warning signs:** Spotlight post links to vendor profile that doesn't exist or has wrong info

## Growth Loop Integration (Phase 1 Considerations)

**Growth Loop Model (from PROJECT.md):**
1. Partner venues offer free coffee coupons for new vendor registrations
2. Ads placed on `/vendors/register` page and blog sidebars
3. Content drives SEO traffic → discovery → registration

**Phase 1 Timing Decision:**
- **Option A:** Publish all 30 blog posts Days 1-30; activate ads same period (concurrent)
  - Pro: Content + incentive align; viral potential
  - Con: Ads cost money upfront; may not see ROI in 30 days

- **Option B:** Publish blog posts Days 1-30; activate ads starting Day 31 (Phase 2)
  - Pro: Focus on organic SEO growth first; validate content before ad spend
  - Con: 30 posts live with no growth incentive; missed conversion opportunity in Phase 1

- **Option C (Recommended):** Soft launch ads on Day 15 (halfway through Phase 1)
  - Pro: Content momentum builds; ads activate when organic traffic patterns visible
  - Con: Splits Phase 1 focus

**Recommendation for planner:** Lock ad activation timing in CONTEXT.md. Research needs to know when to mention free coffee offers in posts (call-to-action placement timing).

## Batch Writing Workflow Recommendation

**Target:** 30 posts in 30 days = 1 post/day average

**Proposed batch cadence (Optimal for solo writer + Claude assistance):**
```
Week 1 (Days 1-7):
  Mon-Tue: Content strategy + outline (4-5 posts per day)
  Wed-Fri: Write 5 posts in batches of 2-3 (parallel drafting)
  Sat-Sun: Editing + Payload entry + link mapping

Week 2-4: Repeat (adjust batch size if Day 7 velocity reveals burnout)

Total effort: ~20-25 hours/week writing + editing
```

**Claude's role:** Draft posts from outlines; planner refines for brand voice, verifies facts, adds internal links

**Risk:** 1 post/day is aggressive. Buffer weeks 2-4 for slowdown.

## SEO Strategy for Phase 1

### Primary Keyword Clusters (Estimated Volume)

| Keyword | Monthly Searches* | Intent | Post Type | Difficulty |
|---------|------------------|--------|-----------|------------|
| hire coffee carts Melbourne | 200-500 | Commercial | How-to (organizer) | Medium |
| mobile barista Chadstone | 50-150 | Commercial | Location guide | Low |
| best coffee Chadstone | 100-300 | Informational | Location guide | Medium |
| coffee cart pricing | 100-200 | Informational | How-to (vendor) | Medium |
| event catering coffee | 150-400 | Commercial | How-to (organizer) | High |
| specialty coffee Melbourne | 200-500 | Informational | Coffee education | High |
| [Vendor Name] Chadstone | 10-50/vendor | Transactional | Venue spotlight | Low |
| how to spot good coffee | 50-150 | Informational | Coffee education | Medium |

*Estimates from research; actual data requires SEMrush/Ahrefs

### Keyword Targets by Post Type

**Spotlights (10):** Long-tail brand terms (`[Vendor Name] Chadstone`, `[Vendor Name] coffee reviews`) — LOW difficulty, high conversion (users search by name = ready to book)

**Location Guides (7):** Geographic intent (`best coffee [suburb]`, `coffee carts near [landmark]`) — MEDIUM difficulty, high relevance (geo-specific, easy to rank locally)

**How-To Guides (5):** Commercial + informational (`how to hire coffee carts`, `coffee cart pricing 2026`) — MEDIUM-HIGH difficulty, high authority building

**Coffee Education (8):** Informational + brand authority (`how to spot good coffee`, `benefits of coffee`) — MEDIUM-HIGH difficulty, audience building (not immediate conversion)

### On-Page SEO Requirements (Payload Integration)

**What Payload Posts collection enforces:**
- `title` (H1) — included in page render
- `excerpt` (max 160 chars) — used as meta description if `seo.metaDescription` not set
- `slug` — URL slug (auto-generated from title)
- `seo.targetKeywords` — stored (not auto-inserted; needs manual template use)
- `seo.metaDescription` — custom meta tag (optional override)
- `seo.ogImage` — Open Graph image (social sharing)

**What needs implementation:**
- Blog route template must render meta tags from Payload fields (Next.js `generateMetadata()`)
- Internal link anchor text should include keywords (Payload relatedPosts links rendered as semantic HTML)
- Structured data (JSON-LD) for blog posts (Article schema)
- Image optimization (Next.js Image component for featuredImage)

**Not yet solved:**
- Keyword insertion in post content (Payload stores keywords; content needs manual keyword integration)
- Schema markup for local businesses in venue spotlights (linking to Supabase vendor data)
- Sitemap generation (should include `/blog/*` posts; `next-sitemap` package in package.json may need config)

## Payload CMS Validation & Setup

### Current State (Verified)
- Payload 3.75.0 integrated in package.json
- Collections defined: Users, Posts, Media (in `/src/collections/`)
- PostgreSQL adapter configured (uses Supabase, separate `payload` schema)
- Posts collection has: title, slug, excerpt, content (Lexical rich text), status, publishedAt, category, conversionGoal, SEO fields, editorial metadata, internal linking relationships

### Gap: Blog Route Implementation
- **Missing:** `/app/(main)/blog/[slug]/page.tsx` route to render posts publicly
- **Missing:** `/app/(main)/blog/page.tsx` index to list all published posts
- **Impact:** Payload admin can publish posts, but no way for users to read them
- **Effort:** Low (1-2 hours to implement basic route)

### Gap: Admin Interface Access
- **Status:** Payload admin UI available at `/admin` (Payload built-in)
- **Auth:** No authentication enforced yet (development mode); production needs admin user setup
- **Recommendation:** Before Phase 1 content, set up admin user account with strong password

### Gap: Image Upload & Optimization
- **Status:** Media collection exists for uploads
- **Missing:** Supabase Storage configuration for image hosting
- **Workaround:** Use external image URLs in `featuredImage` field (temporary for MVP)
- **Future:** Integrate Supabase Storage (per Integrations doc, storage not yet configured)

## Open Questions

### 1. Blog Route Implementation Timeline
**What we know:** Blog route is missing; posts exist in Payload but aren't publicly accessible
**What's unclear:** When should `/blog/[slug]` be implemented? Day 1 before content publishes, or can it wait?
**Recommendation:** Build route before publishing first post (recommend Week 1, Day 1)

### 2. Venue Spotlight Source: Seed Data vs. Supabase
**What we know:** 10 seed vendors exist in `src/lib/vendors.ts`; Supabase `vendors` table can store approved vendors
**What's unclear:** Are the 10 seed vendors in Chadstone area? Should spotlights reference seed data or Supabase data?
**Recommendation:** Confirm vendor suburbs with current data; spotlights should reference Supabase `vendors` table (future-proof for admin approvals)

### 3. Post Category Expansion
**What we know:** Posts.ts enforces 2 categories (event-focused, coffee-education)
**What's unclear:** Should venue spotlights, location guides, and how-to guides fit into "event-focused"? Or expand categories?
**Recommendation:** Keep current 2-category model (spotlights/how-to are "event-focused"; education stays "coffee-education"); use `editorial.priority` field for fine-grained type distinction

### 4. Growth Loop Ad Activation Timing
**What we know:** Free coffee offers planned; ads should go on `/vendors/register` and blog sidebars
**What's unclear:** Should ads activate Day 1 (with content launch) or Day 31 (Phase 2 start)?
**Recommendation:** Lock in CONTEXT.md before Phase 1 planning; impacts post CTA copy and signup flow

### 5. Geographic Taxonomy for Location Guides
**What we know:** Phase 1 = Chadstone + immediate surroundings; Phase 2 = Knox/Notting Hill/Bentleigh
**What's unclear:** How many location guides for Phase 1? How many suburbs per guide?
**Recommendation:** Define boundaries: Chadstone (core), Fountain Gate (adjacent), Glen Iris (adjacent), Malvern (adjacent), Oakleigh (adjacent) = 5 main location guides; plan for overlap minimization with Phase 2

### 6. Internal Linking Matrix Visualization
**What we know:** 30 posts need 3-5 internal links each = 90-150 relationships
**What's unclear:** How to visualize/plan this? Spreadsheet? Graph tool? Payload UI?
**Recommendation:** Create internal linking matrix spreadsheet (posts × posts grid) before content writing begins; identify clusters (e.g., all spotlights link to parent location guide)

## State of the Art

### Blog Infrastructure (2025-2026)

| Old Approach | Current Approach (This Project) | When Changed | Impact |
|--------------|--------------------------------|--------------|--------|
| Markdown files in git | Headless CMS (Payload) | 2024-2025 | Editors don't need git; scheduling/versioning built-in |
| Manual sitemap updates | Automatic via next-sitemap | 2024+ | SEO doesn't degrade with missed pages |
| Static blog routes | Dynamic routes + RichText editor | 2024+ | Content editors have control; no code deploys needed |
| Basic meta tags | JSON-LD schema + Open Graph | 2024+ | Better social sharing; search engine visibility |

### Content Marketing Strategy (25-26)

**Deprecated:**
- Single-author blog (inefficient at scale) → AI-assisted drafting (Payload + Claude)
- Evergreen content only → Tiered content (quick-wins, authority, specialized) with editorial metadata
- No internal linking planning → Deliberate linking matrices per topic cluster

**Current best practice:**
- Content tiers by difficulty/authority-building (quick-win: rank in weeks; authority: rank in months)
- Batch writing (5-7 posts/week) vs. daily publishing (reduces burnout)
- Conversion-goal tagging (every post has explicit audience: vendor signup, job posting, inquiry)

## Code Examples

### Payload Posts API Usage (Verified from Posts.ts)

```typescript
// Fetching published posts (what blog route would do)
const response = await fetch(`${NEXT_PUBLIC_PAYLOAD_URL}/api/posts?where[status][equals]=published&sort=-publishedAt`)
const { docs: posts } = await response.json()

// Creating a blog post (admin flow)
const newPost = {
  title: "Best Coffee Carts in Chadstone",
  slug: "best-coffee-carts-chadstone",
  excerpt: "Find the top mobile baristas and coffee carts serving Chadstone Melbourne.",
  content: {...}, // Lexical rich text JSON
  status: "published",
  publishedAt: new Date(),
  category: "event-focused",
  conversionGoal: "vendor_signup",
  seo: {
    targetKeywords: [
      { keyword: "coffee carts Chadstone" },
      { keyword: "mobile barista near me" }
    ],
    searchIntent: "Find event catering coffee options in Chadstone",
    metaDescription: "Discover 8 mobile coffee cart vendors in Chadstone for weddings, corporates, and events."
  },
  editorial: {
    priority: "authority",
    difficulty: "medium",
    trafficPotential: 250,
  },
  internalLinks: [spotlightPost1, spotlightPost2, spotlightPost3], // relationship IDs
}

// Rendered blog post SEO metadata (example)
export const generateMetadata = async ({ params }: Props) => {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.seo?.ogImage || post.featuredImage],
    }
  }
}
```

### Internal Linking Render Pattern (to implement)

```typescript
// In blog post template
{post.internalLinks && post.internalLinks.length > 0 && (
  <aside className="mt-8 pt-8 border-t">
    <h3>Related Articles</h3>
    <ul>
      {post.internalLinks.map(linkedPost => (
        <li key={linkedPost.id}>
          <Link href={`/blog/${linkedPost.slug}`}>
            {linkedPost.title}
          </Link>
        </li>
      ))}
    </ul>
  </aside>
)}
```

## Sources

### Primary (HIGH confidence)
- **Payload CMS 3.75.0 documentation** — Posts collection structure, relationship fields, status/publishing model verified from `/src/collections/Posts.ts`
- **Next.js 15.4 App Router** — Blog route patterns, metadata generation (generateMetadata API)
- **Supabase PostgreSQL integration** — Database schema includes payload schema separation per `/src/payload.config.ts`
- **Project files verified:**
  - `/src/payload.config.ts` — CMS configuration, database adapter
  - `/src/collections/Posts.ts` — Complete Posts schema with all fields
  - `/package.json` — Payload CMS version 3.75.0 confirmed
  - `/src/app/(main)/suburbs/[slug]/SuburbPageClient.tsx` — Existing geographic pattern (suburbs routes)
  - `/src/app/(main)/vendors/register/page.tsx` — Suburb list (23 suburbs, Chadstone not explicitly listed but registration form exists)

### Secondary (MEDIUM confidence)
- **PROJECT.md & ROADMAP.md** — Content mix (30/20/15/25 split), geographic phases, growth loop model
- **ARCHITECTURE.md** — Vendor type discrimination pattern, conditional rendering; verified from codebase
- **INTEGRATIONS.md** — Email (Brevo), storage (not yet configured), auth model

### Tertiary (LOW confidence — context7/web research needed)
- Melbourne suburb geography (Chadstone, Fountain Gate, Glen Iris proximity) — assumed from context; no official geographic boundary source verified
- SEO keyword volumes — estimates only; require SEMrush/Ahrefs verification
- Content tier best practices — based on 2024-2025 industry practices; require validation

## Metadata

**Confidence breakdown:**
- **Payload CMS setup: HIGH** — Integrated, schema verified from source code, Posts collection confirmed
- **Blog route implementation: HIGH** — Missing but straightforward; architecture well-established
- **Venue data & spotlights: MEDIUM** — 10 seed vendors exist; their Chadstone coverage not confirmed in data
- **Geographic scope: MEDIUM** — "Chadstone and immediate surroundings" defined in PROJECT.md; exact suburb boundaries not specified
- **SEO keyword targeting: MEDIUM** — Keyword categories defined; exact volumes unverified (low-confidence estimates)
- **Growth loop timing: LOW** — Model exists; activation timing (Day 1 vs. Day 31) not yet decided
- **Internal linking matrix: MEDIUM** — Pattern established; specific link topology not pre-planned

**Research date:** 2026-02-23
**Valid until:** 2026-03-09 (2 weeks for blog infrastructure stability; longer for content strategy)
**Refresh triggers:** Major Payload CMS version update, new content category type needed, vendor data changes

---

*Research completed for Phase 1: Chadstone Deep-Dive planning. Ready for planner to create PLAN.md.*
