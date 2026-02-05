# Public Pages — SEO/GEO/AEO & Conversion Audit

**Date:** 2026-02-05
**Scope:** Public-facing pages (non-admin) SEO, local SEO, answer engine optimization, and conversion analysis
**Status:** Initial audit complete

---

## Executive Summary

The Bean Route has solid structural foundations for SEO with LocalBusiness schema, breadcrumbs, and HowTo markup on content pages. However, significant opportunities exist for:

1. **Enhanced local SEO (GEO)** — Deeper suburb targeting, local content, Google Business Profile integration
2. **Answer engine optimization (AEO)** — FAQ schema expansion, featured snippet targeting, conversational content
3. **Conversion optimization** — Trust signals, social proof, internal linking strategy, CTAs
4. **Content gaps** — Missing blog/guides, vendor success stories, event type guides

**Priority recommendation:** Focus on vendor detail pages first (highest conversion potential), then content marketing pages (organic traffic drivers).

---

## 1. Current SEO Infrastructure Status

### ✅ Implemented & Working

| Component | Status | Location | Notes |
|---|---|---|---|
| Metadata system | ✅ Complete | `src/app/layout.tsx` | Global + page-specific |
| Organization schema | ✅ Live | Root layout | Basic org markup |
| LocalBusiness schema | ✅ Live | Vendor pages | Good foundation |
| Breadcrumb schema | ✅ Live | Vendor + content pages | Clean structure |
| HowTo schema | ✅ Live | `/contractors/how-to-hire` | Well-structured |
| FAQ schema | ✅ Live | `/vendors-guide/get-listed` | Good coverage |
| OpenGraph tags | ✅ Configured | Layout + vendor pages | Social sharing ready |

### ⚠️ Missing or Incomplete

| Component | Impact | Priority | Recommendation |
|---|---|---|---|
| Google Business Profile | **High** | **Critical** | Create GBP, link to website |
| Sitemap.xml | High | High | Generate dynamic sitemap |
| Robots.txt | Medium | High | Configure crawl directives |
| Local citations | High | Medium | NAP consistency across directories |
| Blog/guides section | High | Medium | Content marketing hub |
| Video schema | Medium | Low | For vendor showcase videos (future) |
| Review schema | High | Medium | When reviews feature launches |

---

## 2. Page-by-Page Audit

### Landing Page (`/`)

**Current State:**
- ✅ Clear hero with value prop
- ✅ How it works section
- ✅ Vendor carousel
- ✅ Trust signals (stats: 10+ vendors, 60s inquiry time, free)
- ✅ Dual CTAs (Browse Vendors, List Your Cart)

**SEO Strengths:**
- Geographic targeting in hero ("Melbourne's Coffee Cart Marketplace")
- Clear service description
- Good internal linking to `/app` and `/vendors-guide`

**Opportunities:**
- ❌ **No page-specific metadata** — Uses global metadata from layout
- ❌ **Missing suburb mentions** — Hero doesn't target specific suburbs (CBD, Carlton, Fitzroy, etc.)
- ❌ **No FAQ section** — Missed opportunity for featured snippets
- ❌ **Limited keyword targeting** — "mobile coffee cart Melbourne" is primary, but missing variations
- ❌ **No testimonials/reviews** — Trust signals are stats, not social proof

**Recommended Actions:**

