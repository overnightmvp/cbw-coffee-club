# The Bean Route - Melbourne Coffee Cart Marketplace
//omvp supabase tbr brevo cedentials
> **Two-sided marketplace** connecting event organizers with mobile coffee cart vendors in Melbourne.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier)
- Brevo account for email notifications (free tier)
- Vercel account for deployment

### Local Development Setup

1. **Clone and install**:
```bash
git clone <your-repo-url>
cd coffee-cart-marketplace
npm install
```

2. **Configure Environment**:
```bash
cp .env.local.example .env.local
```

Add your credentials to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # ⚠️ Never commit!
BREVO_API_KEY=xkeysib-your_key                    # ⚠️ Never commit!
```

3. **Set up Supabase Database**:
   - Go to Supabase SQL Editor
   - Run the complete `supabase-schema.sql` file
   - Verify tables created: `vendors`, `inquiries`, `vendor_applications`, `jobs`, `quotes`

4. **Populate Seed Data** (Required for forms to work):
```sql
-- Run this in Supabase SQL Editor to add the 10 seed vendors
-- See supabase-schema.sql for the INSERT statements
```

5. **Start Development**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Production Deployment (Vercel)

### 1. Deploy to Vercel
- Connect your GitHub repository to Vercel
- Automatic deployment on every push to main

### 2. Configure Environment Variables in Vercel

**Critical:** Add these to Vercel → Settings → Environment Variables for **ALL** environments (Production + Preview + Development):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
BREVO_API_KEY=xkeysib-your_key_here
```

**Important:**
- `NEXT_PUBLIC_*` variables are embedded in the browser bundle
- Never use `NEXT_PUBLIC_` prefix for secrets (service role, Brevo key)
- Must check ALL THREE environment checkboxes (Production, Preview, Development)

### 3. Verify Deployment
- Build should complete without errors
- Test "Get a Quote" form on live URL
- Verify data saves to Supabase
- Check admin access works

**Troubleshooting:** See `docs/VERCEL-TROUBLESHOOTING.md` if forms fail with "supabaseUrl is required"

## 🎯 Current Features

### For Event Organizers
- **Browse Vendors**: 10 curated Melbourne coffee cart vendors
- **Direct Inquiries**: Request quotes from specific vendors
- **Job Board**: Post events and receive competing quotes from multiple vendors
- **AUD Pricing**: Transparent Australian dollar pricing

### For Coffee Cart Vendors
- **Self-Registration**: Apply to join the marketplace
- **Quote Submission**: Respond to job postings
- **Email Notifications**: Receive inquiry alerts via Brevo

### For Independent Baristas
- **Professional Listing**: Showcase skills, experience, and hourly rates
- **Event Booking**: Get hired for events, private parties, or cafe staff cover
- **Simple Registration**: Apply as an individual professional

### Admin Portal
- **Authentication**: Email + 6-digit code verification
- **Inquiry Management**: View and manage booking requests
- **Application Review**: Approve/reject vendor applications
- **Job Oversight**: Monitor job postings and quotes

**Access Admin:**
- Go to `/admin`
- Enter email → check Vercel logs for code
- See `docs/ADMIN-ACCESS.md` for details

## 📊 Database Schema

### Main Tables
```sql
vendors (
  id, business_name, specialty, suburbs[],
  price_min/max, capacity_min/max, tags[], verified
)

inquiries (
  id, vendor_id, event_type, event_date,
  duration_hours, guest_count, location,
  contact_*, estimated_cost, status
)

vendor_applications (
  id, business_name, specialty, description,
  suburbs[], price_min/max, event_types[],
  contact_*, status
)

jobs (
  id, event_title, event_type, event_date,
  guest_count, budget_min/max, location, status
)

quotes (
  id, job_id, vendor_name, price_per_hour,
  message, contact_email
)
```

## 🧪 Testing the System

### 1. Test Inquiry Flow
1. Visit homepage
2. Click "Get a Quote" on any vendor
3. Fill and submit inquiry form
4. Verify success confirmation
5. Check Supabase → `inquiries` table for new row
6. Check email inbox for confirmation (if Brevo configured)

### 2. Test Job Board
1. Go to `/jobs`
2. Click a job → "Submit a Quote"
3. Fill vendor quote form
4. Submit
5. Verify quote appears in job details

### 3. Test Admin Portal
1. Go to `/admin`
2. Enter email → get code from server logs
3. View inquiries, applications, jobs
4. Test status updates

**See `docs/SETUP-GUIDE.md` for comprehensive testing instructions.**

## 🔧 Development Commands

```bash
npm run dev          # Start development server (with turbo)
npm run build        # Production build
npm run start        # Start production server locally
npm run lint         # ESLint checking
npm run storybook    # Component documentation (port 6006)
npm run dev:docs     # Build Storybook + start dev server
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── admin/                    # Admin portal
│   │   ├── page.tsx             # Main admin UI with tabs
│   │   ├── InquiriesTab.tsx    # Booking inquiries
│   │   ├── ApplicationsTab.tsx  # Vendor applications
│   │   └── JobsTab.tsx          # Job board management
│   ├── vendors/
│   │   ├── [slug]/page.tsx     # Vendor detail pages
│   │   └── register/page.tsx   # Vendor application form
│   ├── jobs/
│   │   ├── page.tsx            # Job board listing
│   │   ├── create/page.tsx     # Post a job
│   │   └── [id]/page.tsx       # Job detail + quotes
│   ├── contractors/             # Content marketing pages
│   ├── vendors-guide/           # Vendor resources
│   └── api/
│       ├── admin/              # Admin API routes (service role)
│       │   ├── session/
│       │   ├── send-code/
│       │   ├── verify-code/
│       │   ├── inquiries/
│       │   ├── applications/
│       │   └── jobs/
│       └── notify/             # Email notification routes
│           └── inquiry/
├── components/
│   ├── ui/                     # Core UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   ├── booking/                # Inquiry forms
│   ├── jobs/                   # Quote submission
│   ├── admin/                  # Admin components (AuthGate)
│   ├── experiences/            # Vendor carousel
│   ├── navigation/             # Header/Footer
│   └── seo/                    # JsonLd structured data
└── lib/
    ├── supabase.ts            # Database client + types
    ├── supabase-admin.ts      # Service role client (server-only)
    ├── email.ts               # Brevo email utility
    ├── admin.ts               # Admin session management
    ├── vendors.ts             # Hardcoded vendor data (seed)
    ├── utils.ts               # Helper functions
    └── design-tokens.ts       # Design system
```

