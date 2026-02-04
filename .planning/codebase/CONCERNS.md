# Codebase Concerns

**Analysis Date:** 2026-02-04

## Tech Debt

**Dual Type System (Vendor Types):**
- Issue: Legacy camelCase `LegacyVendor` type coexists with database `Vendor` snake_case type. Components use `LegacyVendor` while database uses `Vendor`.
- Files: `src/lib/supabase.ts` (lines 35-58), `src/components/booking/SimpleBookingModal.tsx` (line 5)
- Impact: Maintenance burden, confusion about which type to use, type safety complexity
- Fix approach: Migrate all components to use database `Vendor` type with snake_case fields, update imports in all feature components

**In-Memory Verification Code Storage:**
- Issue: Admin verification codes stored in global `Map<string>` which resets on server restart. Single-instance vulnerability in production.
- Files: `src/app/api/admin/send-code/route.ts` (lines 8-16), `src/app/api/admin/verify-code/route.ts` (lines 8-14)
- Impact: Production deployment instability, codes lost on redeployment, broken auth flow if server restarts during verification window
- Fix approach: Migrate to Redis or Supabase table for persistent verification code storage with TTL

**Missing Session Validation on Admin Routes:**
- Issue: Session expiration checked only in `getCurrentAdmin()` but not consistently across all admin API routes. Cookie could be modified client-side before expiration.
- Files: `src/lib/admin.ts` (lines 24-26), `src/app/api/admin/*` routes
- Impact: Stale sessions could theoretically persist if cookie isn't invalidated properly on logout
- Fix approach: Add explicit session invalidation endpoint, set secure cookie flags consistently, implement server-side session store

**Hardcoded Email from Address:**
- Issue: Sender email `noreply@coffeecartsmelbourne.com` hardcoded. If Brevo whitelist changes or domain differs, emails will fail silently.
- Files: `src/lib/email.ts` (line 34)
- Impact: Email sending breaks without clear error messaging to admin
- Fix approach: Move to environment variable `BREVO_SENDER_EMAIL` with fallback

**No Rate Limiting on Public APIs:**
- Issue: Public endpoints like `/api/notify/inquiry/route.ts` and `/api/jobs/quotes/route.ts` have no rate limiting. Vulnerable to spam.
- Files: `src/app/api/notify/inquiry/route.ts`, `src/app/api/notify/quote/route.ts`
- Impact: Can be used to spam vendors and event organizers with notification emails
- Fix approach: Implement rate limiting middleware on public API routes using IP + endpoint combination

## Security Considerations

**World-Writable Database Tables (MVP):**
- Risk: `vendor_applications`, `jobs`, and `quotes` tables have `FOR ALL USING (TRUE) WITH CHECK (TRUE)` RLS policies. Any authenticated user can read/write all records.
- Files: `supabase-schema.sql` (lines 112, 115, 118), `src/app/api/admin/jobs/route.ts`, `src/app/api/admin/applications/route.ts`
- Current mitigation: API routes check admin auth via `getCurrentAdmin()` before mutations, but database itself is unrestricted
- Recommendations: Implement role-based RLS policies. Create `admin_role` that can only be assigned by service role. Restrict vendor_applications to owner. Use service role for admin operations only.

**Verification Code Logged to Console:**
- Risk: 6-digit admin verification codes logged to console in production. If logs are compromised, attacker gains admin access.
- Files: `src/app/api/admin/send-code/route.ts` (line 111) - `console.log` output includes actual code
- Current mitigation: Only in console (not persisted), short 10-minute window
- Recommendations: Remove console.log entirely in production. Implement structured logging with log level filters.

**Session Cookie Not Signed:**
- Risk: Session stored as plain `JSON.stringify()` in cookie. Attackers can forge arbitrary session objects.
- Files: `src/app/api/admin/verify-code/route.ts` (line 51) - `response.cookies.set('admin_session', JSON.stringify(session), ...)`
- Current mitigation: `httpOnly` and `secure` flags set, email validation before code generation
- Recommendations: Use JWT or signed session cookies (e.g., `iron-session`). Add CSRF token validation.

**Admin Whitelist Not Role-Based:**
- Risk: All admin_users have equal access. No role separation (super-admin vs vendor-manager vs support).
- Files: `supabase-schema.sql` (lines 121-132), `src/lib/admin.ts`
- Impact: Any admin can approve vendors, modify inquiries, accept quotes
- Fix approach: Add `role` column to `admin_users` table. Implement role checks in auth middleware.

**No Input Validation on Email Endpoints:**
- Risk: `/api/notify/inquiry/route.ts` accepts user-controlled `vendorEmail`, `planner.email` without validation. Could be used for header injection in email templates.
- Files: `src/app/api/notify/inquiry/route.ts` (lines 8, 71-74)
- Impact: Potential for email header injection, spam relaying
- Fix approach: Strict email format validation, sanitize HTML content before template interpolation