1. **Add page-specific metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Melbourne Mobile Coffee Carts | The Bean Route',
  description: 'Book verified mobile coffee carts in Melbourne. Serving CBD, Carlton, Fitzroy & 20+ suburbs. Corporate events, weddings, festivals. Free quotes in 60 seconds.',
}
```

2. **Add FAQ schema section:**
- "How much does a mobile coffee cart cost in Melbourne?"
- "Which Melbourne suburbs do you cover?"
- "How far in advance should I book?"
- "Do coffee carts need power at my event?"

3. **Enhance hero copy with suburb targeting:**
```text
"Great coffee in CBD, Carlton, Fitzroy & 20+ Melbourne suburbs."
```

4. **Add testimonials section** (placeholder for launch):
- Event organizer quotes
- Vendor success stories
- "As seen at" logos (future: Melbourne events)

---

### Browse Vendors (`/app`)

**Current State:**
- ✅ Vendor grid with filters (suburb, event type, price)
- ✅ Clean cards with pricing, suburbs, capacity
- ✅ CTA buttons (Get a Quote, View)
- ✅ Dynamic data from Supabase

**SEO Strengths:**
- Filter UI exposes suburb names (good for crawlers)
- Descriptive vendor cards
- Links to individual vendor pages

**Opportunities:**
- ❌ **No metadata** — Page has no title/description
- ❌ **No structured data** — Could use ItemList schema for vendor listings
- ❌ **No H1** — "Browse all vendors" should be H1
- ❌ **No introductory content** — Minimal text for SEO
- ❌ **No breadcrumbs** — Missing navigation context

**Recommended Actions:**

1. **Add metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Browse Melbourne Coffee Cart Vendors | The Bean Route',
  description: 'Compare 10+ verified coffee cart vendors across Melbourne. Filter by suburb, event type, and price. Free quotes from trusted mobile baristas.',
}
```

2. **Add ItemList schema:**
```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "LocalBusiness",
      "name": "Vendor Name",
      "url": "https://thebeanroute.com.au/vendors/slug"
    }
  ]
}
```

3. **Add introductory section:**
- H1: "Melbourne's Best Mobile Coffee Cart Vendors"
- Paragraph explaining the marketplace, verification process, coverage area
- Keyword-rich content before vendor grid

4. **Add breadcrumbs:**
```text
Home > Browse Vendors
```

---

### Vendor Detail Pages (`/vendors/[slug]`)

**Current State:**
- ✅ Server-side rendering with generateMetadata
- ✅ LocalBusiness schema implemented
- ✅ Breadcrumb schema
- ✅ Dynamic meta descriptions with suburbs and pricing
- ✅ OpenGraph tags

**SEO Strengths:**
- **BEST SEO setup in the site** — Well-structured schema, metadata, breadcrumbs
- Geo-targeting with suburb arrays in schema
- Price transparency in both schema and description

**Opportunities:**
- ❌ **Thin content** — Page likely has minimal text (need to verify VendorPageClient.tsx)
- ❌ **No FAQs** — Each vendor could have FAQ schema
- ❌ **No reviews/testimonials** — Missing Review schema
- ❌ **No "Why book [vendor]?" section** — Conversion optimization gap
- ❌ **No internal linking** — Should link to relevant guides (how-to-hire, costs)
- ❌ **No event type targeting** — Could add sections like "Perfect for Corporate Events"

**Recommended Actions:**

1. **Add FAQ schema per vendor:**
```json
{
  "@type": "Question",
  "name": "What suburbs does [Vendor] serve?",
  "acceptedAnswer": { "text": "We serve [suburbs list] in Melbourne." }
}
```

2. **Add content sections:**
- "Why book [Vendor Name]?" — Vendor USPs, differentiators
- "Perfect for these events" — Event type targeting (corporate, weddings, etc.)
- "What to expect" — Service process, setup, typical experience

3. **Add Review schema** (when reviews feature launches):
```json
{
  "@type": "Review",
  "reviewRating": { "@type": "Rating", "ratingValue": "5" },
  "author": { "@type": "Person", "name": "Event Organizer" }
}
```

4. **Internal linking:**
- Link to `/contractors/how-to-hire` — "Learn how booking works"
- Link to `/contractors/coffee-cart-costs` — "Understand pricing"
- Cross-link to similar vendors in same suburbs

5. **Trust signals:**
- Verified badge explanation
- Response time estimate
- Event count (if available)

---

### Job Board (`/jobs`, `/jobs/[id]`)

**Current State:**
- ✅ Job listings with filters
- ✅ Quote counts visible
- ✅ Clean job cards with event details

**SEO Opportunities:**
- ❌ **No metadata** — Missing title/description
- ❌ **No schema** — JobPosting schema not implemented
- ❌ **No indexing strategy** — Should individual jobs be indexed?
- ❌ **No breadcrumbs**