## 🇦🇺 Australian Market Focus

### Target Users
- **Event Organizers**: Corporate events, weddings, festivals in Melbourne
- **Coffee Cart Vendors**: Mobile coffee businesses serving Melbourne suburbs
- **Geographic Focus**: Melbourne metropolitan area
- **Pricing**: Australian dollars (AUD)

### Key Differentiators
- **Local Focus**: Melbourne suburbs, local vendors, AUD pricing
- **Two Matching Flows**:
  - Direct inquiry (know which vendor you want)
  - Job board (get competing quotes)
- **No Middleman**: Direct connection between organizers and vendors

## 📖 Documentation

- **`docs/SETUP-GUIDE.md`** - Complete infrastructure setup (20 min)
- **`docs/ADMIN-ACCESS.md`** - Admin portal access on production
- **`docs/VERCEL-TROUBLESHOOTING.md`** - Fix deployment errors
- **`docs/backlog.md`** - Product roadmap and priorities
- **`docs/skills.md`** - Development task breakdown
- **`CLAUDE.md`** - AI assistant guidance for this codebase

## 🔮 Roadmap

### ✅ Phase 1: MVP (Complete)
- ✅ Vendor directory with database-driven listings
- ✅ Inquiry submission with email notifications
- ✅ Job board with quote submission and acceptance
- ✅ Vendor registration and admin approval workflow
- ✅ Admin portal with authentication (email + 6-digit codes)
- ✅ Transactional email notifications (Brevo)

### ✅ Phase 2: Coffee Shop Expansion (Complete - Feb 2026)
- ✅ Dual marketplace: Mobile carts + Coffee shops
- ✅ Vendor type discrimination in database and UI
- ✅ Conditional profile templates (CoffeeShopProfile, MobileCartProfile)
- ✅ Coffee shops landing page with advanced filters
- ✅ Suburb dynamic pages for local SEO (e.g., /suburbs/carlton)
- ✅ Opening hours display with "Open Now" indicator
- ✅ Amenities display (WiFi, parking, outdoor seating, accessibility)
- ✅ Structured data for SEO (breadcrumbs, FAQ, CollectionPage schemas)

See `docs/backlog.md` for full feature list and completion details.

### ✅ Phase 4: Barista Directory Expansion (Complete - Feb 2026)
- ✅ Support for "Independent Barista" vendor type
- ✅ Specialized barista profile UI with hourly rates and skill display
- ✅ Enhanced registration flow for individuals
- ✅ Category-based filtering in the marketplace
- ✅ Barista-specific SEO metadata and JSON-LD schemas

### ⏳ Phase 5: Production Hardening (Current)
**Epic E6** - Make the system bulletproof for real users:
- Rate limiting on forms and API routes
- Error logging and monitoring (Sentry integration)
- Admin audit trail for all actions
- Email delivery tracking and retry logic
- Enhanced server-side validation (Zod schemas)

See `docs/AGILE_BACKLOG.md` for detailed stories and acceptance criteria.

### 📋 Phase 6: Vendor Features (Planned)
**Epic E7** - Let vendors manage their own listings:
- Vendor authentication and login
- Vendor dashboard (view inquiries, update profile, manage availability)
- Calendar integration for unavailable dates

See `docs/AGILE_BACKLOG.md` for future enhancements.

## 🐛 Known Issues & Solutions

### Issue: "supabaseUrl is required" on production
**Cause:** Environment variables not configured in Vercel
**Solution:** See `docs/VERCEL-TROUBLESHOOTING.md`

### Issue: Forms work locally but not on production
**Cause:** Missing vendor data in production database
**Solution:** Run seed SQL to populate `vendors` table

### Issue: Admin shows no data
**Cause:** Missing `SUPABASE_SERVICE_ROLE_KEY`
**Solution:** Add service role key to `.env.local` and Vercel

### Issue: Emails not sending
**Cause:** `BREVO_API_KEY` not configured
**Solution:** Get API key from Brevo dashboard, add to environment

## 🔒 Security Notes

### Environment Variables
- ✅ Never commit `.env.local` (already in `.gitignore`)
- ✅ Use `NEXT_PUBLIC_` only for client-safe values
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- ❌ Never expose `BREVO_API_KEY` to client

### Admin Security (MVP)
- ⚠️ Any email can request admin access (no whitelist yet)
- ⚠️ Codes logged to console (not emailed yet)
- ⚠️ Sessions stored in HTTP-only cookies (24hr expiration)

**For Production:**
- Add email whitelist in `send-code/route.ts`
- Enable Brevo emails (remove console logging)
- Add rate limiting to prevent code spam
- Implement audit logging for admin actions

## 📞 Support

For questions or issues:
1. Check `docs/` folder for guides
2. Review `CLAUDE.md` for development patterns
3. Check GitHub issues
4. Contact: [your contact method]

---

**The Bean Route - Melbourne Coffee Cart Marketplace**
Built with Next.js 14, TypeScript, Supabase, and Brevo
Deployed on Vercel
