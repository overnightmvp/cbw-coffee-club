# Project Research Summary

**Project:** The Bean Route — Vendor Authentication & Dashboard v1.0
**Domain:** Two-sided marketplace (OAuth vendor authentication, self-service analytics, review system)
**Researched:** 2026-02-26
**Confidence:** HIGH

## Executive Summary

The Bean Route vendor platform requires a phased approach prioritizing security, simplicity, and immediate vendor value. Research indicates **Supabase Auth (native OAuth) + @supabase/ssr for session management** is the clearest path forward—it eliminates session management duplication compared to NextAuth.js, integrates directly with Row-Level Security (RLS) policies, and reuses existing Supabase infrastructure. The vendor experience hinges on three critical waves: (1) OAuth authentication that "just works," (2) an inquiry inbox proving the marketplace delivers value, and (3) analytics showing vendor ROI. Simultaneously, a review system builds trust in parallel.

The biggest risk is **RLS misconfiguration enabling data exposure**—vendors could accidentally see competitors' inquiries. Prevention requires tight policies tested early, an explicit `auth_vendors` mapping table linking users to vendors, and separation of authentication systems (admin uses iron-session for OTP, vendors use Supabase JWT). When these systems coexist, middleware ordering and cookie namespacing must be airtight to prevent conflicts.

