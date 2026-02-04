# Coffee Cart Marketplace — System Audit & Backlog

**Date:** 2026-02-04 (Updated: E2 Complete)
**Status:** Phase 3 (Real Vendor Data) ✅ COMPLETE

---

## Executive Summary

System has completed Phase 0 (Cleanup), Phase 1 (E3 - Protect Admin), Phase 2 (E1 - Email Notifications), and Phase 3 (E2 - Real Vendor Data). The marketplace is now fully functional with database-driven vendors, complete email notifications, and admin authentication. Admin verification codes now send via email with whitelist support. Next: Phase 4 (E5 - Quote Acceptance) to enable job owners to accept quotes and complete the booking funnel.

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

### Phase 2: E1 — Email Notifications ✅ COMPLETE (6/6 complete)
- [x] E1-0: Brevo setup + sendEmail utility (merged: d9fa2a1)
- [x] E1-1: Vendor inquiry notification (merged: a6387cb)
- [x] E1-2: Planner inquiry confirmation (merged: a6387cb - dual email handler)
- [x] E1-3: Owner quote notification (merged: d56c684)
- [x] E1-4: Vendor quote confirmation (merged: d56c684 - dual email handler)
- [x] E1-5: Applicant decision notification (merged: 5d82ccc)

### Phase 3: E2 — Real Data ✅ COMPLETE (4/4 complete)
- [x] E2-1: Browse from Supabase (merged: cc5ce72)
- [x] E2-2: Approve creates vendor (merged: 8dffa4c)
- [x] E2-3: Vendor detail from DB (merged: 16ce6b7)
- [x] E2-4: Remove vendors.ts (merged: 9839d09)

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

**Story E1.5 — Applicant Decision Notification** ✅ DONE (Commit: 5d82ccc)
```
As a vendor who applied to list on the marketplace
I want to receive an email when my application is approved or rejected
So I know the status and what to do next

Acceptance Criteria:
- [x] Email sent when admin changes application status
- [x] Different templates for approved vs rejected
- [x] Approved: congratulations + next steps (profile will appear in Browse)
- [x] Rejected: polite message + option to apply again later
- [x] Sent to application.contact_email

Technical Notes:
- Called from: /api/admin/applications/[id] PATCH route
- Only sends for approved/rejected status (not pending)
- Approval template: green success styling, listing details, timeline
- Rejection template: neutral styling, common reasons, reapply invitation
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

**Story E2.1 — Browse from Database** ✅ DONE (Commit: cc5ce72)
```
As an event planner
I want to see real vendors who have been approved by the admin
So I can book actual available coffee carts

Acceptance Criteria:
- [x] /app page fetches vendors from Supabase instead of hardcoded array
- [x] Only shows vendors with status = 'active' (not pending/rejected applications)
- [x] Same filter UI (suburbs, capacity, price) works with DB data
- [x] Same card rendering (business name, specialty, price range)
- [x] Loading state while fetching

Technical Notes:
- Homepage now fetches from Supabase vendors table
- Filter logic stays client-side (small dataset)
- Uses Vendor type from supabase.ts (matches DB schema)
```

**Story E2.2 — Approve Creates Vendor** ✅ DONE (Commit: 8dffa4c)
```
As an admin
I want vendor applications to automatically create vendor listings when approved
So I don't have to manually duplicate data

Acceptance Criteria:
- [x] When admin clicks "Approve" on an application
- [x] System creates a new row in vendors table
- [x] Maps application fields → vendor fields
- [x] Generates vendor.id and vendor.slug
- [x] Sets vendor.status = 'active'
- [x] Application status updates to 'approved'

Technical Notes:
- /api/admin/applications/[id] PATCH route updated
- On approval, inserts into vendors table with mapped fields
- Slug generation: businessName.toLowerCase().replace(/\s+/g, '-')
- Atomic operation ensures both updates succeed or rollback
```

**Story E2.3 — Vendor Detail from Database** ✅ DONE (Commit: 16ce6b7)
```
As an event planner
I want to view vendor detail pages for real vendors
So I can learn about them before inquiring

Acceptance Criteria:
- [x] /vendors/[slug] page fetches from Supabase instead of hardcoded data
- [x] Shows all vendor details (description, suburbs, pricing, capacity)
- [x] Inquiry modal works with DB vendor
- [x] 404 page if slug not found
- [x] Works for both old hardcoded slugs (backward compat) and new DB vendors