**No CSRF Protection on Admin Mutations:**
- Risk: Admin routes (PATCH/DELETE to `/api/admin/*`) have no CSRF token validation. State-changing operations via simple POST.
- Files: `src/app/api/admin/inquiries/[id]/route.ts`, `src/app/api/admin/applications/[id]/route.ts`, `src/app/api/admin/jobs/[id]/route.ts`
- Impact: Cross-site request forgery attacks possible if admin visits untrusted site while logged in
- Fix approach: Add CSRF token generation in auth flow, validate on all mutations

## Performance Bottlenecks

**Unoptimized Admin Tab Loads (No Pagination):**
- Problem: `src/app/admin/InquiriesTab.tsx` (235 lines), `src/app/admin/ApplicationsTab.tsx` (231 lines), `src/app/admin/JobsTab.tsx` (247 lines) likely load all records in one query without pagination.
- Files: `src/app/admin/InquiriesTab.tsx`, `src/app/admin/ApplicationsTab.tsx`, `src/app/admin/JobsTab.tsx`
- Cause: `/api/admin/inquiries`, `/api/admin/applications`, `/api/admin/jobs` endpoints use `.select('*')` without limits
- Improvement path: Implement cursor-based pagination with `limit(50)`, add `offset` parameter, implement infinite scroll or page controls in UI

**Large Storybook Files:**
- Problem: `src/stories/DeveloperGuide.stories.tsx` (675 lines), `src/components/ui/Card.stories.tsx` (493 lines), `src/components/ui/Badge.stories.tsx` (324 lines) are massive story files.
- Files: `src/stories/DeveloperGuide.stories.tsx`, `src/components/ui/Card.stories.tsx`, `src/components/ui/Button.stories.tsx`
- Cause: Multiple story variations combined in single file, repetitive example data
- Improvement path: Split into separate story files (one per variant), extract common story data to fixtures, use `play()` function for dynamic stories

**No Database Indexes Defined:**
- Problem: Database schema has no explicit indexes on frequently queried fields.
- Files: `supabase-schema.sql` - no `CREATE INDEX` statements
- Impact: Slow queries on large datasets (vendor lookups by slug, job queries by status/date)
- Improvement path: Add indexes on `vendors(slug)`, `jobs(status, created_at)`, `quotes(job_id, status)`, `inquiries(vendor_id, created_at)`

**Admin Client Not Memoized:**
- Problem: Supabase client imported/instantiated multiple times in components and API routes.
- Files: `src/lib/supabase.ts`, `src/lib/supabase-admin.ts`, `src/components/booking/SimpleBookingModal.tsx` (line 84 - dynamic import)
- Impact: Multiple client instances, connection pool pressure, potential memory leak
- Improvement path: Export singleton clients, ensure single instance throughout app

## Fragile Areas

**Vendor Slug Generation (Non-Reversible):**
- Files: `src/app/api/admin/applications/[id]/route.ts` (lines 42-46)
- Why fragile: Slug created by lowercasing and removing special chars. Two different business names could generate same slug (e.g., "The Bean" and "The-Bean"). No duplicate slug check before insertion.
- Safe modification: Add unique constraint check before vendor creation. If slug exists, append incrementing number. Test slug collision scenarios.
- Test coverage: No tests for slug collision, edge cases like names with only special characters

**Quote Acceptance Multi-Step Operation (No Transactions):**
- Files: `src/app/api/jobs/quotes/[id]/accept/route.ts` (lines 38-70)
- Why fragile: Three separate database operations (update quote, reject others, close job) with no transaction. If second operation fails, quote accepted but others not rejected.
- Safe modification: Wrap in Supabase transaction or implement idempotent operations with status checks
- Test coverage: No tests for partial failure scenarios

**Email Sending Failures Not Blocking:**
- Files: `src/app/api/jobs/quotes/[id]/accept/route.ts` (line 189), `src/app/api/admin/applications/[id]/route.ts` (line 85-86)
- Why fragile: Email errors logged but operation continues. Vendor never notified of acceptance/approval but system shows success.
- Safe modification: Return appropriate status code if critical emails fail. Queue emails for retry if Brevo unavailable.
- Test coverage: No tests for email API failures

**LegacyVendor to Vendor Type Conversion Missing:**
- Files: Multiple components using `LegacyVendor` but database returning `Vendor`. Manual mapping needed in multiple places.
- Why fragile: Easy to forget snake_case conversion. If new vendor fields added, old components will break silently.
- Safe modification: Create explicit converter function `convertVendorToLegacy()`, use consistently
- Test coverage: No type conversion tests

**Admin Session Token in Cookie Not Refreshed:**
- Files: `src/app/api/admin/verify-code/route.ts` (line 46 - fixed 24-hour expiry)
- Why fragile: Token expiry is absolute. User logged in for 24 hours must re-authenticate even with active use. No refresh token mechanism.
- Safe modification: Implement sliding window expiration (refresh on each request) or separate refresh token
- Test coverage: No session expiration tests

## Test Coverage Gaps

**No Tests for Admin Authentication Flow:**
- What's not tested: Entire auth gate flow, code generation, verification, session validation
- Files: `src/components/admin/AuthGate.tsx`, `src/app/api/admin/send-code/route.ts`, `src/app/api/admin/verify-code/route.ts`, `src/lib/admin.ts`
- Risk: Breaking changes to auth could go unnoticed, credentials could be compromised
- Priority: **High** - Authentication is security-critical

