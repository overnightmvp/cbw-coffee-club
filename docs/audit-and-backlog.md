# Coffee Cart Marketplace — System Audit & Backlog

**Date:** 2026-02-03 (Updated during E1 implementation)
**Status:** Phase 2 (Email Notifications) — E1-5 in progress

---

## Executive Summary

System has completed Phase 0 (Cleanup) and Phase 1 (E3 - Protect Admin). Currently completing Phase 2 (E1 - Email Notifications) with E1-0 through E1-4 merged to main. E1-5 (applicant decision emails) in progress. This audit tracks infrastructure readiness and remaining work using agile user stories.

---

## 1. Infrastructure Status

### ✅ Completed

| Component | Status | Verification |
|---|---|---|
| Next.js 14.2.5 | ✅ Configured | App Router, TypeScript, Tailwind |
| Supabase Client | ✅ Configured | `src/lib/supabase.ts` — anon key client |
| Supabase Admin | ✅ Configured | `src/lib/supabase-admin.ts` — service role |
| Admin Auth | ✅ Complete | Email + code verification, HTTP-only cookies |
| Email Library | ✅ Installed | `@getbrevo/brevo` package added |
| Email Utility | ✅ Created | `src/lib/email.ts` with sendEmail() |

###⚠️ Requires Configuration

| Component | Required | Location | How to Configure |
|---|---|---|---|
| SUPABASE_SERVICE_ROLE_KEY | Server-side admin operations | `.env.local` | Supabase Dashboard → Settings → API → service_role (secret!) |
| BREVO_API_KEY | Email sending | `.env.local` | https://app.brevo.com/settings/keys/api |
| Database Tables | Inquiries, vendors, jobs, quotes, applications | Supabase SQL editor | Run `docs/supabase-schema.sql` (create if missing) |

### 🔍 Status Check Commands

```bash
# Check if Supabase client works (from browser console on /app page)
localStorage  # Should see no Supabase errors in console

# Check if admin auth works
# 1. Go to /admin
# 2. Enter your email
# 3. Check server logs for 6-digit code
# 4. Enter code → should reach admin dashboard

# Check if email utility loads (won't send without API key)
# Server logs during build should show:
# "BREVO_API_KEY not configured. Email sending will be skipped."
```

---

## 2. Current Feature Completeness

### Phase 0: Cleanup ✅ COMPLETE
- [x] Dead code deletion (1,100 lines removed)
- [x] Build script separation (storybook unbundled)
- [x] Stale branch cleanup (6 branches deleted)
- [x] Admin page split (753 → 65 lines, 3 tabs extracted)

### Phase 1: E3 — Protect Admin ✅ COMPLETE
- [x] E3-1: Admin auth gate UI (email + code verification)
- [x] E3-2: HTTP-only cookie sessions
- [x] E3-3: Service role API routes (inquiries, applications, jobs)

### Phase 2: E1 — Email Notifications 🔄 IN PROGRESS (5/6 complete)
- [x] E1-0: Brevo setup + sendEmail utility (merged: d9fa2a1)
- [x] E1-1: Vendor inquiry notification (merged: a6387cb)
- [x] E1-2: Planner inquiry confirmation (merged: a6387cb - dual email handler)
- [x] E1-3: Owner quote notification (merged: d56c684)
- [x] E1-4: Vendor quote confirmation (merged: d56c684 - dual email handler)
- [🔄] E1-5: Applicant decision notification (in progress)

### Phase 3: E2 — Real Data ⏳ PENDING
- [ ] E2-1: Browse from Supabase (replace hardcoded vendors)
- [ ] E2-2: Approve creates vendor (admin → vendors table)
- [ ] E2-3: Vendor detail from DB
- [ ] E2-4: Remove vendors.ts

### Phase 4: E5 — Quote Acceptance ⏳ PENDING
- [ ] E5-1: Add status column to quotes
- [ ] E5-2: Accept quote UI
- [ ] E5-3: Acceptance email

---

## 3. Agile Epic Breakdown

### Epic 1: Email Notification System
**Goal:** Send transactional emails for all user interactions
**Business Value:** Keeps users informed, increases conversion, professional experience
**Dependencies:** BREVO_API_KEY configured

#### User Stories

