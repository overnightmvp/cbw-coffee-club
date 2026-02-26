# Feature Landscape: Vendor Platform v1.0

**Domain:** Two-sided marketplace (vendor authentication, self-service tools, review system)
**Researched:** 2026-02-26

---

## Table Stakes

Features vendors expect in a self-service dashboard. Missing one = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Vendor Login (OAuth)** | Industry standard. Vendors expect Google/Facebook login. If email/password only, friction increases. | Low | Supabase Auth handles provider integration. Setup: 30 min. |
| **View Incoming Inquiries** | Core marketplace value. Vendor MUST see booking requests. Without this, vendor doesn't know if anyone is interested. | Low | Query inquiries table, filter by vendor_id. Table already exists. |
| **Mark Inquiry Status** | Vendor needs to track: "Did I respond to this?" Status workflow: pending → contacted → converted. | Low | Update inquiries.status. RLS ensures vendor can only update own. |
| **Profile Visibility** | Vendor needs to see their public profile (what event organizers see). Confidence check: "Is my info correct?" | Low | Display vendors table record. Existing profile pages already exist. |
| **Review Display** | Trust signal. Vendors want to see who liked them (reviews + ratings). Builds confidence in platform. | Low | Display reviews.* and avg_rating from vendors table. |
| **Basic Analytics** | Vendor needs metrics to know if dashboard is useful. "Did I get more inquiries this week?" At minimum: inquiry count. | Medium | Query inquiries with GROUP BY date. Recharts for visualization. |

---

## Differentiators

Features that set Bean Route apart. Not expected by competitors, but highly valued by vendors.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Conversion Rate Tracking** | Show vendor: "10 inquiries received, 3 converted to booking." Vendors optimize their profile/pricing based on data. | Medium | Calculate (quotes_submitted / inquiries) ratio. TanStack Query for caching. |
| **Weekly Trend Charts** | Show vendor how inquiries trend over time. Seasonal patterns: "More bookings in Dec/Jan?" Helps planning. | Medium | GROUP BY week, visualize with Recharts. Denormalize if query slow. |
| **Revenue Insight (v1.1+)** | Show vendor: "Avg quote price accepted: $150/hr". Helps them set pricing strategy. Deferred—requires quotes table enhancements. | High | Requires quotes + quote_accepted status. Out of scope for v1.0. |
| **Mobile-Optimized Dashboard** | Vendors are always on-the-go. Dashboard should work on iPhone. Responsive design. | Low | Use shadcn/ui + Tailwind (already responsive). Test on mobile. |
| **Review Filtering** | Vendor can filter reviews: show only 5-star, or see 3-star with feedback. Learn what to improve. | Medium | Add filter UI. Query reviews with WHERE rating >= 3. |
| **Inquiry Search** | Vendor can search inquiries: "Show me all cafe bookings in 2026." Useful for large vendors (20+ inquiries/month). | Low | Add search box. Query with text search or date range filters. |

---

## Anti-Features

Features to explicitly NOT build in v1.0. Saves scope, keeps launch clean.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Image Uploads** | Complex: image resizing, CDN, thumbnails. Deferred to v1.1. | Use existing vendor images from public profiles. Vendor can update via /vendors/register (already built). |
| **Real-Time Notifications** | Requires WebSocket (Supabase Realtime) + complexity. Not critical for MVP. | Email notifications (Brevo). Vendor checks dashboard manually. Adequate for v1.0. |
| **Vendor-to-Organizer Chat** | Out of scope. Event organizers already use inquiry form + email. | Keep email-based communication. Chat is v2.0. |
| **Quote Responses from Dashboard** | Vendor already submits quotes via public job board. View in dashboard optional. | Defer quote response to Phase 4. Let vendors use job board. |
| **Advanced Analytics (Cohort, Funnels)** | Complex queries, requires event tracking setup. | Track basic metrics: inquiries, conversions. Cohort analysis in v2.0. |
| **A/B Testing Dashboard** | Nice-to-have. Doesn't help vendor sell more bookings. | Skip for v1.0. Focus on actionable insights. |
| **Multi-Location Support** | Vendor can have 1 location in Melbourne. Multi-location is regional expansion (v2.0). | Assume vendors.location is single value. No location array. |
| **Custom Branding** | Vendor wants their dashboard to match brand colors. Too much scope. | Use platform's shadcn/ui theme. Professional but generic. |