**Recommended Actions:**

1. **Add metadata to `/jobs`:**
```typescript
export const metadata: Metadata = {
  title: 'Melbourne Coffee Cart Jobs | The Bean Route',
  description: 'Find mobile coffee cart opportunities in Melbourne. Event organizers post jobs, vendors submit quotes. Free to join.',
}
```

2. **Add JobPosting schema to `/jobs/[id]`:**
```json
{
  "@type": "JobPosting",
  "title": "Coffee Cart Needed for Corporate Event",
  "description": "Looking for mobile barista service",
  "datePosted": "2024-02-05",
  "validThrough": "2024-02-12",
  "hiringOrganization": { "@type": "Organization", "name": "The Bean Route" }
}
```

3. **Consider noindex for individual jobs** (if short-lived):
```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: true }
}
```

---

### Content Marketing Pages

#### `/contractors/how-to-hire`

**Current State:**
- ✅ **Excellent** — Best content page on the site
- ✅ HowTo schema implemented
- ✅ Breadcrumbs
- ✅ Structured 5-step process
- ✅ Tips section
- ✅ CTA to Browse Vendors

**Opportunities:**
- ⚠️ **Could go deeper** — Add more local context (Melbourne-specific venues, suburbs)
- ⚠️ **No images** — Visual aids would help
- ⚠️ **Limited internal linking** — Could link to specific vendors or vendor types

**Recommended Enhancements:**

1. **Add Melbourne-specific content:**
- "Popular Melbourne venues for coffee cart events" section
- Suburb-specific tips (CBD logistics, parking in Carlton, etc.)

2. **Add internal links:**
- Link to example vendors: "Like [Vendor Name] who specializes in corporate events"
- Link to job board: "Or post a job and let vendors come to you"

3. **Add FAQ section:**
- Additional Q&A beyond existing tips
- Target long-tail keywords

#### `/contractors/coffee-cart-costs`

**Needs Verification:** This page exists in routes but wasn't analyzed. Should include:
- Price breakdown by event type
- Melbourne market rates
- What affects pricing (suburbs, guest count, duration)
- FAQPage schema

#### `/vendors-guide/get-listed`

**Current State:**
- ✅ FAQ schema implemented
- ✅ Clear steps and requirements
- ✅ Strong CTA to `/vendors/register`

**Opportunities:**
- ⚠️ **Could add success stories** — "Meet vendors who found success"
- ⚠️ **No data/stats** — "Vendors get average X inquiries per month"

**Recommended Enhancements:**

1. **Add vendor testimonials:**
- Quotes from current vendors
- Success metrics (inquiries received, bookings made)

2. **Add "How much can I earn?" calculator section**

---

## 3. Local SEO (GEO) Strategy

### Current GEO Implementation

**Strengths:**
- ✅ "Melbourne" keyword in all key pages
- ✅ Suburb arrays in vendor LocalBusiness schema
- ✅ areaServed in schema markup

**Gaps:**
- ❌ **No Google Business Profile** — Critical for local discovery
- ❌ **No local citations** — Not listed in Yelp, TrueLocal, etc.
- ❌ **No suburb landing pages** — Missing `/suburbs/carlton`, `/suburbs/fitzroy`, etc.
- ❌ **No neighborhood content** — "Best coffee carts in Carlton"
- ❌ **No local backlinks** — Not mentioned on Melbourne event blogs, venues

### Recommended GEO Actions

#### Phase 1: Foundation (High Priority)

1. **Create Google Business Profile:**
   - Category: "Coffee Shop" or "Event Planner"
   - Service area: Melbourne + 20 suburbs
   - Link to website
   - Add photos of vendor setups

2. **NAP Consistency:**
   - Ensure Name, Address (service area), Phone consistent across:
     - Website footer
     - Google Business Profile
     - Social media
     - Any citations

3. **Add suburb-specific content to vendor pages:**
   - Vendor detail pages already have suburbs in schema
   - Add visible section: "Serving [Suburb Name] & Nearby Areas"
   - Include suburb-specific details (parking, popular venues)