**Story E1.0 — Email Infrastructure** ✅ DONE (Commit: d9fa2a1)
```
As the system
I need a reliable email sending utility
So that transactional emails can be delivered to users

Acceptance Criteria:
- [x] @getbrevo/brevo package installed
- [x] src/lib/email.ts created with sendEmail() function
- [x] BREVO_API_KEY environment variable documented
- [x] Graceful fallback: logs to console if API key missing
- [x] Function returns boolean success status
```

**Story E1.1 — Vendor Inquiry Notification** ✅ DONE (Commit: a6387cb)
```
As a coffee cart vendor
I want to receive an email when someone inquires about my services
So I can respond quickly and book the event

Acceptance Criteria:
- Email sent immediately after inquiry submission
- Includes planner contact details (name, email, phone)
- Shows event details (type, date, duration, guests, location)
- Displays estimated cost based on vendor's average rate
- Only sends if vendor.contactEmail exists (graceful handling)

Technical Notes:
- API route: /api/notify/inquiry
- Called from: SimpleBookingModal after Supabase insert
- Template: HTML email with brand colors (#F5C842 yellow, #3B2A1A brown)
```

**Story E1.2 — Planner Inquiry Confirmation** ✅ DONE (Commit: a6387cb)
```
As an event planner
I want to receive a confirmation email after I submit an inquiry
So I know my request was received and what to expect next

Acceptance Criteria:
- [x] Email sent immediately after inquiry submission
- [x] Confirms vendor name and event details
- [x] Shows estimated cost
- [x] Explains next steps (vendor will contact within 24hrs)
- [x] Branded template matching vendor notification

Technical Notes:
- API route: /api/notify/inquiry (dual email handler)
- Called from: SimpleBookingModal after Supabase insert
- Sends to both vendor AND planner in one request
```

**Story E1.3 — Owner Quote Notification** ✅ DONE (Commit: d56c684)
```
As a job owner who posted an event
I want to receive an email when a vendor submits a quote
So I can review and accept the best option

Acceptance Criteria:
- [x] Email sent after quote insert
- [x] Shows vendor name and proposed pricing
- [x] Includes vendor message (if provided)
- [x] Shows total estimate calculation
- [x] Sent to job.contact_email

Technical Notes:
- API route: /api/notify/quote (created)
- Called from: QuoteModal after Supabase insert
- QuoteModal updated to accept job prop for email data
```

**Story E1.4 — Vendor Quote Confirmation** ✅ DONE (Commit: d56c684)
```
As a vendor who submitted a quote
I want to receive a confirmation email
So I know my quote was successfully submitted

Acceptance Criteria:
- [x] Email sent after quote submission
- [x] Confirms job title and quoted price
- [x] Shows event details and owner contact
- [x] Explains next steps (owner will review and contact)
- [x] Sent to quote.contact_email

Technical Notes:
- API route: /api/notify/quote (dual email handler)
- Sends to both owner AND vendor in one request
```

**Story E1.5 — Applicant Decision Notification** 🔄 IN PROGRESS
```
As a vendor who applied to list on the marketplace
I want to receive an email when my application is approved or rejected
So I know the status and what to do next

Acceptance Criteria:
- Email sent when admin changes application status
- Different templates for approved vs rejected
- Approved: congratulations + next steps (profile will appear in Browse)
- Rejected: polite message + option to apply again later
- Sent to application.contact_email

Technical Notes:
- Called from: /api/admin/applications/[id] PATCH route
- After successful status update
- Check if status changed to 'approved' or 'rejected'
- Template variation based on final status
```

---

### Epic 2: Real Vendor Data
**Goal:** Replace hardcoded vendors with database-driven marketplace
**Business Value:** Scalable vendor management, admin can approve new vendors
**Dependencies:** Supabase configured, vendors table exists

#### User Stories

**Story E2.1 — Browse from Database**
```
As an event planner
I want to see real vendors who have been approved by the admin
So I can book actual available coffee carts

Acceptance Criteria:
- /app page fetches vendors from Supabase instead of hardcoded array
- Only shows vendors with status = 'active' (not pending/rejected applications)
- Same filter UI (suburbs, capacity, price) works with DB data
- Same card rendering (business name, specialty, price range)
- Loading state while fetching

Technical Notes:
- Replace getAllVendors() in /app/page.tsx with useEffect + Supabase fetch
- Filter logic stays client-side (small dataset)
- Use existing Vendor type from vendors.ts (matches DB schema)
- Consider: do we need pagination? (probably not for MVP)
```