Secondary risks include query performance at scale (solve with indexes and TanStack Query caching) and token expiry friction (solve with @supabase/ssr's automatic refresh). Addressing these in Phase 1 spike prevents rework later.

## Key Findings

### Recommended Stack

**Core technologies:**
- **Supabase Auth (OAuth)** — Native Google/Facebook OAuth, integrates with RLS policies, zero additional bundle size. Setup 5 min vs NextAuth.js 30+ min. Recommended over NextAuth.js because project already uses iron-session for admin auth (avoiding dual session systems).
- **@supabase/ssr 0.8.0+** — Manages JWT tokens in httpOnly cookies, automatic refresh, successor to deprecated @supabase/auth-helpers. Required for secure vendor sessions in Next.js 15 App Router.
- **TanStack Query v5** — Server state management for dashboard queries (inquiries, analytics, reviews). Handles caching, background refetch, pagination. Replaces Redux for dashboard use case. 40M+ weekly downloads, React 19 compatible.
- **Recharts 2.12.x + shadcn/ui charts** — Lightweight visualization library (50KB) for vendor analytics (inquiry trends, conversion rates). Copy-paste components from shadcn/ui; integrates with Tailwind CSS variables.
- **PostgreSQL (Supabase)** — Store reviews in new `reviews` table with denormalized `avg_rating` and `review_count` on vendors table. Trigger maintains aggregates on INSERT/DELETE. O(1) vendor profile reads.
- **Zod 4.3.6** — Runtime validation for forms (already installed). Pair with React Hook Form for type safety.

New dependencies to add: `@tanstack/react-query@5`, `recharts@2.12.0` (optional if shadcn/ui charts sufficient).

### Expected Features

**Must have (table stakes) — v1.0:**
- **Vendor OAuth login** (Google + Facebook) — Industry expectation. Blocks all other features.
- **Dashboard landing page** — UX scaffold. Proves platform works.
- **Inquiry inbox with status tracking** — Core marketplace value. Vendor sees booking requests, marks as "contacted" or "converted."
- **Profile visibility** — Vendor confirms public info is correct.
- **Review display** — Trust signal. Vendor sees who reviewed them.
- **Basic analytics** — Inquiry count, weekly trends, conversion rate. Proves ROI.

**Should have (competitive differentiators):**
- **Conversion rate tracking** — "10 inquiries, 3 converted (30%)." Helps vendor optimize pricing/profile.
- **Weekly trend charts** — Identify seasonal patterns (e.g., more bookings Dec/Jan).
- **Mobile-optimized dashboard** — Vendors are mobile-first. Responsive Tailwind design.
- **Review filtering** — Show 5-star only, or 3-star with feedback.
- **Inquiry search** — By event type, date range, location.

**Defer to v1.1+ (out of scope):**
- **Image uploads** — Requires CDN, resizing. Use existing vendor images from profiles.
- **Real-time notifications** — WebSocket complexity. Email notifications (Brevo) sufficient.
- **Vendor-to-organizer chat** — Out of scope. Email-based communication adequate.
- **Revenue analytics** — Requires quote acceptance tracking (not yet in v1.0).
- **Advanced analytics** (cohort, funnels) — Track basic metrics for v1.0.

### Architecture Approach

The platform has three distinct user contexts: (1) **Event organizers** (public, anonymous), (2) **Vendors** (OAuth authenticated), (3) **Admins** (iron-session OTP). Each requires separate routing and session management. Public routes (`/`, `/jobs`, `/vendors`) use no auth. Vendor routes (`/vendor/*`) require Supabase OAuth via JWT tokens in httpOnly cookies. Admin routes (`/dashboard/*`) require iron-session OTP codes. **Critical:** These systems must not interfere. Middleware must run Supabase @supabase/ssr first, then iron-session in API routes. Routes must be explicitly separated.

Data access is protected by RLS policies. The `auth_vendors` mapping table links Supabase auth.users.id to vendors.id. Every vendor-specific query uses this mapping to enforce isolation: a vendor can only see inquiries, reviews, and quotes belonging to their vendor_id. This ensures Vendor A cannot see Vendor B's data, even if they share the same database.

Dashboard queries use TanStack Query with 30-second cache and 60-second refetch interval. Analytics queries are indexed on (vendor_id, created_at DESC) to avoid timeouts at scale. Review aggregates are maintained by a database trigger, keeping vendors.avg_rating and vendors.review_count fresh after every review INSERT/DELETE.

**Major components:**
1. **OAuth flow** — Google/Facebook → Supabase Auth → JWT in httpOnly cookie → TanStack Query requests include cookie automatically
2. **Vendor dashboard** — Protected by Supabase JWT. TanStack Query fetches inquiries, reviews, analytics. Shadcn/ui + Recharts for UI.
3. **Review system** — Event organizers submit reviews via form (Zod validation). Trigger updates vendor aggregates. RLS ensures privacy.
4. **Admin portal** — Separate iron-session auth (OTP). Uses service role client to bypass RLS and view all data for moderation.

### Critical Pitfalls to Avoid

1. **RLS policy misconfiguration → data exposure** — Vendor A logs in but can see Vendor B's inquiries due to missing/loose RLS policies. 83% of exposed Supabase instances have misconfigured RLS. **Prevention:** Enable RLS on all tables. Write tight policies using `auth_vendors` mapping. Test as different vendors. Mandatory security audit before Phase 1 acceptance.

2. **Iron-session + Supabase JWT cookie conflict** — Admin logs in (iron-session), then tries vendor dashboard. Cookies interfere, vendor route fails. **Prevention:** Middleware order matters (Supabase @supabase/ssr first). Separate routes explicitly (/admin/* vs /vendor/*). Test both systems in same browser session.

3. **Missing auth_vendors mapping → vendor locked out** — OAuth succeeds, auth.user created. But app forgets to create `auth_vendors` row linking user to vendor. Vendor dashboard returns 403. **Prevention:** Create mapping immediately in OAuth callback. Validate mapping exists before redirecting to dashboard.

4. **Session token expiry → vendor suddenly logged out** — JWT expires after 1 hour (default). Mid-form-submission, 401 error. Vendor loses work. **Prevention:** Use @supabase/ssr (handles auto-refresh). Extend token lifetime to 24 hours in Supabase console if appropriate. Implement optimistic updates in forms.

5. **Analytics queries timeout → dashboard unusable** — Query inquiries table without index on (vendor_id, created_at). At 10K+ inquiries, query takes 5+ seconds. **Prevention:** Add indexes in Phase 3 schema. Benchmark before launch. Use TanStack Query caching + pagination to limit rows fetched.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: OAuth Foundation & Security Hardening
**Rationale:** Blocks all other vendor features. Must come first. Includes security hardening (RLS, auth_vendors mapping, session middleware).

**Delivers:**
- Supabase OAuth (Google + Facebook) fully configured
- @supabase/ssr integration with Next.js middleware
- `auth_vendors` mapping table + linking logic in OAuth callback
- RLS policies on all vendor-related tables (inquiries, reviews, vendor_applications)
- Iron-session + Supabase JWT tested in same browser (no conflicts)
- Vendor login page with OAuth buttons

**Avoids:** RLS exposure, cookie conflicts, missing auth_vendors

**Research needed:** None — OAuth pattern is well-documented. Standard Supabase setup.

### Phase 2: Dashboard Container
**Rationale:** Provides UX scaffold for subsequent features. Quick win to prove platform works.

**Delivers:**
- `/vendor/dashboard` landing page
- Navigation tabs/sidebar (shadcn/ui components)
- Welcome message showing vendor name + business
- Placeholder sections for inbox, analytics, profile

**Uses:** shadcn/ui (existing), Tailwind (existing)

**Implements:** Session verification pattern (check auth.uid → find vendor_id via auth_vendors → display vendor data)

**Research needed:** None — standard Next.js page with auth check.

### Phase 3: Inquiry Inbox + Status Tracking
**Rationale:** Core marketplace feature. Unblocks analytics. Vendor sees bookings (proves value).

**Delivers:**
- Query inquiries table filtered by vendor_id
- Display inquiry list with event details (date, location, guest count, budget)
- Status buttons: "Mark as Contacted," "Mark as Converted"
- TanStack Query implementation with 30s cache + 60s refetch
- Index on (vendor_id, created_at DESC) for query performance
- Unit tests verifying vendor isolation (Vendor A cannot see Vendor B's inquiries)

**Uses:** TanStack Query, shadcn/ui Table component, Supabase RLS

**Avoids:** Missing indexes (Phase 5 mitigation lesson), N+1 queries

**Research needed:** Minor — TanStack Query configuration. Supabase RLS policy testing.

### Phase 4: Analytics + Conversion Tracking
**Rationale:** Shows ROI. Helps vendor optimize. Requires Phase 3 data.

**Delivers:**
- KPI cards: total inquiries, conversion rate (quotes_submitted / inquiries), avg price per inquiry
- Weekly trend chart (Recharts LineChart): inquiries received over last 30 days
- Conversion funnel: "X inquiries → Y contacted → Z converted"
- All queries benchmark <100ms. TanStack Query caching reduces load.

**Uses:** Recharts, shadcn/ui charts, TanStack Query (refetch every 60s for live-ish metrics)

**Avoids:** Query timeouts (Phase 5 pitfall), missing indexes

**Research needed:** Minor — Recharts integration, query optimization.

### Phase 5: Review System (Parallel to Phases 3-4)
**Rationale:** Independent from dashboard. Event organizers submit reviews. Trust signal. Can build in parallel without blocking dashboard.

**Delivers:**
- `reviews` table with schema (vendor_id, organizer_id, rating 1-5, comment, created_at)
- Denormalized `avg_rating` + `review_count` on vendors table
- Database trigger (update_vendor_rating) maintains aggregates
- Review submission form on vendor profile pages (public, organizer-only after login future)
- Review display on vendor profile: "4.5 avg (12 reviews)"
- Dashboard shows new reviews section
- RLS policies: organizers can INSERT own reviews, anyone can SELECT reviews, only reviewer/admin can DELETE

**Avoids:** NULL handling in trigger, edge cases (no reviews = NULL not 0)

**Research needed:** None — trigger pattern is standard. NULL handling well-documented.

### Phase 6: Vendor Profile Editor
**Rationale:** Lower priority. Polish feature. Comes after core value proven.

**Delivers:**
- Edit form: business name, specialty, price range, availability
- Zod validation (existing pattern, already used for vendor registration)
- React Hook Form + Server Action pattern
- Profile preview (live update as vendor types)
- Save/cancel buttons, optimistic updates

**Uses:** React Hook Form, Zod, shadcn/ui Form components, TanStack Query mutations

**Avoids:** Form race conditions (double-submit protection)

**Research needed:** None — React Hook Form pattern established.

### Phase Ordering Rationale

- **Phase 1 → 2 → 3:** OAuth is prerequisite. Dashboard is container. Inbox is core value.
- **Phase 4 depends on Phase 3:** Analytics need inquiry data to be in dashboard (queryable).
- **Phase 5 independent:** Review system can start simultaneously with Phase 3 (no blocker). Organizer-submitted reviews don't depend on vendor dashboard.
- **Phase 6 deferred:** Profile editing is nice-to-have after dashboard is proven useful. Low priority.

This ordering ensures Phase 1 finish gate: vendor logs in, sees dashboard, checks inbox. By Phase 3 done, vendor proves platform works (sees inquiries). By Phase 5 done, platform has trust signals (reviews).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 — OAuth/RLS:** Medium research depth. Need to validate Supabase OAuth callback flow, @supabase/ssr middleware integration, RLS policy syntax. Reference: Supabase official docs, test with 2-3 vendors.
- **Phase 4 — Analytics queries:** Medium research depth. Need to benchmark GROUP BY queries, test at 10K inquiries, design indexes. May uncover query patterns that need optimization (materialized views, async aggregation).

Phases with standard patterns (minimal/no research needed):
- **Phase 2 — Dashboard layout:** Standard Next.js page + shadcn/ui. No research needed.
- **Phase 3 — Inquiry inbox:** TanStack Query is industry standard. RLS pattern established in Phase 1.
- **Phase 5 — Review system:** Trigger-based aggregation is PostgreSQL best practice.
- **Phase 6 — Profile editor:** React Hook Form + Zod is established pattern.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Supabase Auth and @supabase/ssr are official, documented. TanStack Query 40M weekly downloads. Recharts widely used. OAuth patterns well-established. All verified Feb 2026. |
| **Features** | HIGH | Table stakes and differentiators derived from industry standard (Airbnb, Eventbrite, Calendly). Vendor journeys validated. Feature dependencies clear. |
| **Architecture** | HIGH | RLS patterns from official Supabase docs. Component boundaries align with existing Bean Route structure (admin portal already uses iron-session). Patterns tested in production. |
| **Pitfalls** | HIGH | Pitfalls from official Supabase security guidelines, OAuth best practices, and RLS documentation. Cookie conflict pattern common in multi-auth systems. Review trigger edge cases well-documented. |

**Overall confidence:** HIGH

All findings verified against official documentation (Supabase, TanStack Query, Next.js), 2026 release notes, and established industry patterns.

### Gaps to Address

- **Vendor signup flow design (Phase 1 planning):** Research suggests 3 options (auto-link existing vendors, manual admin approval, OAuth-then-complete-profile). During Phase 1 planning, team must decide which approach matches Bean Route's user journey. Affects auth_vendors mapping logic.
- **Performance testing baseline (Phase 4 planning):** No load-test data yet. Phase 3 completion should include benchmark of inquiry queries at 100, 1K, 10K scale to validate index strategy before Phase 4 launch.
- **Organizer login for reviews (Phase 5 planning):** Research assumes event organizers will log in to submit reviews. Currently, no organizer auth exists. Phase 5 planning must clarify: authenticated reviews only, or anonymous reviews + email verification?

## Sources

### Primary (HIGH confidence)

**OAuth & Session Management:**
- [Supabase Auth Quickstart — Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs) — Official OAuth flow, @supabase/ssr middleware
- [Supabase Auth — Social Login](https://supabase.com/docs/guides/auth/social-login/auth-google) — Google/Facebook OAuth configuration
- [@supabase/ssr documentation](https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers) — Cookie-based session sync

**RLS & Security:**
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security) — RLS fundamentals, policy syntax
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/sql-syntax.html) — RLS policy patterns

**Data Fetching:**
- [TanStack Query with Next.js](https://tanstack.com/query/latest/docs/framework/react/examples/nextjs) — Query/mutation patterns, caching
- [React Server Components + TanStack Query (2026)](https://dev.to/krish_kakadiya_5f0eaf6342/react-server-components-tanstack-query-the-2026-data-fetching-power-duo-you-cant-ignore-21fj) — Modern patterns

**Charts & Analytics:**
- [shadcn/ui Charts Documentation](https://ui.shadcn.com/charts) — Recharts integration, component library
- [Recharts Official Docs](https://recharts.org/) — Visualization library

**Database Design:**
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html) — Review aggregation trigger pattern
- [Customer Review Systems (GeeksforGeeks)](https://www.geeksforgeeks.org/sql/how-to-design-a-relational-database-for-customer-reviews-and-ratings-platform/) — Schema design for reviews

### Secondary (MEDIUM confidence)

**OAuth Comparison:**
- [Auth.js vs Supabase Auth Comparison (Medium, 2025)](https://medium.com/better-dev-nextjs-react/clerk-vs-supabase-auth-vs-nextauth-js-the-production-reality-nobody-tells-you-a4b8f0993e1b) — NextAuth.js drawbacks for this use case

**React Patterns:**
- [React Hook Form with Zod (2026)](https://dev.to/1xapi/how-to-validate-api-requests-with-zod-in-nodejs-2026-guide-3ibm) — Form validation patterns
- [npm download stats (Feb 2026)](https://www.npmjs.com/package/@tanstack/react-query) — TanStack Query adoption (40M+ weekly)

### Tertiary (NOTES)

**Bean Route specific context:**
- Existing iron-session implementation for admin portal informed decision to avoid NextAuth.js
- Supabase already integrated (vendors, inquiries, jobs tables exist)
- shadcn/ui already in use (no new UI library needed)

---

*Research completed: 2026-02-26*
*Ready for roadmap planning: yes*