#### Phase 2: Expansion (Medium Priority)

4. **Create suburb landing pages:**
   - `/suburbs/carlton` → "Mobile Coffee Carts in Carlton"
   - `/suburbs/fitzroy` → "Mobile Coffee Carts in Fitzroy"
   - Dynamic generation from vendors table suburb data
   - List vendors serving each suburb
   - Local content (popular venues, events, parking tips)

5. **Local citations:**
   - Submit to:
     - TrueLocal
     - Yelp (if applicable)
     - Melbourne.com listings
     - Event venue directories

6. **Local content marketing:**
   - "Best suburbs for outdoor coffee cart events in Melbourne"
   - "Melbourne coffee cart pricing by suburb"
   - "Top 10 Melbourne venues for coffee cart service"

#### Phase 3: Advanced (Future)

7. **Local backlinks:**
   - Partner with Melbourne event venues (link from their vendor lists)
   - Guest posts on Melbourne food/event blogs
   - Get featured on "Best of Melbourne" lists

8. **Event partnerships:**
   - Sponsor local events (backlink from event website)
   - Get mentioned in event guides

---

## 4. Answer Engine Optimization (AEO)

### Current AEO Implementation

**Implemented:**
- ✅ FAQ schema on `/vendors-guide/get-listed`
- ✅ HowTo schema on `/contractors/how-to-hire`
- ✅ Breadcrumbs (navigation context)

**Gaps:**
- ❌ **Limited FAQ coverage** — Only 2 pages have FAQ schema
- ❌ **No conversational content** — Most pages lack Q&A format
- ❌ **Missing featured snippet targets** — No tables, lists optimized for snippets
- ❌ **No "People also ask" targeting** — Not addressing common questions

### Recommended AEO Strategy

#### High-Priority Questions to Target

**On Landing Page (`/`):**
1. "How much does a mobile coffee cart cost in Melbourne?"
   - Answer: "$150-$350 per hour depending on guest count and event type"
   - Add as FAQ schema + visible section

2. "Which Melbourne suburbs have coffee cart vendors?"
   - Answer: "CBD, Carlton, Fitzroy, Camberwell, and 20+ other suburbs"
   - Add suburb list with links

3. "How do I book a coffee cart for my event?"
   - Answer: Step-by-step (Browse → Inquire → Confirm)
   - Link to `/contractors/how-to-hire`

**On Browse Page (`/app`):**
1. "What's the difference between coffee cart vendors?"
   - Answer: Specialty (espresso, cold brew, pour-over), pricing, suburbs served
   - Add above vendor grid

2. "How do I know if a vendor is good?"
   - Answer: Verified badge, pricing transparency, suburb coverage
   - Trust signals section

**On Vendor Pages:**
1. "What suburbs does [Vendor] serve?"
   - Answer: Pull from suburbs array
   - FAQ schema per vendor

2. "What events is [Vendor] best for?"
   - Answer: Based on tags (corporate, weddings, etc.)
   - Add visible section

3. "How do I book [Vendor]?"
   - Answer: Click "Get a Quote", fill form, vendor responds in 24hrs
   - FAQ schema

#### Featured Snippet Optimization

**Create structured content for snippets:**

1. **Pricing table** (add to `/contractors/coffee-cart-costs`):
```markdown
| Event Type | Guest Count | Typical Cost |
|---|---|---|
| Corporate breakfast | 50-100 | $200-$300 |
| Wedding | 100-150 | $300-$500 |
| Festival | 200+ | $400-$800 |
```

2. **Suburb list** (add to landing page):
```markdown
### Melbourne Suburbs We Serve
- CBD & Southbank
- Inner North: Carlton, Fitzroy, Collingwood, Brunswick
- Inner East: Richmond, Hawthorn, Kew, Camberwell
- Inner South: South Yarra, Prahran, St Kilda
[Full list with links to suburb pages]
```

3. **Checklist format** (add to how-to-hire):
```markdown
### Coffee Cart Booking Checklist
- [ ] Confirm guest count
- [ ] Check venue power access
- [ ] Verify setup space available
- [ ] Book 2-3 weeks ahead for weekends
- [ ] Discuss menu preferences with vendor
```

