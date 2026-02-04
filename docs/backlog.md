# The Bean Route — Product Backlog

**Last Updated:** 2026-02-04
**Status:** 🟢 Production-Ready Core Features Complete

---

## Current System Status

### ✅ What's Working (Production-Ready)

| Epic | Status | Completion |
|---|---|---|
| **E3 - Admin Authentication** | ✅ Complete | Email verification with 6-digit codes, HTTP-only cookies, whitelist protection |
| **E1 - Email Notifications** | ✅ Complete | 6 transactional emails (vendor inquiry, planner confirmation, quote notifications, application decisions) |
| **E2 - Real Vendor Data** | ✅ Complete | Database-driven vendor browse, detail pages, admin approval creates vendor records |
| **E5 - Quote Acceptance** | ✅ Complete | Job owners can accept quotes, vendors receive acceptance emails |

### System Validation Checklist

Test these critical paths before deploying changes:

| # | Flow | Path | Expected Outcome |
|---|---|---|---|
| 1 | Browse vendors | `/` → vendor carousel | Vendors load from Supabase, not hardcoded |
| 2 | Vendor detail | Click any vendor → `/vendors/[slug]` | Detail page loads from database |
| 3 | Submit inquiry | Vendor detail → "Get Quote" → submit | Row in `inquiries`, emails to vendor + planner |
| 4 | Register vendor | `/vendors/register` → 3 steps → submit | Row in `vendor_applications` (pending) |
| 5 | Admin login | `/admin` → enter email → code from email/logs | Session created, access granted (whitelist only) |
| 6 | Approve vendor | Admin → Applications → Approve | `vendors` table gets new row, applicant gets approval email |
| 7 | Post job | `/jobs/create` → 3 steps → submit | Row in `jobs`, job appears in `/jobs` |
| 8 | Submit quote | `/jobs/[id]` → "Submit Quote" → fill → submit | Row in `quotes`, owner + vendor get emails |
| 9 | Accept quote | Job owner → `/jobs/[id]` → "Accept" button | Quote status → accepted, job closed, vendor gets email |

---

## Next Phase: Production Hardening

### Phase 5: E6 — Production Readiness

**Goal:** Make the system bulletproof for real users

**Priority Stories:**

#### E6-1: Rate Limiting
```
As the system
I need to prevent API abuse
So that bad actors can't spam forms or DDoS routes

Acceptance Criteria:
- [ ] Rate limit on inquiry submission (5/hour per IP)
- [ ] Rate limit on quote submission (10/hour per IP)
- [ ] Rate limit on admin code requests (3/hour per email)
- [ ] Rate limit on vendor registration (2/day per IP)
- [ ] Use Vercel edge middleware for efficiency
- [ ] Return 429 with Retry-After header

Technical:
- Create middleware/rate-limit.ts
- Use Vercel KV or Upstash Redis
- Apply to all POST routes
```

#### E6-2: Error Logging & Monitoring
```
As a developer
I need to see production errors
So that I can fix bugs quickly

Acceptance Criteria:
- [ ] Integrate Sentry or similar
- [ ] Log all API errors with context
- [ ] Track failed email sends
- [ ] Monitor Supabase query failures
- [ ] Dashboard for error trends

Technical:
- Add @sentry/nextjs
- Wrap API routes with error boundary
- Track user flow for error reproduction
```

#### E6-3: Admin Audit Log
```
As an admin
I need to see who did what and when
So that I can track all actions

Acceptance Criteria:
- [ ] Create `admin_audit_log` table
- [ ] Log all admin actions (approve, reject, status changes)
- [ ] Include: admin email, action, entity_id, old/new values, timestamp
- [ ] Admin page shows recent actions
- [ ] Filterable by date and action type

Technical:
- Add audit logging to all admin API routes
- Create AuditLogTab.tsx component
- Index by admin_email and created_at
```

#### E6-4: Email Delivery Tracking
```
As an admin
I need to verify emails were delivered
So that I can debug delivery issues

Acceptance Criteria:
- [ ] Store sent emails in `email_log` table
- [ ] Track: recipient, subject, status, brevo_message_id, sent_at
- [ ] Admin can see email history per inquiry/quote/application
- [ ] Retry failed emails
- [ ] Show delivery status from Brevo webhooks

Technical:
- Create email_log table
- Update lib/email.ts to log all sends
- Add EmailLogTab.tsx to admin
```

#### E6-5: Data Validation Hardening
```
As the system
I need to validate all inputs server-side
So that malicious data can't corrupt the database

Acceptance Criteria:
- [ ] Zod schemas for all API routes
- [ ] Email format validation (server-side)
- [ ] Date validation (no past dates for jobs)
- [ ] Budget validation (min < max)
- [ ] Phone number format validation (AU)
- [ ] Sanitize HTML in messages/descriptions
- [ ] Max length checks on all text fields

Technical:
- Install zod
- Create shared schemas in lib/validation.ts
- Apply to all POST/PATCH routes
```

