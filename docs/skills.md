# The Bean Route — Development Skills & Workflow

**Last Updated:** 2026-02-04
**Status:** Production system with ongoing feature development

---

## Current Architecture

**Stack:**
- Next.js 14.2.5 (App Router, TypeScript, Tailwind CSS)
- Supabase (PostgreSQL + Auth + RLS policies)
- Brevo (transactional emails)
- Vercel (hosting + deployments)

**Database Tables:**
- `vendors` - Coffee cart vendor listings
- `inquiries` - Event organizer booking requests
- `vendor_applications` - New vendor registration submissions
- `jobs` - Job board postings from event organizers
- `quotes` - Vendor quote submissions for jobs

---

## Completed Features (Production-Ready)

### Phase 1: E3 — Admin Authentication ✅
- Email-based verification with 6-digit codes
- HTTP-only cookie sessions (24hr expiration)
- Email whitelist protection (hardcoded in `send-code/route.ts`)
- Admin portal at `/admin` with 3 tabs (Inquiries, Applications, Jobs)

### Phase 2: E1 — Email Notifications ✅
All transactional emails via Brevo:
1. Vendor inquiry notification (vendor receives inquiry details)
2. Planner inquiry confirmation (event owner gets confirmation)
3. Owner quote notification (job owner notified of new quote)
4. Vendor quote confirmation (vendor confirms quote submitted)
5. Applicant decision emails (approval/rejection notifications)
6. Admin verification codes (email-based admin login)

### Phase 3: E2 — Real Vendor Data ✅
- Browse page (`/`) fetches vendors from Supabase
- Vendor detail pages (`/vendors/[slug]`) load from database
- Admin approval creates vendor record in database
- Hardcoded `vendors.ts` file removed

### Phase 4: E5 — Quote Acceptance ✅
- Job detail page shows "Accept" button for pending quotes
- Accepting quote closes job, rejects other quotes
- Vendor receives acceptance email with job owner contact

---

## Development Workflow

### Branch Strategy

**Rule: One branch per story**

```bash
# Start new story
git checkout main && git pull origin main
git checkout -b {epic}-{story}-{slug}

# Examples:
# e6-1-rate-limiting
# e7-2-vendor-dashboard
# docs-update-readme

# Do the work (target: < 1 hour per story)

# MUST pass build before pushing
npm run build

# If build fails, fix it before pushing
# If tests fail, fix them before pushing

# Push and create PR
git push origin {branch-name}

# Merge to main via PR
# Delete branch after merge
```

### Commit Message Format

```
{type}({scope}): {short description}

Longer explanation if needed (optional).
- Key change 1
- Key change 2

Closes #{issue-number}

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `refactor`: Code refactoring (no behavior change)
- `test`: Add/update tests
- `chore`: Tooling, config, dependencies

**Examples:**
```
feat(jobs): Add quote acceptance UI
fix(admin): Prevent unauthenticated access
docs(readme): Update deployment instructions
refactor(api): Extract email template logic
```

---

## Code Quality Standards

### Before Every Commit

```bash
# 1. Type check
npm run build

# 2. Lint
npm run lint

# 3. Manual smoke test (if UI change)
npm run dev
# Test the changed feature manually
```

### Code Style

- **Max file length:** 500 lines (split into smaller files if exceeded)
- **Component size:** Keep React components < 300 lines
- **Function complexity:** Max 50 lines per function
- **Naming:** Descriptive names (no abbreviations unless obvious)
- **Comments:** Only for non-obvious logic (code should be self-documenting)

### TypeScript Standards

```typescript
// ✅ Do: Use strict types
interface VendorFormData {
  businessName: string
  specialty: string
  priceMin: number
  priceMax: number
}

// ❌ Don't: Use any
function handleSubmit(data: any) { ... }

// ✅ Do: Use Zod for runtime validation (coming in E6)
const vendorSchema = z.object({
  businessName: z.string().min(3).max(100),
  specialty: z.string().min(10),
  priceMin: z.number().positive(),
  priceMax: z.number().positive()
})

// ✅ Do: Use discriminated unions for status
type QuoteStatus = 'pending' | 'accepted' | 'rejected'

// ❌ Don't: Use magic strings
if (quote.status === 'accepted') { ... }  // OK
if (quote.status === 'approve') { ... }   // Typo, won't be caught
```

---

## Testing Strategy

### Current State (Manual Testing)

No automated tests yet. All testing is manual:

1. **Smoke tests** - Critical paths in `docs/backlog.md`
2. **Form validation** - Submit empty forms, check errors appear
3. **Email delivery** - Check Brevo dashboard or console logs
4. **Admin access** - Verify auth works, whitelist enforced

### Future (Post-E6)

- Integration tests for API routes (Vitest + Supertest)
- E2E tests for critical flows (Playwright)
- Unit tests for complex logic (Vitest)

**Don't write tests yet** — wait until product-market fit is validated.

---

## Database Operations

### Adding New Tables

1. Update `supabase-schema.sql` with new table DDL
2. Add TypeScript type to `src/lib/supabase.ts`
3. Run SQL in Supabase SQL editor (no migrations yet)
4. Update README with new table documentation

### Modifying Existing Tables

```sql
-- Example: Add new column
ALTER TABLE vendors ADD COLUMN photo_url TEXT;