---

## Feature Dependencies

```
Vendor Authentication (OAuth)
    ├─ Vendor Dashboard Landing  → Requires: OAuth
    │   ├─ Inquiry Inbox         → Requires: Dashboard + OAuth
    │   │   ├─ Analytics (Metrics)
    │   │   ├─ Status Updates
    │   │   └─ Trending Charts
    │   ├─ Profile View (Existing)
    │   ├─ Profile Editor        → Requires: Dashboard + OAuth
    │   └─ Settings (TBD v1.1)

Review System (Independent)
    ├─ Review Schema + RLS       → Requires: Supabase schema
    ├─ Submit Review Form        → Requires: Review Schema
    ├─ Display on Public Profile → Requires: Review Schema
    └─ Review Analytics (v1.1)   → Requires: Reviews implemented

Email Notifications (Existing)
    ├─ Sends to vendor (no changes needed)
```

**Non-Blocking Features:**
- Review system can be built in parallel (doesn't depend on vendor dashboard)
- Profile editor can defer to Phase 6 (inquiry inbox is critical first)

---

## MVP Recommendation

Prioritize in this order:

**Phase 1: Foundation**
1. **Vendor OAuth login** (Google + Facebook)
   - Why first: Blocks all other vendor features. Simplest to implement.
   - Time: 2-3 days (Supabase OAuth boilerplate)

**Phase 2: Container**
2. **Vendor dashboard landing page**
   - Why second: Provides UX scaffold for all subsequent features.
   - Time: 1-2 days (shadcn/ui layout)

**Phase 3: Core Value**
3. **Inquiry inbox with status tracking**
   - Why third: Core marketplace feature. Vendors see bookings. Unblocks analytics.
   - Time: 3-4 days (TanStack Query + table UI)

**Phase 4: Insight**
4. **Basic analytics (inquiry trends, conversion rate)**
   - Why fourth: Requires inquiry data from Phase 3. Shows ROI.
   - Time: 3-4 days (Recharts + queries)

**Phase 5: Trust** (Parallel to Phases 3-4)
5. **Review system (submit + display)**
   - Why parallel: Independent from dashboard. Event organizers submit reviews. Doesn't block Phases 1-4.
   - Time: 2-3 days (schema + RLS + form)

**Phase 6: Polish** (If time allows)
6. **Vendor profile editor**
   - Why later: Lower priority. Edit can come after view.
   - Time: 2-3 days (React Hook Form + Zod)

---

## Deferred to v1.1+

| Feature | Phase | Reason |
|---------|-------|--------|
| Image uploads | v1.1 | Requires CDN, image processing. Not blocking for MVP. |
| Real-time notifications | v1.1 | WebSocket complexity. Email works for MVP. |
| Quote responses from dashboard | v1.1 | Quote submission exists on job board. View only is nice-to-have. |
| Revenue analytics | v1.2+ | Requires quote acceptance tracking (not in v1.0 scope). |
| Advanced filters/search | v1.1 | Basic inquiry list sufficient for MVP (avg vendor gets 2-5/month). |
| Multi-location support | v2.0+ | Regional expansion. Not Melbourne-only MVP. |

---

## User Journeys

### Journey 1: Vendor Sees Booking Request (Day 1 after launch)

```
Vendor clicks email: "You have a new booking inquiry on The Bean Route"
    ↓
Clicks link → /vendor/login
    ↓
Clicks "Sign in with Google"
    ↓
Completes Google OAuth
    ↓
Redirected to /vendor/dashboard
    ↓
Sees "You have 1 new inquiry"
    ↓
Clicks "View Inquiry"
    ↓
Sees event details: date, time, location, guest count, budget
    ↓
Clicks "Mark as Contacted"
    ↓
Status updates to "contacted" (vendor followed up)
    ↓
Later, clicks "Mark as Converted" (booking confirmed)
    ↓
Leaves platform, confident they have a booking
```

**Features used:** OAuth, Dashboard, Inquiry Inbox, Status Updates

---

### Journey 2: Vendor Checks Performance (Week 1)

```
Vendor logs into dashboard
    ↓
Sees: "5 inquiries this week, 2 converted (40% rate)"
    ↓
Views "Inquiries Received" chart (line chart, last 30 days)
    ↓
Notices: "Spike on Thursdays"
    ↓
Adjusts availability: now available Thursdays
    ↓
Leaves, feeling like platform is useful
```

**Features used:** Dashboard, Analytics (KPI cards + charts)

---

### Journey 3: Event Organizer Leaves Review (After Event)

```
Event organizer attends cafe booking by Vendor A
    ↓
1 week later, receives email: "How was the service?"
    ↓
Clicks link → Vendor A's public profile
    ↓
Sees "Leave Review" button (if not yet left review)
    ↓
Clicks, submits: "5 stars, great coffee, friendly staff!"
    ↓
Redirected back to profile
    ↓
Profile now shows: "4.5 avg rating (2 reviews)"
    ↓
Vendor A logs in later, sees new 5-star review on dashboard
```

**Features used:** Review submission, Review display on profile

---

## Feature Scope by Phase

| Phase | Feature | Table Stakes? | Differentiator? | Complexity | Est. Time |
|-------|---------|---|---|---|---|
| 1 | OAuth (Google + Facebook) | YES | No | Low | 2-3 days |
| 2 | Dashboard landing page | YES | No | Low | 1-2 days |
| 3 | Inquiry inbox | YES | No | Medium | 3-4 days |
| 3 | Status tracking | YES | No | Low | 1 day |
| 4 | Inquiry trend chart | No | YES | Medium | 2 days |
| 4 | Conversion rate KPI | No | YES | Low | 1 day |
| 5 | Review system (submit) | YES | No | Medium | 2 days |
| 5 | Review display on profile | YES | No | Low | 1 day |
| 6 | Profile editor | No | No | Medium | 2 days |
| v1.1 | Quote response view | No | YES | Low | 1 day |
| v1.1 | Image uploads | No | YES | High | 3-4 days |
| v1.1 | Real-time notifications | No | YES | High | 2-3 days |
| v1.2+ | Revenue analytics | No | YES | High | 3 days |
| v2.0+ | Advanced cohort analysis | No | YES | High | 5 days |

---

## Success Metrics

How to know v1.0 is successful:

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Vendor login rate** | 80%+ of registered vendors log in within 1 week | Supabase auth logs |
| **Inquiry inbox adoption** | 70%+ of vendors check inbox within 24hr of inquiry | TanStack Query refetch logs |
| **Conversion tracking** | Vendor marks 50%+ of inquiries as "contacted" or "converted" | inquiries.status distribution |
| **Dashboard DAU** | 30%+ of vendors return to dashboard weekly | Session frequency |
| **Review submission** | 20%+ of completed bookings get reviews | reviews table record count |
| **Time-to-action** | Vendor responds to inquiry within 2 hours (avg) | Inquiry created_at vs status updated_at |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **OAuth onboarding friction** | Vendor can't log in, quits | Phase 1: Test with 5 real vendors. Simplify flow. Support email for issues. |
| **Inquiry data stale** | Vendor sees old inquiries, misses new ones | Phase 3: Auto-refresh dashboard every 30s. Email notifications still trigger immediately. |
| **Dashboard too slow** | Vendor waits, leaves | Phase 4: Benchmark queries before launch. Add indexes. Cache aggressively with TanStack Query. |
| **RLS misconfiguration** | Vendor sees competitors' data | Phase 1: Mandatory security audit. Test data isolation. |
| **Review spam/abuse** | Fake bad reviews harm vendors | Phase 5: Add moderation (admin can delete). Require email verification for review. |
| **Low review adoption** | Reviews don't build trust signals | Phase 5: Email vendors after booking: "Ask customers to review you!" |

---

*Features researched 2026-02-26 based on vendor marketplace best practices and event booking platforms (Airbnb, Eventbrite, Calendly).*

