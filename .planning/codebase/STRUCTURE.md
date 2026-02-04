# Codebase Structure

**Analysis Date:** 2026-02-04

## Directory Layout

```
7day-mvp/
├── src/                          # Application source code
│   ├── app/                      # Next.js App Router pages & layouts
│   │   ├── layout.tsx            # Root layout with metadata & JSON-LD schema
│   │   ├── page.tsx              # Landing page (hero, vendor carousel, CTAs)
│   │   ├── design-system/        # Component showcase page
│   │   ├── vendors/              # Vendor directory & detail pages
│   │   │   ├── [slug]/           # Individual vendor detail (SSR with metadata)
│   │   │   │   ├── page.tsx      # Server page wrapper
│   │   │   │   └── VendorPageClient.tsx  # Client interactivity
│   │   │   └── register/         # Vendor self-registration form
│   │   ├── vendors-guide/        # Content marketing pages (how to list, grow business)
│   │   ├── jobs/                 # Job board for event postings
│   │   │   ├── page.tsx          # List all jobs
│   │   │   ├── [id]/             # Individual job detail with quotes
│   │   │   │   ├── page.tsx      # Server page wrapper
│   │   │   │   └── JobDetailClient.tsx  # Job detail + quote management
│   │   │   └── create/           # Event organizer job creation form
│   │   ├── contractors/          # Educational content (how-to-hire, costs)
│   │   ├── admin/                # Admin dashboard (authentication required)
│   │   │   ├── page.tsx          # Main admin portal with tab interface
│   │   │   ├── AuthGate.tsx      # Client-side auth wrapper
│   │   │   ├── InquiriesTab.tsx  # Manage booking inquiries
│   │   │   ├── ApplicationsTab.tsx # Review vendor applications
│   │   │   └── JobsTab.tsx       # View jobs & quotes
│   │   ├── app/                  # App shell layout (persistent header/footer)
│   │   │   └── layout.tsx        # Wrapper for authenticated features
│   │   └── api/                  # API route handlers (server-side)
│   │       ├── notify/           # Notification emails
│   │       │   ├── inquiry/      # Email on inquiry submission
│   │       │   └── quote/        # Email on quote submission
│   │       ├── admin/            # Admin-only operations
│   │       │   ├── send-code/    # Email verification code
│   │       │   ├── verify-code/  # Verify code → create session
│   │       │   ├── session/      # Get current session
│   │       │   ├── inquiries/    # Fetch, update inquiries
│   │       │   ├── applications/ # Fetch, approve/reject applications
│   │       │   └── jobs/         # Fetch, update jobs
│   │       └── jobs/             # Public job operations
│   │           └── quotes/       # Submit, accept quotes
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # Base component library
│   │   │   ├── Button.tsx        # Button variants, sizes, states
│   │   │   ├── Button.stories.tsx # Storybook documentation
│   │   │   ├── Card.tsx          # Card container component
│   │   │   ├── Input.tsx         # Form input field
│   │   │   ├── Badge.tsx         # Tag/label component
│   │   │   └── *.stories.tsx     # Storybook files for all UI components
│   │   ├── navigation/           # Header & footer
│   │   │   ├── Header.tsx        # Site header (variants: landing, app)
│   │   │   ├── Header.stories.tsx # Header documentation
│   │   │   └── Footer.tsx        # Site footer
│   │   ├── booking/              # Inquiry/booking components
│   │   │   ├── SimpleBookingModal.tsx # Inquiry submission modal
│   │   │   └── SimpleBookingModal.stories.tsx
│   │   ├── jobs/                 # Job-related components
│   │   │   └── QuoteModal.tsx    # Vendor quote submission form
│   │   ├── experiences/          # Vendor carousel/browse
│   │   │   ├── HorizontalExperiences.tsx # Vendor carousel component
│   │   │   └── HorizontalExperiences.stories.tsx
│   │   ├── shared/               # Utility UI components
│   │   │   └── StepIndicator.tsx # Multi-step form progress indicator
│   │   ├── seo/                  # SEO-related components
│   │   │   └── JsonLd.tsx        # Structured data / schema.org
│   │   ├── admin/                # Admin-specific components
│   │   │   └── AuthGate.tsx      # Auth check + redirect wrapper
│   │   ├── ai/                   # AI-related components (unused)
│   │   └── quiz/                 # Quiz components (unused)
│   ├── lib/                      # Utility functions & shared logic
│   │   ├── supabase.ts           # Supabase client + database types
│   │   │                         # (Vendor, Inquiry, Job, Quote, VendorApplication)
│   │   ├── supabase-admin.ts     # Supabase admin client (service role)
│   │   ├── admin.ts              # Admin authentication utilities
│   │   ├── email.ts              # Brevo email sending wrapper
│   │   ├── utils.ts              # General utilities (cn for classnames)
│   │   ├── design-tokens.ts      # Design system tokens (colors, spacing)
│   │   └── vendors.ts            # Vendor helper functions
│   └── stories/                  # Global Storybook configuration
├── public/                       # Static assets
│   └── storybook/                # Storybook build output (excluded from production)
├── .storybook/                   # Storybook configuration
├── supabase-schema.sql           # Database schema with RLS policies
├── .env.local.example            # Environment variable template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration (path aliases)
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tailwind.config.ts            # Alternative Tailwind config
├── .eslintrc.json                # ESLint rules
├── postcss.config.js             # PostCSS/Autoprefixer config
└── scripts/                      # Utility scripts
    ├── test-brevo-email.ts       # Email testing script
    └── test-brevo-direct.ts      # Direct Brevo API testing
```

## Directory Purposes