---

## 5. Conversion Optimization

### Current Conversion Elements

**Working Well:**
- ✅ Clear CTAs on landing page
- ✅ Simple inquiry form (60 seconds)
- ✅ Transparent pricing on vendor cards
- ✅ Filter UI makes browsing easy

**Conversion Gaps:**

| Element | Current State | Opportunity | Priority |
|---|---|---|---|
| Trust signals | Stats only (10+ vendors, 60s time) | Add testimonials, reviews, logos | High |
| Social proof | None | Vendor success stories, booking count | High |
| Urgency | None | "X vendors booked this week" | Medium |
| Guarantees | None | "Free to inquire", "No obligation" | Medium |
| Comparison | Vendor cards | Add comparison table feature | Low |
| Exit intent | None | Popup with "Still have questions?" | Low |

### Recommended Conversion Enhancements

#### Phase 1: Trust & Social Proof

1. **Add testimonials section to landing page:**
```jsx
<section className="testimonials">
  <h2>What event organizers say</h2>
  <div className="testimonial-grid">
    <Testimonial
      quote="Found the perfect cart for our corporate event in CBD. Booking was seamless."
      author="Sarah L., Event Manager"
      event="Corporate Breakfast, 80 guests"
    />
  </div>
</section>
```

2. **Add trust badges to vendor cards:**
   - "Verified by The Bean Route"
   - "Responds within 24 hours"
   - "Served 50+ events" (if data available)

3. **Add booking count to landing page:**
   - "Join 200+ event organizers who've booked through The Bean Route"
   - Update dynamically from inquiries table

#### Phase 2: Vendor Detail Page Conversion

4. **Add "Why book [Vendor]?" section:**
```jsx
<section className="vendor-usp">
  <h2>Why book {vendor.businessName}?</h2>
  <ul>
    <li>Specializes in {vendor.specialty}</li>
    <li>Serves {vendor.suburbs.length} Melbourne suburbs</li>
    <li>Verified cart with transparent pricing</li>
    <li>{vendor.eventTypes.join(', ')} events</li>
  </ul>
</section>
```

5. **Add "Similar vendors" section:**
   - Cross-sell by suburb or specialty
   - "Other vendors serving Carlton"
   - "Other espresso specialists"

6. **Add FAQ section per vendor:**
   - Reduces friction, answers questions before inquiry
   - FAQ schema for AEO

#### Phase 3: Browse Page Optimization

7. **Add comparison feature:**
   - Checkboxes to select vendors
   - Side-by-side comparison table
   - Pricing, suburbs, capacity, event types

8. **Add "Popular vendors" filter:**
   - Sort by inquiry count or booking count
   - "Most booked this month"

9. **Add "Recently viewed" section:**
   - Persist in localStorage
   - "Continue where you left off"

#### Phase 4: Advanced Conversion Tactics

10. **Exit intent popup:**
    - Trigger when mouse leaves viewport
    - "Still have questions? Get answers in 60 seconds"
    - Link to FAQ or contact

11. **Chat widget** (future):
    - Answer common questions
    - Route to specific vendors

12. **Booking funnel analytics:**
    - Track: Page view → Vendor view → Inquiry click → Form submit
    - Identify drop-off points

---

## 6. Content Gaps & Opportunities

### Missing Content That Would Drive Traffic

#### High-Impact Content (Create Soon)

1. **Suburb guides** (GEO opportunity):
   - "Mobile Coffee Carts in Carlton" (+ 20 suburbs)
   - Template: Vendors serving area, popular venues, parking tips, local events

2. **Event type guides**:
   - "How to Hire Coffee Cart for Corporate Event"
   - "Coffee Cart Wedding Guide Melbourne"
   - "Festival Coffee Cart Booking Tips"

3. **Pricing guide** (AEO + conversion):
   - Complete version of `/contractors/coffee-cart-costs`
   - Tables, calculators, examples
   - Target: "coffee cart cost Melbourne"

