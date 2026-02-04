# Technology Stack

**Analysis Date:** 2026-02-04

## Languages

**Primary:**
- TypeScript 5 - Entire application (strict mode enabled)
- JavaScript - Next.js config, PostCSS, Tailwind

**Secondary:**
- HTML/CSS - Via React/JSX and Tailwind utilities
- SQL - Supabase schema definition (`supabase-schema.sql`)

## Runtime

**Environment:**
- Node.js (version not pinned in package.json, uses system Node)

**Package Manager:**
- npm (v10+ based on package-lock.json structure)
- Lockfile: `package-lock.json` (present, 507KB)

## Frameworks

**Core:**
- Next.js 14.2.5 - Full-stack framework with App Router
  - Server-side rendering for public pages
  - API routes for backend endpoints
  - Static generation for SEO-critical pages
  - Image optimization via Next.js Image component

**Styling:**
- Tailwind CSS 3.3.0 - Utility-first CSS framework
  - Custom color theme: primary (#F5C842), brown palette, neutral palette
  - Configured in `tailwind.config.js`
  - PostCSS 8.0+ with Autoprefixer 10.0+

**Testing:**
- No test framework detected (no Jest, Vitest, or test scripts)

**Component Documentation:**
- Storybook 9.1.3 - Component library documentation
  - Config: `.storybook/`
  - Build output: `public/storybook/` (static)
  - Next.js addon: `@storybook/nextjs` 9.1.3
  - Runs on port 6006

**Build/Dev:**
- Turbo (via `npm run dev --turbo`) - Task orchestration
- TypeScript 5 - Type checking
- ESLint 8 - Linting (next/core-web-vitals preset)

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` ^2.56.1 - PostgreSQL database client
  - Row-level security (RLS) enabled on tables
  - Type-safe queries
  - Real-time subscriptions supported (not actively used)

- `@getbrevo/brevo` ^3.0.1 - Email service provider
  - Transactional email API
  - SMTP relay for sending notifications
  - Initialized in `src/lib/email.ts`

**Infrastructure:**
- `dotenv` ^17.2.1 - Environment variable management
  - Loads `.env.local` for local development
  - Next.js automatically handles .env.local for NEXT_PUBLIC_ prefixed vars

**UI/UX:**
- `react` ^18.2.0 - UI rendering
- `react-dom` ^18.2.0 - DOM rendering

## Configuration

**Environment:**
- `.env.local.example` - Template with required vars (checked in)
- `.env.local` - Local development secrets (not committed)
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, RLS-protected)
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-side only)
  - `BREVO_API_KEY` - Brevo email API key (server-side only)
  - `NEXT_PUBLIC_BASE_URL` - Base URL for canonical links and sitemap (default: `https://thebeanroute.com.au`)

**Build:**
- `tsconfig.json` - TypeScript configuration
  - Target: ES5 (for browser compatibility)
  - Strict mode enabled
  - Path aliases: `@/*` → `./src/*`
  - ESModule module format
  - Incremental builds enabled

- `next.config.js` - Minimal Next.js config (empty, uses defaults)

- `.eslintrc.json` - ESLint configuration
  - Extends: `next/core-web-vitals`, `plugin:storybook/recommended`
  - Disabled: `@next/next/no-img-element` (warn), `react/no-unescaped-entities` (off)

## Platform Requirements

**Development:**
- Node.js (no specific version pinned)
- npm (package manager)
- Git (version control)

**Production:**
- Supabase project (PostgreSQL 15+ with pgvector extension available)
- Brevo account (transactional email)
- Vercel deployment (recommended for Next.js, not required)
- HTTPS/TLS for secure Supabase queries

---

*Stack analysis: 2026-02-04*
