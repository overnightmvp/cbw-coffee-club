# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

## Project Overview

The Bean Route - Melbourne mobile coffee cart marketplace. Two-sided platform connecting event organizers with coffee cart vendors through inquiry forms and job board postings.

## Build Commands

**Development:**
```bash
npm run dev               # Start Next.js dev server with turbo
npm run build             # Production build
npm run start             # Start production server
npm run lint              # Run ESLint
npm run storybook         # Start Storybook dev server (port 6006)
npm run build-storybook   # Build Storybook to public/storybook
npm run dev:docs          # Build Storybook + start dev server
```

**Setup:**
```bash
npm install
cp .env.local.example .env.local
# Add Supabase credentials to .env.local
# Run supabase-schema.sql in Supabase SQL editor
```

**Admin Portal:**
- Access at `/admin` (no auth gate in MVP)
- Tabs: Inquiries, Applications, Jobs
- Manage vendor applications, booking inquiries, job postings

## Architecture Overview

### Core Stack
- **Next.js 14** with App Router (`src/app/`)
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Supabase** for PostgreSQL database
- **Storybook** for component documentation

### Application Routes

**Public Pages:**
- `/` - Landing page with vendor directory
- `/vendors/[slug]` - Individual vendor detail pages
- `/vendors/register` - Vendor self-registration form
- `/jobs` - Public job board for event postings
- `/jobs/create` - Event organizer job posting form
- `/jobs/[id]` - Individual job detail with quote submission
- `/contractors/*` - Content marketing pages (how-to-hire, costs)
- `/vendors-guide/*` - Vendor resources (get-listed, grow-business)
- `/design-system` - Component documentation

**Admin Portal:**
- `/admin` - Tab-based admin interface (InquiriesTab, ApplicationsTab, JobsTab)
- Recent refactor: Split 753-line admin page into focused tab components

### Core Data Types

**Vendors** (`src/lib/vendors.ts` + Supabase `vendors` table):
- 10 hardcoded seed vendors (Melbourne coffee carts)
- Fields: business_name, specialty, suburbs[], price_min/max (AUD/hr), capacity, tags[], verified
- Types defined in both `src/lib/vendors.ts` (client) and `src/lib/supabase.ts` (database)

**Inquiries** (`inquiries` table):
- Event organizers submit booking requests to specific vendors
- Fields: vendor_id, event details (type, date, duration, guest_count), contact info, status
- Status workflow: pending → contacted → converted

**Vendor Applications** (`vendor_applications` table):
- Self-registration submissions from new vendors
- Admin reviews and approves/rejects via `/admin` portal
- Status: pending → approved/rejected

**Jobs** (`jobs` table):
- Event organizers post requirements, vendors submit quotes
- Fields: event details, budget range, location, status (open/closed)
- Related `quotes` table for vendor responses

### Database Schema (Supabase)

**RLS Policies:**
- `vendors`: Public read access
- `inquiries`: Public insert, no anon read (admin uses service role)
- `vendor_applications`, `jobs`, `quotes`: World-readable/writable (MVP, tighten for production)

**Key Tables:**
```sql
vendors (id, business_name, specialty, suburbs[], price_min/max, capacity_min/max, tags[], verified)
inquiries (vendor_id, event_type, event_date, guest_count, location, contact_*, status)
vendor_applications (business_name, specialty, suburbs[], event_types[], contact_*, status)
jobs (event_title, event_type, event_date, budget_min/max, location, status)
quotes (job_id, vendor_name, price_per_hour, contact_email)
```

### Component Architecture

**UI Library** (`src/components/ui/`):
- Base components: Button, Card, Input, Badge
- Each has Storybook stories (`.stories.tsx`)
- Variant-based styling (no exported `*Variants` - removed in cleanup)

**Feature Components:**
- `src/components/booking/SimpleBookingModal.tsx` - Inquiry submission form
- `src/components/jobs/QuoteModal.tsx` - Vendor quote submission
- `src/components/navigation/Header.tsx` - Site header with variant support
- `src/components/experiences/HorizontalExperiences.tsx` - Vendor carousel
- `src/components/shared/StepIndicator.tsx` - Multi-step form progress
- `src/components/seo/JsonLd.tsx` - Structured data for SEO

**Admin Components:**
- `src/app/admin/InquiriesTab.tsx` - Manage booking requests
- `src/app/admin/ApplicationsTab.tsx` - Approve/reject vendor applications
- `src/app/admin/JobsTab.tsx` - View job postings and quotes

### Critical Files

- `src/lib/supabase.ts` - Supabase client + TypeScript types (Vendor, Inquiry, VendorApplication, Job, Quote)
- `src/lib/vendors.ts` - Hardcoded 10 vendors with helper functions (getAllVendors, getVendorBySlug, formatPriceRange)
- `src/lib/utils.ts` - Common utilities
- `src/lib/design-tokens.ts` - Design system tokens
- `supabase-schema.sql` - Complete database schema with RLS policies

## Development Patterns

### Data Handling
- Hardcoded vendors in `src/lib/vendors.ts` for initial seed data
- Real vendor records will come from `vendors` table after admin approval
- Use types from `src/lib/supabase.ts` for all database operations
- Supabase client exported as `supabase` from `src/lib/supabase.ts`

### Component Development
- Follow existing UI component patterns in `src/components/ui/`
- Create `.stories.tsx` for new components (Storybook)
- Use Tailwind utility classes directly (no CSS modules)
- Path imports: `@/*` maps to `src/*` (tsconfig.json)

### Branch Context
- Current branch: `e3-1-admin-auth-gate` (admin authentication feature)
- Recent merges: cleanup-admin-split (tab components), cleanup-storybook-build, cleanup-dead-code

## Important Notes
- Australian market focus: AUD pricing, Melbourne suburbs
- MVP has no authentication (admin portal open, tighten for production)
- Vendors are hardcoded seed data; production will use Supabase `vendors` table
- Storybook builds to `public/storybook` (excluded from production in recent cleanup)
- Recent cleanup: Removed 1,100+ lines of dead code, separated Storybook from prod build