**src/app/:**
- Purpose: Next.js App Router pages, layouts, and API routes
- Contains: Page components (.tsx), layout wrappers, server-side rendered pages
- Structure: Mirrors URL structure (page at `src/app/vendors/[slug]/page.tsx` → route `/vendors/{slug}`)

**src/app/api/:**
- Purpose: Backend API endpoints
- Contains: Route handlers using Next.js request/response API
- Pattern: Each endpoint is a `route.ts` file in appropriately nested directory

**src/components/:**
- Purpose: Reusable React components across the application
- Contains: UI library, feature-specific components, layout components
- Organization: Grouped by feature/concern (ui/, booking/, jobs/, navigation/)

**src/lib/:**
- Purpose: Shared utilities, configuration, and business logic
- Contains: Supabase clients, authentication, email service, helpers, types, design tokens
- Key exports: supabase client, supabaseAdmin, sendEmail function, getCurrentAdmin

**public/:**
- Purpose: Static assets served directly by Next.js
- Contains: Storybook build output (production build excludes this)

**.storybook/:**
- Purpose: Storybook configuration and setup
- Contains: main.ts config, addon settings
- Output: Built to `public/storybook` (excluded from prod)

**supabase-schema.sql:**
- Purpose: Complete database schema with RLS policies
- Contains: Table definitions, indexes, row-level security rules

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML wrapper, metadata, JSON-LD schema
- `src/app/page.tsx`: Landing page (/)
- `src/app/vendors/[slug]/page.tsx`: Vendor detail pages (/vendors/{slug})
- `src/app/jobs/[id]/page.tsx`: Job detail pages (/jobs/{id})
- `src/app/admin/page.tsx`: Admin portal (/admin)

**Configuration:**
- `tsconfig.json`: TypeScript settings, path alias `@/*` → `src/*`
- `package.json`: Dependencies (Next.js 14, Supabase, Brevo, Tailwind)
- `.env.local.example`: Required env vars (Supabase credentials, Brevo API key)
- `next.config.js`: Next.js build config

**Core Logic:**
- `src/lib/supabase.ts`: Supabase client initialization, database types (Vendor, Inquiry, Job, Quote)
- `src/lib/supabase-admin.ts`: Service role client for admin operations (bypasses RLS)
- `src/lib/admin.ts`: Admin session management (cookie-based)
- `src/lib/email.ts`: Brevo email service wrapper

**Testing & Scripts:**
- `scripts/test-brevo-email.ts`: Debug script for email functionality
- `src/app/design-system/page.tsx`: Component showcase

## Naming Conventions

**Files:**
- Pages: `page.tsx` (automatically becomes routes)
- API routes: `route.ts` (automatically becomes endpoints)
- Client components: ComponentName.tsx (with `'use client'` directive)
- Server components: ComponentName.tsx (default in App Router)
- Storybook stories: ComponentName.stories.tsx
- Test files: filename.test.ts or filename.spec.ts (none currently)
- Utilities: camelCase.ts (e.g., supabase.ts, email.ts)

**Directories:**
- Feature directories: lowercase (vendors/, jobs/, admin/)
- Dynamic routes: [paramName] (e.g., [slug], [id])
- Feature-grouped components: lowercase (ui/, booking/, jobs/)
- API logical grouping: feature path (api/admin/, api/jobs/, api/notify/)

**Components & Functions:**
- React components: PascalCase (Header, Button, SimpleBookingModal)
- Utility functions: camelCase (getCurrentAdmin, sendEmail, formatPriceRange)
- Types: PascalCase (Vendor, Inquiry, Quote, AdminSession)
- Constants: UPPER_SNAKE_CASE (none prominent in codebase)

## Where to Add New Code

**New Feature (e.g., messaging system):**
- Primary code: `src/components/messaging/` (components), `src/app/messages/` (pages), `src/app/api/messages/` (endpoints)
- Types: Add to `src/lib/supabase.ts` or create `src/lib/types/` directory
- Tests: `src/components/messaging/__tests__/` or `src/app/api/messages/__tests__/`
- Storybook: `src/components/messaging/MessageThread.stories.tsx`

**New Component/Module:**
- UI component: `src/components/ui/ComponentName.tsx` + `ComponentName.stories.tsx`
- Feature component: `src/components/{feature}/ComponentName.tsx`
- Page: `src/app/{route}/page.tsx`
- Layout: `src/app/{route}/layout.tsx`

**Utilities & Helpers:**
- Shared helpers: `src/lib/{domain}.ts` (e.g., vendors.ts, email.ts)
- Type definitions: `src/lib/supabase.ts` (centralized) or new `src/lib/types/{domain}.ts`
- Constants: `src/lib/design-tokens.ts` or new `src/lib/constants.ts`

**API Endpoints:**
- New endpoint: `src/app/api/{feature}/{action}/route.ts`
- Admin endpoint: `src/app/api/admin/{resource}/[id]/route.ts` (pattern: GET, PATCH, DELETE)
- Public endpoint: `src/app/api/{resource}/route.ts`
- Notifications: `src/app/api/notify/{event}/route.ts`

## Special Directories

**public/storybook/:**
- Purpose: Built Storybook static site
- Generated: Yes (via `npm run build-storybook`)
- Committed: No (build artifact, should be in .gitignore)
- Note: Excluded from production build to reduce bundle size

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (via npm install)
- Committed: No (.gitignore)

**.next/:**
- Purpose: Next.js build output cache
- Generated: Yes (via npm run build)
- Committed: No (.gitignore)

**scripts/:**
- Purpose: Development and testing utilities
- Contains: test-brevo-email.ts (email debugging), test-brevo-direct.ts (direct API calls)
- Run via: `npm run test:email`

---

*Structure analysis: 2026-02-04*
