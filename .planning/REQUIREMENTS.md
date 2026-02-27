# Requirements: The Bean Route v1.0 Vendor Platform MVP

**Defined:** 2026-02-26
**Core Value:** Enable vendor success through self-service tools while driving organic discovery via high-intent coffee and event content.

## v1.0 Requirements

Requirements for vendor platform MVP. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: Vendor can sign up/login with Google OAuth
- [ ] **AUTH-02**: Vendor can sign up/login with Facebook OAuth
- [ ] **AUTH-03**: System verifies OAuth email is verified before creating account
- [ ] **AUTH-04**: Vendor session persists across browser refresh
- [ ] **AUTH-05**: Vendor can log out and session is cleared

### Vendor Dashboard

- [ ] **DASH-01**: Vendor sees dashboard landing page after login
- [ ] **DASH-02**: Dashboard displays navigation to all vendor features (inbox, quotes, analytics, profile)
- [ ] **DASH-03**: Dashboard is only accessible to authenticated vendors

### Inquiry Management

- [ ] **INQ-01**: Vendor sees list of all inquiries received (inquiry inbox)
- [ ] **INQ-02**: Vendor can view full inquiry details (event info, contact, date, guests)
- [ ] **INQ-03**: Vendor sees inquiry status (pending/contacted/converted)
- [ ] **INQ-04**: Vendor can mark inquiry as "contacted"
- [ ] **INQ-05**: Vendor only sees their own inquiries (RLS enforced)

### Quote Tracking

- [ ] **QUOT-01**: Vendor sees list of all quotes they submitted
- [ ] **QUOT-02**: Vendor sees quote status for each submission (pending/accepted/rejected)
- [ ] **QUOT-03**: Vendor only sees their own quotes (RLS enforced)

### Analytics

- [ ] **ANLZ-01**: Vendor sees total inquiries received
- [ ] **ANLZ-02**: Vendor sees total quotes submitted
- [ ] **ANLZ-03**: Vendor sees average rating from reviews
- [ ] **ANLZ-04**: Analytics update in real-time when new data arrives

### Review System

- [ ] **REV-01**: Event organizer can submit review for vendor (text + 5-star rating)
- [ ] **REV-02**: Reviews display on public vendor profile pages
- [ ] **REV-03**: Vendor profile shows average rating (calculated from all reviews)
- [ ] **REV-04**: Organizer can only review vendors they've booked (validation enforced)
- [ ] **REV-05**: Reviews are publicly readable, no authentication required

### Profile Management

- [ ] **PROF-01**: Vendor can edit business name, specialty, and description
- [ ] **PROF-02**: Vendor can edit pricing (hourly rate min/max or single rate for baristas)
- [ ] **PROF-03**: Vendor can edit capacity (min/max guests, not applicable to baristas)
- [ ] **PROF-04**: Vendor can edit availability (suburbs served, opening hours for coffee shops)
- [ ] **PROF-05**: Profile changes save immediately and reflect on public profile
- [ ] **PROF-06**: Vendor can only edit their own profile (RLS enforced)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Analytics

- **ANLZ-10**: Vendor sees conversion rate (quotes → bookings)
- **ANLZ-11**: Vendor sees trend charts for inquiries over time
- **ANLZ-12**: Vendor can filter analytics by date range (7/30/90 days)

### Onboarding

- **ONBD-01**: First-time vendor sees onboarding wizard
- **ONBD-02**: Dashboard shows profile completeness indicator

### Review Moderation

- **REV-10**: Admin can flag reviews as inappropriate
- **REV-11**: Flagged reviews enter moderation queue
- **REV-12**: Admin can delete reviews from moderation queue

### Image Uploads (Epic 2)

- **IMG-01**: Vendor can upload hero image during profile editing
- **IMG-02**: Vendor can upload multiple gallery images

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Payment processing (Stripe deposits) | Epic 4 - requires legal/accounting, defer until marketplace proven |
| Real-time messaging (vendor ↔ organizer chat) | High complexity, email/phone sufficient for v1.0 |
| Vendor ratings of organizers | One-way trust (organizer → vendor) simpler, avoids retaliation reviews |
| Advanced analytics exports (CSV/PDF) | Premature - wait for vendor demand signals |
| Mobile app | Web-first strategy, mobile web works on phones |
| Multi-location expansion | Melbourne-only MVP, expand after validation |
| Calendar integration (Google Calendar sync) | Nice-to-have, manual calendar management sufficient |
| Automated review requests | Manual organizer flow simpler, automate if adoption high |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | TBD | Pending |
| AUTH-02 | TBD | Pending |
| AUTH-03 | TBD | Pending |
| AUTH-04 | TBD | Pending |
| AUTH-05 | TBD | Pending |
| DASH-01 | TBD | Pending |
| DASH-02 | TBD | Pending |
| DASH-03 | TBD | Pending |
| INQ-01 | TBD | Pending |
| INQ-02 | TBD | Pending |
| INQ-03 | TBD | Pending |
| INQ-04 | TBD | Pending |
| INQ-05 | TBD | Pending |
| QUOT-01 | TBD | Pending |
| QUOT-02 | TBD | Pending |
| QUOT-03 | TBD | Pending |
| ANLZ-01 | TBD | Pending |
| ANLZ-02 | TBD | Pending |
| ANLZ-03 | TBD | Pending |
| ANLZ-04 | TBD | Pending |
| REV-01 | TBD | Pending |
| REV-02 | TBD | Pending |
| REV-03 | TBD | Pending |
| REV-04 | TBD | Pending |
| REV-05 | TBD | Pending |
| PROF-01 | TBD | Pending |
| PROF-02 | TBD | Pending |
| PROF-03 | TBD | Pending |
| PROF-04 | TBD | Pending |
| PROF-05 | TBD | Pending |
| PROF-06 | TBD | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 0 (pending roadmap creation)
- Unmapped: 31 ⚠️

---
*Requirements defined: 2026-02-26*
*Last updated: 2026-02-26 after v1.0 milestone initialization*