4. **Comparison content**:
   - "Espresso Cart vs. Cold Brew Cart: Which Do You Need?"
   - "Mobile Barista vs. DIY Coffee Station"

#### Medium-Impact Content (Future)

5. **Blog/resources section**:
   - `/resources` or `/blog`
   - Ongoing content marketing
   - Topics:
     - "Best Melbourne venues for coffee cart events"
     - "Coffee cart setup checklist"
     - "How to choose beans for your event"
     - "Latte art: Does it matter for corporate events?"

6. **Vendor success stories**:
   - `/vendors/success-stories`
   - Interviews with top vendors
   - "How [Vendor] books 20 events per month"

7. **Case studies**:
   - `/case-studies/corporate-breakfast-cbd`
   - Detailed event stories
   - Photos, quotes, vendor details

8. **Seasonal content**:
   - "Summer coffee cart events in Melbourne"
   - "Corporate Christmas party coffee cart ideas"

#### Low-Impact (Nice to Have)

9. **Video content**:
   - Vendor showcase videos
   - "Day in the life" of a mobile barista
   - Event highlights

10. **Glossary**:
    - "/glossary" — Coffee terms, event planning terms
    - AEO opportunity for definitions

---

## 7. Technical SEO Checklist

### Critical (Do Now)

- [ ] **Create sitemap.xml**
  - Dynamic generation for vendors, jobs, content pages
  - Submit to Google Search Console

- [ ] **Create robots.txt**
  - Allow: `/`, `/app`, `/vendors/*`, `/contractors/*`, `/vendors-guide/*`, `/jobs`
  - Disallow: `/admin`, `/api/*`, `/design-system`
  - Sitemap: https://thebeanroute.com.au/sitemap.xml

- [ ] **Add canonical URLs**
  - Prevent duplicate content issues
  - All pages should have `<link rel="canonical">`

- [ ] **Verify mobile-friendliness**
  - Test all pages on mobile
  - Google Mobile-Friendly Test

- [ ] **Page speed optimization**
  - Run Lighthouse audit
  - Optimize images (vendor photos when added)
  - Check Core Web Vitals

### Important (Soon)

- [ ] **Add alt text to all images**
  - Current: Limited images, but vendor photos coming
  - Format: "Mobile coffee cart setup at [Event] in [Suburb]"

- [ ] **Implement image lazy loading**
  - Already handled by Next.js Image component (verify usage)

- [ ] **Add structured data testing**
  - Use Google Rich Results Test
  - Verify all schema.org markup

- [ ] **Set up Google Search Console**
  - Monitor indexing, errors, queries
  - Submit sitemap

- [ ] **Set up Google Analytics 4**
  - Track conversions (inquiry submissions, page views)
  - Set up goals: Inquiry form submit, vendor page views

### Nice to Have (Future)

- [ ] **Implement Open Graph images**
  - Custom OG images for vendor pages
  - Dynamic generation with vendor branding

- [ ] **Add Twitter Card tags**
  - Summary cards for sharing

- [ ] **Implement AMP** (if needed)
  - Probably not necessary for this site

- [ ] **Monitor Core Web Vitals**
  - LCP, FID, CLS tracking

---

## 8. Internal Linking Strategy

### Current State

**Existing Internal Links:**
- Landing page → `/app`, `/vendors-guide/get-listed`
- Browse page → Individual vendor pages
- Content pages → Back to parent sections
- Vendor pages → (none, needs work)

### Recommended Internal Linking

#### Hub & Spoke Model

**Hub 1: Event Organizers (Contractors)**
- Hub page: `/contractors` (create)
- Spokes:
  - `/contractors/how-to-hire`
  - `/contractors/coffee-cart-costs`
  - `/contractors/event-types/corporate`
  - `/contractors/event-types/weddings`
  - `/contractors/suburbs` (suburb guides)

**Hub 2: Vendors**
- Hub page: `/vendors-guide` (enhance existing)
- Spokes:
  - `/vendors-guide/get-listed`
  - `/vendors-guide/grow-your-business`
  - `/vendors-guide/success-stories` (create)
  - `/vendors-guide/pricing-tips` (create)