**Story E2.2 — Approve Creates Vendor**
```
As an admin
I want vendor applications to automatically create vendor listings when approved
So I don't have to manually duplicate data

Acceptance Criteria:
- When admin clicks "Approve" on an application
- System creates a new row in vendors table
- Maps application fields → vendor fields
- Generates vendor.id and vendor.slug
- Sets vendor.status = 'active'
- Application status updates to 'approved'

Technical Notes:
- Update /api/admin/applications/[id] PATCH route
- After updating application status to 'approved'
- Insert into vendors table with mapped fields:
  - id: generated (same format as application id)
  - slug: businessName.toLowerCase().replace(/\s+/g, '-')
  - All other fields map 1:1
- Atomic operation: both updates must succeed or rollback
```

**Story E2.3 — Vendor Detail from Database**
```
As an event planner
I want to view vendor detail pages for real vendors
So I can learn about them before inquiring

Acceptance Criteria:
- /vendors/[slug] page fetches from Supabase instead of hardcoded data
- Shows all vendor details (description, suburbs, pricing, capacity)
- Inquiry modal works with DB vendor
- 404 page if slug not found
- Works for both old hardcoded slugs (backward compat) and new DB vendors

Technical Notes:
- Update VendorPageClient.tsx to fetch by slug
- SELECT * FROM vendors WHERE slug = $1 AND status = 'active'
- Keep existing UI and InquiryModal integration
- Handle loading and not-found states
```

**Story E2.4 — Remove Hardcoded Vendors**
```
As a developer
I want to remove vendors.ts and migrate to DB-only
So we have a single source of truth

Acceptance Criteria:
- vendors.ts file deleted
- All imports updated (HorizontalExperiences, browse, vendor detail)
- Build passes with zero references to vendors.ts
- Type definitions moved to supabase.ts (Vendor type)
- Hardcoded vendors optionally seeded into DB for testing

Technical Notes:
- Grep for all vendors.ts imports
- Update import paths to use Supabase types
- Optional: create seed script to insert 6 hardcoded vendors into DB
- Verify build before deleting file
```

---

### Epic 3: Quote Workflow Completion
**Goal:** Allow job owners to accept quotes and complete the hiring loop
**Business Value:** Closes conversion funnel, enables marketplace transactions
**Dependencies:** Jobs + quotes features from docs/skills.md

#### User Stories

**Story E5.1 — Quote Status Column**
```
As a developer
I want quotes to have a status field
So we can track which quotes have been accepted

Acceptance Criteria:
- Add `status TEXT DEFAULT 'pending'` to quotes table schema
- Update Quote type in supabase.ts
- Status values: 'pending' | 'accepted' | 'rejected'
- Existing quotes remain 'pending' after migration

Technical Notes:
- SQL: ALTER TABLE quotes ADD COLUMN status TEXT DEFAULT 'pending'
- Update TypeScript type definition
- No UI changes in this story (just data model)
```

**Story E5.2 — Accept Quote UI**
```
As a job owner
I want to accept a vendor's quote
So I can confirm the booking

Acceptance Criteria:
- "Accept" button appears on each quote in JobDetailClient
- Button only shows for 'pending' quotes
- On click: updates quote.status to 'accepted'
- Also updates job.status to 'closed' (one quote per job)
- Success message: "Quote accepted! [Vendor] will be in touch."
- Other quotes automatically change to 'rejected'

Technical Notes:
- Add PATCH /api/jobs/quotes/[id]/accept route
- Atomic updates: quote status + job status + other quotes
- Optimistic UI update before API call
- Error handling if update fails
```

**Story E5.3 — Quote Acceptance Email**
```
As a vendor whose quote was accepted
I want to receive an email confirmation
So I know I've booked the job

Acceptance Criteria:
- Email sent when quote status changes to 'accepted'
- Includes full job details (title, date, location, guests, duration)
- Shows accepted price
- Includes job owner contact info for coordination
- Branded template matching other emails

Technical Notes:
- Add to /api/jobs/quotes/[id]/accept route
- After successful status update
- Fetch vendor email from quote.contact_email
- Include job owner details for direct coordination
- Template similar to inquiry notification but for confirmed booking
```

---

## 4. Pre-Launch Checklist

Before deploying or continuing development, verify:

