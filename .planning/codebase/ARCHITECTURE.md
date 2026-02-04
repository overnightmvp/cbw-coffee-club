# Architecture

**Analysis Date:** 2026-02-04

## Pattern Overview

**Overall:** Layered Next.js 14 App Router architecture with a clear separation between public-facing pages, authenticated admin operations, and API routes. Two-sided marketplace pattern with public vendor directory and private admin control panel.

**Key Characteristics:**
- Server-side rendering (SSR) for public pages with static metadata generation
- Client-side hydration for interactive features (inquiry modals, quote submission)
- API route handlers for server-side business logic and Supabase operations
- Admin authentication via cookie-based sessions (no external auth provider)
- Email notifications via Brevo transactional email service
- Role-based access control for admin operations

## Layers

**Presentation Layer (Pages & Components):**
- Purpose: Render UI and handle user interactions
- Location: `src/app/` (pages), `src/components/` (reusable components)
- Contains: Server components (pages with SSR), Client components (interactive UI)
- Depends on: Component library (`ui/`), API routes, Supabase client
- Used by: Browser/HTTP clients

**API Route Layer:**
- Purpose: Handle server-side logic, authentication, and external service calls
- Location: `src/app/api/`
- Contains: POST/GET handlers for inquiries, jobs, quotes, admin operations, email notifications
- Depends on: Supabase admin client (`supabaseAdmin`), Brevo email SDK, authentication utilities
- Used by: Client-side components via `fetch()` calls

**Business Logic Layer:**
- Purpose: Shared utilities for auth, email, admin operations
- Location: `src/lib/` (admin.ts, email.ts, supabase.ts, supabase-admin.ts)
- Contains: Authentication session management, email templates, Supabase client setup, type definitions
- Depends on: Supabase SDK, Brevo SDK, Next.js runtime APIs
- Used by: API routes, client components

**Data Access Layer:**
- Purpose: Communicate with Supabase PostgreSQL
- Location: Supabase client setup in `src/lib/supabase.ts` and admin client in `src/lib/supabase-admin.ts`
- Contains: Database types (Vendor, Inquiry, Job, Quote, VendorApplication), Supabase client initialization
- Depends on: Supabase SDK, environment configuration
- Used by: API routes and client components

**UI Component Library:**
- Purpose: Reusable, styled UI primitives
- Location: `src/components/ui/` and feature-specific component directories
- Contains: Button, Card, Input, Badge (base components), plus feature components (SimpleBookingModal, QuoteModal, Header)
- Depends on: Tailwind CSS, design tokens from `src/lib/design-tokens.ts`
- Used by: Pages and other components

## Data Flow

**Inquiry Submission Flow:**

1. Event organizer views vendor detail page (`/vendors/[slug]`)
2. Clicks "Inquire" button, opens `SimpleBookingModal` (client component)
3. User fills inquiry form, submits via `fetch()` POST to `/api/notify/inquiry`
4. API route validates data, sends two emails via Brevo:
   - Email to vendor with inquiry details and estimated cost
   - Confirmation email to organizer
5. Inquiry record written to Supabase `inquiries` table
6. Modal closes, success message displayed

**Job Posting & Quote Flow:**

1. Event organizer creates job at `/jobs/create`
2. Job posted to Supabase `jobs` table via API
3. Vendors browse jobs at `/jobs` and `/jobs/[id]`
4. Vendor submits quote via `QuoteModal` (client component)
5. Quote saved to Supabase `quotes` table
6. Event organizer accepts quote via `/api/jobs/quotes/[id]/accept`
7. Quote status updated to "accepted", vendor receives acceptance email

**Admin Management Flow:**

1. Admin navigates to `/admin` (protected by `AuthGate` component)
2. Authenticates with email + verification code via `/api/admin/send-code` and `/api/admin/verify-code`
3. Session stored in secure HTTP-only cookie (admin_session)
4. Admin portal loads three tabs: Inquiries, Applications, Jobs
5. Each tab fetches data via authenticated API routes:
   - `GET /api/admin/inquiries` - fetch all inquiries
   - `GET /api/admin/applications` - fetch vendor applications
   - `GET /api/admin/jobs` - fetch job postings
6. Admin performs actions (approve/reject apps, update statuses) via PATCH routes
7. Supabase admin client bypasses RLS policies using service role key

**State Management:**
- Local component state (useState) for form data, loading states, messages
- No global state management (Redux/Context) - data fetched on demand via API calls
- Server-side session state for admin authentication (cookies)
- Supabase client-side session state (no user auth, anon key only)

## Key Abstractions

**Vendor Entity:**
- Purpose: Represents a coffee cart business in the marketplace
- Examples: `src/lib/supabase.ts` (Vendor type), `src/app/vendors/[slug]/page.tsx` (vendor detail)
- Pattern: Read-only from public perspective (can view vendors); admin can manage approvals. Vendors stored in Supabase `vendors` table with hardcoded seed data fallback.

**Inquiry Entity:**
- Purpose: Booking request from event organizer to vendor
- Examples: `src/app/api/notify/inquiry/route.ts` (submission), `src/app/admin/InquiriesTab.tsx` (admin view)
- Pattern: Create via public form, manage via admin panel. Status: pending → contacted → converted