**Hub 3: Locations**
- Hub page: `/suburbs` (create)
- Spokes:
  - `/suburbs/carlton`
  - `/suburbs/fitzroy`
  - (One per major suburb)

#### Cross-Linking Rules

1. **Vendor detail pages should link to:**
   - How-to-hire guide: "Learn how booking works →"
   - Pricing guide: "Understand coffee cart pricing →"
   - Suburb page: "More vendors in [Suburb] →"
   - Related vendors: "Similar vendors in [Suburb]"

2. **Browse page should link to:**
   - How-to-hire: "New to hiring coffee carts? Start here →"
   - Suburb guides: "Explore vendors by suburb →"

3. **Content pages should link to:**
   - Relevant vendors: "Browse espresso specialists →"
   - Browse page: "See all vendors →"
   - Other guides: "Also read: Coffee cart costs →"

4. **Landing page should link to:**
   - All hub pages
   - Top 3 content pages
   - Browse vendors (primary CTA)

---

## 9. Competitor Analysis (Brief)

### Likely Competitors

**Direct competitors:**
- Individual vendor websites (e.g., specific Melbourne coffee carts)
- Event booking platforms (general, not coffee-specific)

**Indirect competitors:**
- Google search: "mobile coffee cart Melbourne"
- Social media: Instagram, Facebook event groups
- Word of mouth

### Competitive Advantages to Emphasize

1. **Curated marketplace** — Verified vendors only
2. **Transparent pricing** — Upfront hourly rates
3. **Geo-targeted** — Melbourne-specific, suburb filters
4. **Free to inquire** — No platform fees (unlike some marketplaces)
5. **Fast process** — "60 seconds to submit inquiry"

### SEO Opportunities vs. Competitors

- **Long-tail keywords:** "mobile coffee cart [suburb] Melbourne"
- **Content marketing:** How-to guides, event planning tips
- **Local SEO:** Dominate "near me" searches with GBP
- **Schema markup:** Rich results in search (competitors likely lack this)

---

## 10. Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)

**Goal:** Fix low-hanging fruit, boost existing page performance

- [ ] Add metadata to all pages (landing, browse, jobs)
- [ ] Create sitemap.xml and robots.txt
- [ ] Add FAQ sections to landing page and vendor pages
- [ ] Implement canonical URLs
- [ ] Add H1 tags where missing
- [ ] Enhance landing page with suburb mentions
- [ ] Add breadcrumbs to browse page

**Expected Impact:**
- Better indexing by search engines
- Improved click-through rates from search results
- Foundation for featured snippets

### Phase 2: Local SEO Foundation (2-3 weeks)

**Goal:** Establish local presence, start ranking for geo queries

- [ ] Create Google Business Profile
- [ ] Add suburb-specific content to vendor pages
- [ ] Create `/suburbs/[slug]` landing pages (top 10 suburbs)
- [ ] Add local citations (TrueLocal, Yelp)
- [ ] Optimize vendor LocalBusiness schema with more details
- [ ] Create `/contractors` hub page with links to guides

**Expected Impact:**
- Appear in "coffee cart near me" searches
- Rank for "[suburb] coffee cart" queries
- Build local authority

### Phase 3: Content Expansion (Ongoing)

**Goal:** Drive organic traffic with valuable content

- [ ] Complete `/contractors/coffee-cart-costs` guide
- [ ] Create event type guides (corporate, weddings, festivals)
- [ ] Write suburb guides for all 20+ suburbs
- [ ] Add blog/resources section
- [ ] Publish vendor success stories
- [ ] Create comparison content

**Expected Impact:**
- Rank for informational queries
- Build topical authority
- Increase time on site

### Phase 4: Conversion Optimization (3-4 weeks)

**Goal:** Convert more visitors to inquiries

- [ ] Add testimonials section to landing page
- [ ] Implement "Why book [vendor]?" sections
- [ ] Add trust badges and social proof
- [ ] Create vendor comparison feature
- [ ] Add "Similar vendors" cross-sell
- [ ] Implement exit intent popup
- [ ] A/B test CTA copy and placement