Technical Notes:
- VendorPageClient.tsx now fetches by slug from Supabase
- SELECT * FROM vendors WHERE slug = $1 AND status = 'active'
- InquiryModal integration preserved
- Loading and not-found states implemented
```

**Story E2.4 — Remove Hardcoded Vendors** ✅ DONE (Commit: 9839d09)
```
As a developer
I want to remove vendors.ts and migrate to DB-only
So we have a single source of truth

Acceptance Criteria:
- [x] vendors.ts file deleted
- [x] All imports updated (HorizontalExperiences, browse, vendor detail)
- [x] Build passes with zero references to vendors.ts
- [x] Type definitions moved to supabase.ts (Vendor type)
- [x] Hardcoded vendors seeded into DB for testing

Technical Notes:
- src/lib/vendors.ts completely removed
- All imports updated to use Supabase types
- Vendor type now in supabase.ts as single source of truth
- Build verified with no references to old vendors.ts
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

### Phase 4: Quote Acceptance Workflow (E5)
**Status:** Ready to start
**Business Value:** Completes the booking funnel, enables marketplace transactions

The marketplace now has:
✅ Admin authentication with email verification codes sent via Brevo
✅ Complete email notifications (all 6 E1 stories)
✅ Database-driven vendors (browse, detail, approval flow)
✅ Job board with quote submission
✅ Email whitelist for admin access

**Next:** Allow job owners to accept vendor quotes and complete bookings.

#### Implementation Plan

**Story E5.1 — Quote Status Column** (~5 min)
- Add `status` column to quotes table (pending/accepted/rejected)
- Update TypeScript types in supabase.ts

**Story E5.2 — Accept Quote UI** (~20 min)
- Add "Accept" button to JobDetailClient for each pending quote
- Create API route: PATCH /api/jobs/quotes/[id]/accept
- Atomic updates: quote.status + job.status + reject other quotes
- Optimistic UI updates with error handling

**Story E5.3 — Quote Acceptance Email** (~15 min)
- Email vendor when quote accepted
- Include full job details and owner contact info for coordination
- Branded template matching other notification emails

**Total Time:** ~40 minutes
**Outcome:** Complete booking funnel from inquiry → quote → acceptance

---

### Alternative: Admin & UX Enhancements

If not ready for E5, consider:

1. **Admin improvements**
   - Activity logging for all admin actions
   - Vendor application notes/preview before approval
   - Dashboard analytics (inquiry stats, quote rates)

2. **User experience**
   - Vendor search/filter improvements
   - Favorite vendors feature
   - Quote comparison UI for job owners

3. **Infrastructure**
   - Rate limiting for API routes
   - Comprehensive error logging
   - Integration tests for critical flows

---

## 6. Current Branch Status

```
Branch: main
Status: All E1 and E2 work merged and complete
Recent Commits:
  - aff9147: Send verification code via email
  - aeba9fc: Email whitelist for admin access
  - 9839d09: Remove hardcoded vendors.ts completely
  - 16ce6b7: Fetch vendor detail page from Supabase
  - 8dffa4c: Create vendor record when application approved
  - cc5ce72: Browse vendors from Supabase database
Working Directory: Clean
```

### Next Development Branch

```bash
# To start E5 (Quote Acceptance):
git checkout -b e5-1-quote-status-column
# Add status column to quotes table
# Update TypeScript types
# Test and commit

git checkout -b e5-2-accept-quote-ui
# Build accept quote functionality
# Test and commit

git checkout -b e5-3-acceptance-email
# Add acceptance email notification
# Test and commit
```

---

## 7. Known Issues & Technical Debt

| Issue | Impact | Priority | Resolution |
|---|---|---|---|
| ~~Hardcoded vendors with null emails~~ | ~~E1-1 notifications don't send~~ | ✅ RESOLVED | E2 complete - all vendors from DB |
| Browserslist outdated | Build warning | Low | Run `npx update-browserslist-db@latest` |
| Storybook lint warning | Build noise | Low | Add rule override or fix export name |
| No quote acceptance | Job owners can't close deals | **High** | **Start E5 next** |
| No integration tests | Manual testing required | Medium | Add after E5 completes |
| npm audit vulnerabilities | Security warnings | Low | Run `npm audit fix` when safe |
| Admin whitelist in code | Hard to update allowed emails | Medium | Consider env var or DB table |

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