**No Tests for Vendor Application Approval Flow:**
- What's not tested: Admin approval, vendor record creation, slug generation, email sending
- Files: `src/app/api/admin/applications/[id]/route.ts`, `src/app/admin/ApplicationsTab.tsx`
- Risk: Vendors could fail to appear in marketplace, duplicate slugs, emails not sent
- Priority: **High** - Core business flow

**No Tests for Quote Acceptance:**
- What's not tested: Quote status update, job closure, other quotes rejection, vendor notification
- Files: `src/app/api/jobs/quotes/[id]/accept/route.ts`
- Risk: Quotes accepted but job stays open, vendor never notified, race conditions
- Priority: **High** - Transaction integrity

**No Tests for Form Validation:**
- What's not tested: Inquiry modal validation, job creation form, application form
- Files: `src/components/booking/SimpleBookingModal.tsx`, `src/app/jobs/create/page.tsx`, `src/app/vendors/register/page.tsx`
- Risk: Invalid data submitted to database, poor user feedback
- Priority: **Medium** - Data quality

**No Tests for Email Sending:**
- What's not tested: Email template rendering, Brevo API integration, fallback logging
- Files: `src/lib/email.ts`, email template generation in route handlers
- Risk: Broken email templates not caught until production, attachments/links broken
- Priority: **Medium** - User experience

**No API Integration Tests:**
- What's not tested: End-to-end flows across multiple API endpoints, database state changes
- Files: All `src/app/api/*` routes
- Risk: Integration bugs between endpoints, state inconsistencies
- Priority: **Medium** - System stability

## Missing Critical Features

**No Vendor Logout/Session Termination:**
- Problem: Admin can login but no logout button. Session persists for 24 hours even if user wants to exit.
- Blocks: Admin users cannot securely end sessions, shared computer vulnerability
- Priority: **High** - Basic security necessity

**No Admin Activity Audit Log:**
- Problem: No tracking of who approved vendors, accepted quotes, modified inquiries.
- Blocks: Cannot investigate disputes, no accountability for admin actions
- Priority: **Medium** - Compliance and fraud detection

**No Dispute/Rejection Communication System:**
- Problem: When vendor application rejected, rejection reason not captured or communicated to vendor.
- Blocks: Vendors don't know why they were rejected, can't improve application
- Priority: **Medium** - User experience

**No Image/File Upload for Vendors:**
- Problem: Vendor registration and listing have no way to upload coffee cart photos.
- Blocks: Vendors cannot differentiate themselves visually, event planners can't see cart
- Priority: **Medium** - Feature completeness

**No Payment Processing:**
- Problem: No integration with Stripe/Square. Marketplace cannot take commission or facilitate payments.
- Blocks: Cannot monetize platform, vendors/planners handle payments offline
- Priority: **Low** - MVP scope (intended)

## Dependencies at Risk

**Brevo API Hard to Debug:**
- Risk: Email sending errors swallowed. Failures logged but not surfaced to admin. Silent failures compound until admin notices no inquiries coming through.
- Impact: Vendors miss inquiries, planners don't get confirmations
- Migration plan: Switch to SendGrid (better error handling) or implement webhook for delivery tracking

**Supabase RLS Policies Too Permissive:**
- Risk: Current MVP policies allow any authenticated user to modify all records. If Supabase auth ever changed, platform would be vulnerable.
- Impact: Data integrity, vendor-vendor visibility, quote manipulation
- Migration plan: Implement strict RLS policies now before user scale. Use service role only for admin routes.

**Next.js Global Variable for Admin Codes:**
- Risk: Using `global` object for state in serverless environment. Multiple concurrent requests could interfere with each other.
- Impact: Code verification could fail unexpectedly in production
- Migration plan: Use Supabase verification_codes table or Redis instead

## Scaling Limits

**Single Admin Whitelist:**
- Current capacity: 1-50 admins practically (hardcoded list in DB)
- Limit: Admin user management not automated. No self-service signup.
- Scaling path: Build admin management dashboard. Implement role-based access. Support multi-level admin hierarchy.

**No Background Job Queue:**
- Current capacity: Email sending blocks request response. High volume would timeout requests.
- Limit: ~100 simultaneous requests before Brevo rate limiting or timeout
- Scaling path: Implement Bull/BullMQ for email queue, separate worker process for async operations

**Hardcoded Vendor Seed Data:**
- Current capacity: 10 hardcoded vendors max for initial marketplace
- Limit: After admin approves real vendors, where do they display? (Likely database after migration)
- Scaling path: Complete migration to full database vendor management, implement caching layer for vendor directory

**No Caching Layer:**
- Current capacity: Every vendor page load queries Supabase. Every admin tab load queries full table.
- Limit: Supabase realtime subscriptions will increase cost at scale
- Scaling path: Implement Redis caching for vendor directory, implement SWR for admin lists with periodic refresh

---

*Concerns audit: 2026-02-04*