-- Update TypeScript type
export interface Vendor {
  // ... existing fields
  photo_url?: string | null  // Optional, might be null
}
```

### RLS Policies

Current policies are permissive (world-readable/writable for MVP).

**Future (E6):** Tighten RLS policies:
- Vendors: only vendor owner can update
- Inquiries: only admin can read
- Jobs: only job owner can update

---

## API Route Patterns

### Standard API Route Structure

```typescript
// src/app/api/{resource}/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering (never static)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()

    // 2. Validate input (add Zod in E6)
    if (!body.required_field) {
      return NextResponse.json(
        { error: 'Missing required_field' },
        { status: 400 }
      )
    }

    // 3. Database operation
    const { data, error } = await supabaseAdmin
      .from('table_name')
      .insert({ ...body })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Operation failed' },
        { status: 500 }
      )
    }

    // 4. Side effects (emails, logging, etc.)
    await sendEmail(...)

    // 5. Return success
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Admin Routes (Protected)

```typescript
import { getCurrentAdmin } from '@/lib/admin'

export async function POST(request: NextRequest) {
  // 1. Verify admin session
  const admin = await getCurrentAdmin(request)
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 2. Log admin action (E6 will add audit log)
  console.log(`[ADMIN ACTION] ${admin.email} performed action`)

  // ... rest of route logic
}
```

---

## Email Template Guidelines

### Email Design Principles

1. **Mobile-first** - 90% of emails opened on mobile
2. **Inline styles** - Email clients strip `<style>` tags
3. **Brand colors** - Use `#F5C842` (yellow), `#3B2A1A` (brown)
4. **Clear CTAs** - One primary action per email
5. **Plain text fallback** - Always include (Brevo handles this)

### Email Template Structure

```typescript
const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #FAFAF8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px; background: linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%);">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Email Title</h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px; background-color: #ffffff;">
            <p style="margin: 0 0 16px; color: #1A1A1A; font-size: 16px;">
              Email content here...
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 40px; background-color: #FAFAF8; border-top: 1px solid #E5E5E5;">
            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
              The Bean Route — Coffee Cart Marketplace<br>
              Melbourne, Australia
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

await sendEmail(recipient, subject, html)
```

---

## Environment Variables

### Required for Development

```bash
# .env.local (never commit)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-only
BREVO_API_KEY=xkeysib-...              # Server-only
```

### Required for Vercel

Same variables as above, set in:
- Vercel Dashboard → Settings → Environment Variables
- Check **ALL** environments (Production + Preview + Development)

**Security Rules:**
- ✅ `NEXT_PUBLIC_*` = embedded in client bundle (safe for public)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` = bypasses RLS (server-only, never NEXT_PUBLIC_)
- ❌ `BREVO_API_KEY` = sends emails (server-only, never NEXT_PUBLIC_)

---

## Common Tasks

### Add a New Email Notification

1. Create email template in API route
2. Call `sendEmail()` from `@/lib/email`
3. Test locally (check console logs if no BREVO_API_KEY)
4. Verify in Brevo dashboard after deploy

### Add a New Admin Tab

1. Create `{TabName}Tab.tsx` in `src/app/admin/`
2. Import in `src/app/admin/page.tsx`
3. Add tab to navigation array
4. Add tab content to conditional render
5. Test with authenticated admin session

### Add a New Database Table

1. Add SQL to `supabase-schema.sql`
2. Run SQL in Supabase SQL editor
3. Add TypeScript type to `src/lib/supabase.ts`
4. Create API route for CRUD operations
5. Update `docs/backlog.md` and `README.md`

### Debug Production Issues

1. Check Vercel logs (Runtime tab)
2. Verify env vars are set (Settings → Environment Variables)
3. Check Brevo dashboard for email delivery status
4. Check Supabase logs for query errors
5. Test locally with production env vars

---

## Deployment Checklist

### Before Pushing to Main

- [ ] `npm run build` passes
- [ ] `npm run lint` passes (or only warnings, no errors)
- [ ] Manual smoke test of changed feature
- [ ] Git commit message follows format
- [ ] No secrets committed (check `.env.local` in `.gitignore`)

### After Merging to Main

- [ ] Vercel build succeeds (check dashboard)
- [ ] Smoke test on production URL
- [ ] Check Sentry for new errors (once E6 complete)
- [ ] Update documentation if API changed

---

## Next Features to Build (Priority Order)

1. **E6-1: Rate Limiting** - Prevent API abuse
2. **E6-2: Error Logging** - Sentry integration
3. **E6-3: Admin Audit Log** - Track admin actions
4. **E6-4: Email Delivery Tracking** - Log sent emails
5. **E6-5: Data Validation** - Zod schemas for all inputs

See `docs/backlog.md` for full epic breakdown.

---

## Getting Help

1. **"How do I...?"** → Check this file first
2. **"Build failing?"** → Read error message, check type errors
3. **"Deployment broken?"** → `docs/VERCEL-TROUBLESHOOTING.md`
4. **"Email not sending?"** → Check Brevo dashboard, verify API key
5. **"What's next?"** → `docs/backlog.md` for roadmap

---

## Common Pitfalls to Avoid

❌ **Don't** push directly to main (use branches)
❌ **Don't** skip the build before pushing
❌ **Don't** hardcode secrets in code
❌ **Don't** use `any` type in TypeScript
❌ **Don't** create files over 500 lines
❌ **Don't** add features without user validation first

✅ **Do** one story per branch
✅ **Do** run `npm run build` before every push
✅ **Do** use environment variables for secrets
✅ **Do** use strict TypeScript types
✅ **Do** split large files into smaller modules
✅ **Do** validate features with real users before building more

---

## Resources

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Brevo Dashboard:** https://app.brevo.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Design System:** http://localhost:3000/design-system
- **Admin Portal:** http://localhost:3000/admin