### Environment Variables
- [ ] `.env.local` exists (copy from `.env.local.example`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (DO NOT commit!)
- [ ] `BREVO_API_KEY` set (get from Brevo dashboard)

### Database
- [ ] Supabase project created
- [ ] `inquiries` table exists with RLS disabled
- [ ] `vendor_applications` table exists with RLS world-open
- [ ] `jobs` table exists with RLS world-open
- [ ] `quotes` table exists with RLS world-open
- [ ] `vendors` table exists (or create when E2 starts)
- [ ] All tables have correct columns per schema

### Test Scenarios
- [ ] Can submit inquiry from /app → vendor page
- [ ] Admin can log in at /admin (see code in server logs)
- [ ] Admin tabs load (Inquiries, Applications, Jobs)
- [ ] Can change inquiry status in admin
- [ ] Email logs show in console (or actual emails if BREVO_API_KEY set)

### Deployment Readiness
- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] No ESLint errors (warnings OK)
- [ ] Git: all changes committed to main
- [ ] Vercel env vars configured (if deploying)

---

## 5. Recommended Next Steps

### Option A: Continue Email Notifications (E1)
**If:** Brevo is configured and you want to complete the notification system

1. Complete E1-2 (planner confirmation) — already coded, just merge
2. Build E1-3 & E1-4 (quote notifications) — ~15 min
3. Build E1-5 (applicant decision) — ~10 min
4. Test all email flows end-to-end

**Time:** ~30 minutes
**Outcome:** Complete notification system

### Option B: Real Vendor Data (E2)
**If:** Supabase is configured and you want dynamic marketplace

1. Ensure vendors table exists in Supabase
2. Build E2-1 (browse from DB) — ~15 min
3. Build E2-2 (approve creates vendor) — ~15 min
4. Build E2-3 & E2-4 (vendor detail + cleanup) — ~20 min
5. Optionally seed 6 hardcoded vendors into DB

**Time:** ~50 minutes
**Outcome:** Scalable vendor management

### Option C: Infrastructure Setup First
**If:** You're unsure if Supabase/Brevo are configured

1. Create Supabase project (if not exists)
2. Run schema SQL to create all tables
3. Get Supabase service role key → `.env.local`
4. Create Brevo account, get API key → `.env.local`
5. Test inquiry submission end-to-end
6. Verify emails send (or log correctly if no API key)

**Time:** ~20 minutes
**Outcome:** Verified working infrastructure

---

## 6. Current Branch Status

```
Branch: e1-2-planner-inquiry-confirm
Status: In progress, code written, build attempted
Issue: Build error (turbopack module not found - likely transient)
Recommendation: Clean build and retry, or stash and start fresh
```

### Recovery Steps

```bash
# Option 1: Clean rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Option 2: Stash current work
git stash
git checkout main
git branch -D e1-2-planner-inquiry-confirm

# Option 3: Force complete current work
git add -A
git commit -m "feat(email): Add planner inquiry confirmation email"
git checkout main
git merge e1-2-planner-inquiry-confirm
npm run build  # Verify clean build on main
```

---

## 7. Known Issues & Technical Debt

| Issue | Impact | Priority | Resolution |
|---|---|---|---|
| Hardcoded vendors with null emails | E1-1 notifications don't send | Low (MVP) | Fixed when E2 completes |
| Browserslist outdated | Build warning | Low | Run `npx update-browserslist-db@latest` |
| Storybook lint warning | Build noise | Low | Add rule override or fix export name |
| Turbopack error (transient) | Build occasionally fails | Medium | Clean rebuild usually fixes |
| No integration tests | Manual testing required | Low (pre-PMF) | Add after PMF |
| npm audit: 19 vulnerabilities | Security warnings | Low | Run `npm audit fix` when safe |

---

## 8. Success Metrics (Post-Launch)

Once system is live, track:

- **Inquiry conversion rate:** Inquiries submitted → vendor responses
- **Quote acceptance rate:** Quotes submitted → quotes accepted
- **Application approval rate:** Applications → approved vendors
- **Email deliverability:** Sent → delivered (Brevo dashboard)
- **Time to first vendor response:** Inquiry submitted → vendor replies

---

## Appendix: Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Production build
npm run lint                # Check for issues

# Git workflow
git checkout -b story-name  # New branch per story
npm run build              # Verify before commit
git add -A && git commit -m "feat: story description"
git push -u origin story-name
git checkout main && git merge story-name --no-edit
git push && git branch -d story-name

# Database (Supabase SQL editor)
# Paste supabase-schema.sql
# Run to create all tables

# Check logs
# Server console shows:
# - Email sending attempts
# - Admin verification codes
# - API route errors
```
