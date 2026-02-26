# The Bean Route

## What This Is

The Bean Route is a **two-sided marketplace and coffee culture hub** for Melbourne. Event organizers find and book mobile coffee carts, coffee shops, and baristas for their events. Vendors get discovered through organic search (blog content, location guides) and manage their business through a self-service dashboard. The platform combines marketplace functionality with SEO-driven content to create a sustainable vendor acquisition loop.

## Current Milestone: v1.0 Vendor Platform MVP

**Goal:** Enable vendors to self-manage their presence, view inquiry performance, and access analytics through OAuth-authenticated dashboard.

**Target features:**
- Vendor authentication (OAuth with Google/Facebook)
- Vendor dashboard with profile management
- Quote success tracking and analytics
- Review system for event organizers to rate vendors

## Core Value

**Enable vendor success through self-service tools while driving organic discovery via high-intent coffee and event content that becomes Melbourne's go-to resource for booking coffee experiences.**

## Requirements

### Validated

**Platform Foundation:**
- ✓ Supabase PostgreSQL database (RLS hardened, Epic 1)
- ✓ Next.js 15 with App Router
- ✓ Vendor directory and profiles (mobile carts, coffee shops, baristas)
- ✓ Job board for event postings with quote submission
- ✓ Admin dashboard with OTP authentication (iron-session)
- ✓ Vendor self-registration flow (public, pending approval)
- ✓ Inquiry system for event organizers

**Content Marketing (Content Phases):**
- ✓ Payload CMS integration for blog management
- ✓ Blog infrastructure with SEO optimization
- ✓ shadcn/ui design system implementation
- ✓ Mobile-optimized flows (vendor registration, inquiry forms)
- ✓ Internal linking strategy (blog → vendor profiles)

### Active (v1.0 Vendor Platform MVP)

- [ ] Vendor authentication with OAuth (Google/Facebook)
- [ ] Vendor dashboard landing page
- [ ] Vendor profile editor (self-service)
- [ ] Inquiry inbox for vendors (view inquiries received)
- [ ] Quote submission history with status tracking
- [ ] Analytics dashboard (views, inquiries, conversion rate)
- [ ] Review system (event organizers rate vendors post-event)
- [ ] Review display on public vendor profiles

### Out of Scope (v1.0)

- Vendor image uploads — deferred to v1.1
- Real-time chat/messaging — not core to marketplace MVP
- Advanced analytics (A/B testing, cohort analysis) — v2.0+
- Mobile app — web-first focus
- Payment processing (Stripe deposits) — Epic 4
- Multi-location expansion beyond Melbourne — future milestone

## Context

**Current State (Feb 2026):**
- Two-sided marketplace connecting event organizers with coffee vendors (mobile carts, coffee shops, baristas)
- 10 seed vendors in Melbourne with 23-suburb coverage
- Public vendor directory, job board with quote submission, inquiry system
- Admin portal (OTP auth) for vendor application approvals and inquiry management
- Blog infrastructure with Payload CMS (content marketing phases in progress)
- shadcn/ui design system implemented, mobile flows optimized

**Vendor Limitations (Pre-v1.0):**
- No vendor authentication — vendors cannot log in
- No vendor dashboard — vendors cannot view inquiries or manage profiles
- Admin manually forwards inquiries to vendors via email
- Vendors submit quotes via public job board forms (no account needed)
- No analytics or performance tracking for vendors

**v1.0 Motivation:**
- Vendors need self-service tools to manage their presence
- Admin overhead too high (manual inquiry forwarding, profile updates)
- Vendor churn risk without visibility into inquiry performance
- Review system needed for trust/credibility signals

**Technical Environment:**
- Next.js 15 + React 19 (App Router)
- Supabase PostgreSQL (RLS policies hardened in Epic 1)
- iron-session for admin auth (OTP-based)
- Brevo for transactional emails
- Playwright for E2E testing

## Constraints

- **Tech Stack:** Next.js 15 + Supabase + Payload CMS (existing, cannot change)
- **Auth System:** Must integrate with existing Supabase setup (no separate auth service)
- **Compatibility:** Must work alongside existing admin auth (iron-session) without conflicts
- **Security:** RLS policies mandatory (Epic 1 hardening cannot regress)
- **Budget:** Prefer free tier OAuth (Google/Facebook) over paid auth services
- **Timeline:** No timeline constraints for v1.0 (quality over speed)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| OAuth over email/password | Lower friction signup, no password management, proven UX | — Pending |
| Google + Facebook providers | Cover 90%+ of users, both have free OAuth tiers | — Pending |
| Skip Epic 2 for v1.0 | Vendor dashboard higher priority than image uploads/previews | ✓ Good |
| Supabase Auth | Native Supabase Auth works with RLS, avoids external dependencies | — Pending |
| shadcn/ui design system | Already implemented, consistent vendor dashboard UI | ✓ Good |
| Review system in v1.0 | Trust signals critical for marketplace, not deferrable | — Pending |

---
*Last updated: 2026-02-26 after v1.0 milestone initialization*