---

## Phase 6: Business Features

### E7 — Vendor Profiles

**Goal:** Let vendors manage their own listings

#### E7-1: Vendor Login
- Vendor authentication (separate from admin)
- Magic link or email + password
- Session management

#### E7-2: Vendor Dashboard
- View received inquiries
- See quote requests for their profile
- Update profile (hours, pricing, photos)
- Pause/unpause availability

#### E7-3: Calendar Integration
- Mark unavailable dates
- Auto-decline inquiries for booked dates
- Sync with external calendars (optional)

---

## Phase 7: Event Owner Features

### E8 — Quote Comparison

**Goal:** Help event owners make informed decisions

#### E8-1: Quote Comparison UI
- Side-by-side quote comparison
- Filter by price, rating, availability
- Save favorite vendors

#### E8-2: Direct Messaging
- In-app chat between owner and vendor
- Discuss details before accepting quote
- Message history

---

## Known Technical Debt

| Issue | Impact | Priority | Fix Timeline |
|---|---|---|---|
| Vendors table has no photo storage | Limits branding | Medium | E7 work |
| No vendor rating system | Hard to choose quality vendors | Medium | Post-E7 |
| Job board shows all jobs (no filtering by vendor capability) | Spam for vendors | Low | E7-2 |
| Quote acceptance doesn't notify rejected vendors | Poor UX | Low | E5 follow-up |
| Admin whitelist is hardcoded | Can't add admins without deploy | Medium | E6 |
| No mobile app | Web-only | Low | Future PWA |

---

## Environment Setup Checklist

Before starting any epic, verify:

### Required Environment Variables

**Local (`.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-only, never NEXT_PUBLIC_
BREVO_API_KEY=xkeysib-...              # Server-only
```

**Vercel (Settings → Environment Variables):**
- All above variables
- Check ALL environments (Production + Preview + Development)
- Never expose service keys with NEXT_PUBLIC_ prefix

### Database Schema

Verify all tables exist in Supabase:
```sql
-- Core tables
vendors (10+ columns, status field, slug unique)
inquiries (vendor_id FK, status field)
vendor_applications (status field)
jobs (status field)
quotes (job_id FK, status field with default 'pending')

-- Future tables
admin_audit_log (not yet created)
email_log (not yet created)
```

### Smoke Test Commands

```bash
# Type check
npm run build

# Lint
npm run lint

# Test admin access
open http://localhost:3000/admin
# Enter your whitelisted email
# Check console logs for 6-digit code

# Test vendor browse
open http://localhost:3000
# Should see vendors from Supabase, not hardcoded

# Test email sending
# Submit an inquiry
# Check Brevo dashboard or console logs
```

---

## Development Workflow

### Branch Strategy

```bash
# One branch per story
git checkout -b e6-1-rate-limiting

# Do work (max 1 hour per story)

# Build must pass
npm run build

# Push and open PR
git push origin e6-1-rate-limiting
```

### Commit Message Format

```
feat(area): short description

Longer explanation if needed.
- Bullet points for key changes
- Reference issue numbers if applicable

Closes #123

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Success Metrics (Post-Launch)

Track these in production:

1. **Conversion Rates**
   - Inquiries → Vendor responses (target: 80%+)
   - Job posts → Quotes received (target: 3+ quotes per job)
   - Quotes → Acceptances (target: 30%+)
   - Applications → Approvals (target: 60%+)

2. **Performance**
   - Page load time < 2s (target: < 1s)
   - API response time < 500ms
   - Email delivery < 30s

3. **User Satisfaction**
   - Event owners: Time to book vendor (target: < 48 hours)
   - Vendors: Response rate to inquiries (target: 90% within 24hrs)
   - Admin: Time to review application (target: < 1 day)

---

## Future Enhancements (Post-PMF)

These are nice-to-haves, do NOT build until core metrics hit targets:

- [ ] Vendor photo gallery (S3 uploads)
- [ ] Review/rating system
- [ ] Recurring bookings
- [ ] Multi-vendor bookings (book 2+ carts for large events)
- [ ] Vendor badges (verified, top-rated, etc.)
- [ ] Event owner saved vendors
- [ ] Mobile PWA
- [ ] SMS notifications
- [ ] Webhook integrations (Zapier, etc.)

---

## Questions? Start Here

1. **"What should I build next?"**
   → Start E6 (production hardening). Rate limiting first.

2. **"How do I test locally?"**
   → Run smoke tests above. Use real Supabase + Brevo credentials.

3. **"Deployment failing?"**
   → Check `docs/VERCEL-TROUBLESHOOTING.md`

4. **"Email not sending?"**
   → Verify `BREVO_API_KEY` in env vars. Check Brevo dashboard for quota.

5. **"Admin can't login?"**
   → Check email whitelist in `src/app/api/admin/send-code/route.ts`
