# Roadmap: The Bean Route v1.0 Vendor Platform MVP

## Overview

Transform The Bean Route from admin-managed marketplace to vendor self-service platform. Vendors authenticate with OAuth (Google/Facebook), access a dashboard showing their inquiry inbox and quote history, view analytics on their performance, manage customer reviews, and edit their public profiles. This roadmap delivers the complete vendor experience across 5 phases, starting from authentication foundation through profile self-management.

## Phases

**Phase Numbering:**
- Integer phases (6-10): v1.0 Vendor Platform MVP work
- Decimal phases (e.g., 6.1, 6.2): Urgent insertions (marked with INSERTED)

Phases 1-5 completed in content marketing milestone.

- [ ] **Phase 6: OAuth Foundation** - Vendor authentication with Google/Facebook OAuth and session management
- [ ] **Phase 7: Dashboard & Inquiry Management** - Vendor dashboard with inquiry inbox and quote tracking
- [ ] **Phase 8: Analytics Integration** - Real-time performance metrics and conversion tracking
- [ ] **Phase 9: Review System** - Event organizer reviews with public display and vendor visibility
- [ ] **Phase 10: Profile Management** - Self-service profile editing with live preview

## Phase Details

### Phase 6: OAuth Foundation
**Goal**: Vendors can sign up and log in securely with OAuth, establishing authenticated sessions for dashboard access
**Depends on**: Nothing (first phase in vendor platform milestone)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. Vendor can sign up using their Google account and is immediately logged in
  2. Vendor can sign up using their Facebook account and is immediately logged in
  3. Vendor session persists across browser refresh without re-login
  4. Vendor can log out from any page and session is cleared
  5. System prevents unverified email addresses from creating accounts
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 7: Dashboard & Inquiry Management
**Goal**: Vendors access their personalized dashboard showing all inquiries received and quotes submitted, with status tracking
**Depends on**: Phase 6 (requires OAuth authentication)
**Requirements**: DASH-01, DASH-02, DASH-03, INQ-01, INQ-02, INQ-03, INQ-04, INQ-05, QUOT-01, QUOT-02, QUOT-03
**Success Criteria** (what must be TRUE):
  1. Vendor sees dashboard landing page immediately after login with their business name
  2. Vendor can navigate to inquiry inbox, quote history, analytics, and profile from dashboard navigation
  3. Vendor sees complete list of all booking inquiries received for their business
  4. Vendor can view full details of any inquiry (event date, location, guest count, organizer contact)
  5. Vendor can mark inquiries as "contacted" or "converted" to track follow-up status
  6. Vendor sees list of all quotes they submitted to job postings with current status
  7. Vendor can only see their own inquiries and quotes, not other vendors' data (RLS enforced)
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 8: Analytics Integration
**Goal**: Vendors see real-time performance metrics showing inquiry volume, quote submissions, and review ratings
**Depends on**: Phase 7 (requires inquiry and quote data in dashboard)
**Requirements**: ANLZ-01, ANLZ-02, ANLZ-03, ANLZ-04
**Success Criteria** (what must be TRUE):
  1. Vendor sees total count of inquiries received displayed on analytics dashboard
  2. Vendor sees total count of quotes submitted displayed on analytics dashboard
  3. Vendor sees their average star rating calculated from all reviews
  4. Analytics numbers update immediately when new inquiry, quote, or review arrives
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 9: Review System
**Goal**: Event organizers can submit reviews for vendors, reviews display publicly on vendor profiles, and vendors can view their reviews
**Depends on**: Phase 6 (independent of dashboard features, can run in parallel with Phases 7-8)
**Requirements**: REV-01, REV-02, REV-03, REV-04, REV-05
**Success Criteria** (what must be TRUE):
  1. Event organizer can submit a text review with 5-star rating for a vendor they worked with
  2. Reviews appear on the vendor's public profile page visible to all site visitors
  3. Vendor profile displays average rating calculated from all reviews received
  4. System validates that organizers can only review vendors they actually booked
  5. Anyone can read vendor reviews without logging in
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 10: Profile Management
**Goal**: Vendors can edit their public profile information and see changes reflected immediately on their profile page
**Depends on**: Phase 7 (requires dashboard infrastructure)
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05, PROF-06
**Success Criteria** (what must be TRUE):
  1. Vendor can edit their business name, specialty, and description text
  2. Vendor can edit pricing (hourly rate range for carts/shops, single rate for baristas)
  3. Vendor can edit capacity (minimum and maximum guest counts for carts/shops)
  4. Vendor can edit availability (suburbs served, operating hours for coffee shops)
  5. Profile changes save and appear immediately on the public vendor profile page
  6. Vendor can only edit their own profile, not other vendors' profiles (RLS enforced)
**Plans**: TBD

Plans:
- [ ] TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 6 → 7 → 8 → 9 → 10

Note: Phase 9 (Review System) can begin in parallel with Phases 7-8 since it's independent of dashboard infrastructure.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. OAuth Foundation | 0/TBD | Not started | - |
| 7. Dashboard & Inquiry Management | 0/TBD | Not started | - |
| 8. Analytics Integration | 0/TBD | Not started | - |
| 9. Review System | 0/TBD | Not started | - |
| 10. Profile Management | 0/TBD | Not started | - |