**Expected Impact:**
- Increase inquiry form submissions
- Reduce bounce rate
- Improve time to conversion

### Phase 5: Advanced SEO (Future)

**Goal:** Dominate Melbourne coffee cart search results

- [ ] Video content for vendor profiles
- [ ] Review schema when reviews feature launches
- [ ] Link building campaign (guest posts, partnerships)
- [ ] Seasonal content calendar
- [ ] Event partnerships for backlinks
- [ ] Voice search optimization

**Expected Impact:**
- Page 1 rankings for all target keywords
- Rich results (videos, reviews, FAQs)
- Brand recognition

---

## 11. Success Metrics

### SEO KPIs

**Organic Traffic:**
- Baseline: (measure before starting)
- Goal Month 1: +20% organic sessions
- Goal Month 3: +50% organic sessions
- Goal Month 6: +100% organic sessions

**Rankings:**
- Track top 20 keywords:
  - "mobile coffee cart Melbourne"
  - "coffee cart hire Melbourne"
  - "melbourne coffee cart"
  - "coffee cart [suburb]" (×20 suburbs)
  - "corporate coffee cart Melbourne"
  - "wedding coffee cart Melbourne"
- Goal: Top 3 for primary keywords, top 10 for long-tail

**Indexation:**
- Baseline: Count indexed pages (Google: site:thebeanroute.com.au)
- Goal: 100% of public pages indexed within 2 weeks

### Local SEO KPIs

**Google Business Profile:**
- Goal: 100+ views per month within 3 months
- Goal: 10+ discovery searches per month
- Goal: 20+ website clicks from GBP per month

**Local Pack Rankings:**
- Track: "coffee cart near me" in 10 Melbourne locations
- Goal: Appear in Local Pack for 5+ suburbs

### Conversion KPIs

**Inquiry Form Submissions:**
- Baseline: (current weekly inquiry count)
- Goal Month 1: +15% inquiry submissions
- Goal Month 3: +30% inquiry submissions

**Organic Conversion Rate:**
- Metric: (Organic inquiries / Organic sessions) × 100
- Goal: 2-3% conversion rate from organic traffic

**Vendor Page Views:**
- Baseline: Current views per vendor page
- Goal: +50% vendor page views from SEO traffic

### Content KPIs

**Pages Ranking:**
- Goal: 10+ pages ranking in top 10 for target keywords
- Goal: 5+ featured snippets captured

**Time on Site:**
- Baseline: Current average session duration
- Goal: +20% increase (indicates content engagement)

**Pages per Session:**
- Baseline: Current pages/session
- Goal: 2.5+ pages/session (good internal linking)

---

## 12. Tools & Resources

### Essential SEO Tools

**Free:**
- Google Search Console — Monitor indexing, queries, errors
- Google Analytics 4 — Track traffic, conversions, behavior
- Google Business Profile — Local SEO
- Google Rich Results Test — Validate schema markup
- Google PageSpeed Insights — Performance + Core Web Vitals

**Recommended (Paid):**
- Ahrefs or Semrush — Keyword research, competitor analysis, backlinks
- Screaming Frog — Technical SEO audits
- BrightLocal — Local SEO tracking, citation management

### Next.js SEO Resources

- Next.js Metadata API docs
- JSON-LD schema generator
- Sitemap generation library (next-sitemap)

---

## Appendix: Priority Actions Summary

### Do This Week

1. ✅ Create this audit document
2. Add metadata to landing page, browse page, jobs page
3. Create sitemap.xml
4. Create robots.txt
5. Add FAQ section to landing page with schema

### Do This Month

6. Set up Google Business Profile
7. Create 10 suburb landing pages
8. Add "Why book" sections to vendor pages
9. Complete coffee-cart-costs guide
10. Add testimonials section to landing page

### Do This Quarter

11. Build out all content marketing pages
12. Launch blog/resources section
13. Implement conversion optimization tests
14. Build local citation profile
15. Start link building outreach

---

**Next Steps:** Discuss priorities with team, allocate resources, begin Phase 1 quick wins.