**Job Entity:**
- Purpose: Event requirement posted by organizer, vendors submit quotes
- Examples: `src/app/jobs/create/page.tsx` (creation), `src/app/jobs/[id]/JobDetailClient.tsx` (detail view)
- Pattern: Create via form, submit quotes, organizer accepts winning quote. Status: open/closed

**Quote Entity:**
- Purpose: Vendor response to job posting with pricing
- Examples: `src/app/api/jobs/quotes/route.ts` (submission), `src/app/jobs/[id]/JobDetailClient.tsx` (acceptance)
- Pattern: Submitted by vendors, accepted by event organizers. Status: pending → accepted/rejected

**AdminSession:**
- Purpose: Authenticated admin user with session cookie
- Examples: `src/lib/admin.ts` (session management), `src/components/admin/AuthGate.tsx` (access control)
- Pattern: Email + verification code → session cookie with 24-hour expiration. Checked on every admin API request.

## Entry Points

**Landing Page (`src/app/page.tsx`):**
- Location: `src/app/page.tsx`
- Triggers: GET `/` - root URL
- Responsibilities: Hero section, vendor carousel, "how it works" explainer, calls-to-action. Client component with interactive Header variant.

**Vendor Browser (`src/app/app/page.tsx`):**
- Location: `src/app/app/page.tsx`
- Triggers: GET `/app` - browse vendors directory
- Responsibilities: Display list/carousel of vendors with booking button. Links to individual vendor pages.

**Vendor Detail (`src/app/vendors/[slug]/page.tsx`):**
- Location: `src/app/vendors/[slug]/page.tsx`
- Triggers: GET `/vendors/{slug}` - individual vendor profile
- Responsibilities: Server-side SSR with dynamic metadata generation. Fetches vendor from Supabase using service role. Client component `VendorPageClient` handles inquiry modal interaction.

**Job Posting (`src/app/jobs/[id]/page.tsx`):**
- Location: `src/app/jobs/[id]/page.tsx`
- Triggers: GET `/jobs/{id}` - individual job detail with quotes
- Responsibilities: Server page wrapper for `JobDetailClient`. Client component fetches job and quotes, allows quote submission and acceptance.

**Admin Portal (`src/app/admin/page.tsx`):**
- Location: `src/app/admin/page.tsx`
- Triggers: GET `/admin` - admin dashboard
- Responsibilities: Tabbed interface for managing inquiries, vendor applications, jobs. Protected by `AuthGate` component (client-side redirect if not authenticated).

**API: Inquiry Notification (`src/app/api/notify/inquiry/route.ts`):**
- Location: `src/app/api/notify/inquiry/route.ts`
- Triggers: POST `/api/notify/inquiry` - called when organizer submits inquiry form
- Responsibilities: Validate inquiry data, calculate estimated cost, send two Brevo emails (vendor notification + organizer confirmation)

**API: Admin Authentication (`src/app/api/admin/send-code/route.ts`, `/verify-code/route.ts`):**
- Location: `src/app/api/admin/send-code/route.ts`, `src/app/api/admin/verify-code/route.ts`
- Triggers: POST requests from admin login flow
- Responsibilities: Send verification code via email, validate code, create session cookie

## Error Handling

**Strategy:** Graceful degradation with user-facing error messages and server-side logging.

**Patterns:**
- Try-catch blocks in API routes with NextResponse.json error returns (status codes: 400 for validation, 401 for auth, 500 for server errors)
- Client components show toast messages for success/error states (3-second auto-dismiss)
- Supabase query errors logged to console, generic user message displayed
- Email sending failures logged but don't block form submission (graceful skip)
- Missing environment variables logged as warnings at startup (email skipped if BREVO_API_KEY missing)
- Admin routes check session validity, redirect to login if expired or missing

## Cross-Cutting Concerns

**Logging:** Console logging for debugging
- API routes log errors and state changes (`console.error()`, `console.log()`)
- Email sending logs success/skip state
- Admin operations log auth failures
- No centralized logging service (dev environment only)

**Validation:** Form validation at two levels
- Client-side validation in component forms (email format, required fields)
- Server-side validation in API routes before database writes (duplicate check, field validation)

**Authentication:** Admin-only feature
- Cookie-based sessions with email + verification code flow
- `getCurrentAdmin()` utility checks session validity (checks expiration)
- `AuthGate` component wraps admin page (client-side gate)
- All admin API routes check `getCurrentAdmin()` before proceeding
- Service role key used for admin database operations (bypasses RLS)

**Email Notifications:** Async via Brevo SDK
- Transactional emails triggered by user actions (inquiry submission, quote acceptance)
- HTML email templates built inline in route handlers
- Graceful skip if BREVO_API_KEY missing (logs to console)
- Sent to both vendor and user in most flows (dual notifications)

**CORS & Security:**
- No explicit CORS configuration (same-origin only, no cross-domain API calls)
- Environment variables split: `NEXT_PUBLIC_*` for client-side, others server-only
- Supabase RLS policies in place (public read on vendors, restricted on admin data)
- Service role key hidden in server-only environment variables

---

*Architecture analysis: 2026-02-04*
