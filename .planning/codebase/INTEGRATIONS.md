# External Integrations

**Analysis Date:** 2026-02-04

## APIs & External Services

**Email Delivery:**
- Brevo (formerly Sendinblue) - Transactional email service
  - SDK/Client: `@getbrevo/brevo` ^3.0.1
  - Auth: `BREVO_API_KEY` (server-side environment variable)
  - Sender email: `noreply@coffeecartsmelbourne.com`
  - Usage: Vendor inquiry notifications, quote notifications, admin auth codes
  - Implementation: `src/lib/email.ts` - `sendEmail()` function
  - API: SendSmtpEmail (transactional SMTP)

## Data Storage

**Databases:**
- Supabase (PostgreSQL 15+) - Primary database
  - Connection URL: `NEXT_PUBLIC_SUPABASE_URL` (public)
  - Client: `@supabase/supabase-js` ^2.56.1
  - Authentication:
    - Anon key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser-safe, RLS-protected)
    - Service role: `SUPABASE_SERVICE_ROLE_KEY` (server-side admin operations)

**Database Schema:**
Location: `supabase-schema.sql`

Tables:
- `vendors` - Coffee cart businesses (read-only for users, managed via admin)
  - Fields: id, slug, business_name, specialty, suburbs[], price_min/max, capacity_min/max, contact details, tags[], verified, timestamps
  - RLS: Public read access

- `inquiries` - Event booking requests from planners to vendors
  - Fields: id, vendor_id (FK), event details, contact info, status (pending/contacted/converted), timestamps
  - RLS: Public insert, no anon read (admin reads via service role)

- `vendor_applications` - Vendor self-registration submissions
  - Fields: id, business details, pricing, event_types[], contact info, status (pending/approved/rejected), timestamps
  - RLS: World-readable/writable (MVP, should tighten for production)

- `jobs` - Event organizer job postings
  - Fields: id, event_title, event_type, event_date, duration_hours, guest_count, location, budget_min/max, requirements, contact info, status (open/closed), timestamps
  - RLS: World-readable/writable (MVP)

- `quotes` - Vendor quotes against jobs
  - Fields: id, job_id (FK), vendor_name, price_per_hour, message, contact_email, status (pending/accepted/rejected), timestamps
  - RLS: World-readable/writable (MVP)

- `admin_users` - Admin portal access control
  - Fields: id, email, name, created_at
  - Used by: `src/app/api/admin/send-code/route.ts` for email whitelist

**File Storage:**
- None configured. Images referenced in vendor records stored externally (image_url field is URL string)

**Caching:**
- Next.js built-in caching via App Router
- No external caching layer (Redis, Memcached)

## Authentication & Identity

**Auth Provider:**
- Custom JWT via Supabase (anon key for public users, service role for admin)
- No user accounts for regular users (stateless booking)

**Admin Authentication:**
- Email verification code (6-digit OTP)
- Implementation: `src/app/api/admin/send-code/route.ts`, `src/app/api/admin/verify-code/route.ts`
- In-memory code storage (production should use Redis or database)
- Code expiration: 10 minutes
- Admin whitelist: `admin_users` table email column

## Monitoring & Observability

**Error Tracking:**
- Console logging only (no Sentry, Rollbar, or similar)
- Server-side errors logged to stdout
- Client-side errors not explicitly tracked

**Logs:**
- Console.log/console.error throughout codebase
- Email sending logs email status and recipient
- Admin code generation logs code to console as fallback
- No log aggregation service (stdout only)

## CI/CD & Deployment

**Hosting:**
- Not configured (can be deployed to Vercel, Netlify, or any Node.js-compatible host)
- Expected production domain: `https://thebeanroute.com.au` (from NEXT_PUBLIC_BASE_URL)

**CI Pipeline:**
- None detected (no GitHub Actions, GitLab CI, or similar in repository)

## Environment Configuration

**Required env vars (Development):**
```bash
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
BREVO_API_KEY=<brevo-transactional-email-key>
NEXT_PUBLIC_BASE_URL=https://thebeanroute.com.au
```

**Secrets location:**
- Development: `.env.local` (not committed, .gitignore rules apply)
- Production: Environment variables in hosting platform (Vercel, etc.)
- Never commit `.env.local`

**Fallback behavior:**
- If `BREVO_API_KEY` missing: Emails skip with console warning
- If Supabase keys missing: Application fails at runtime with error

## Webhooks & Callbacks

**Incoming:**
- None configured. No webhook endpoints for third-party services.

**Outgoing:**
- Email notifications via Brevo transactional API (one-way)
  - Triggered by: Form submissions (inquiries, quotes, applications)
  - Endpoints: `/api/notify/inquiry/route.ts`, `/api/notify/quote/route.ts`
  - Called from: Client-side form handlers after submission
  - No retry mechanism, no webhook event system

## External APIs (Third-party data)

**None detected** - Application is self-contained with Supabase as sole backend

---

*Integration audit: 2026-02-04*
