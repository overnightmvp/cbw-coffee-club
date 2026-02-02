# The Bean Route — Development Workflow

> One branch per user story. 15 minutes max per task. Build before push. No exceptions.

---

## Workflow Problems (Fixed in This Doc)

These were observed and confirmed during the last development cycle:

| Problem | Impact | Fix |
|---|---|---|
| All features shipped directly to main | One bad commit breaks everything. No review. | Branch per story. PR to merge. |
| Build not run before push | Vercel was the first thing to catch type errors | `npm run build` before every push. Period. |
| Storybook baked into production build | +15s per deploy. 8.3MB of tracked bundle hashes in git | Separate scripts. Stop tracking storybook output. |
| Stale story files broke builds | 2 stories referenced old "7DAY" product, wrong exports | Stories must type-check. Run build locally. |
| 753-line admin page | Impossible to reason about. Every change risks breaking other tabs | Split into tab components. |
| 6 stale branches on origin | Noise. Confusion about what's merged | Delete them. |
| 1,100 lines of dead code | Confuses new contributors. Inflates bundle. | Delete it. Listed below. |
| 10 PRD docs in design-system/docs/ | Documentation for a product that no longer exists | Delete them. |

---

## The Rule: Branch Per Story

Before touching any code:

```bash
git checkout main && git pull origin main
git checkout -b {branch-name}
# ... do the work (max 15 min) ...
npm run build          # must exit 0
git push origin {branch-name}
# open PR → merge → delete branch
```

Branch naming: `{epic}-{story}-{slug}`

Examples:
```
e3-1-admin-auth-gate
e1-2-planner-inquiry-confirm
e2-1-browse-from-supabase
cleanup-dead-code
cleanup-storybook-build
```

---

## Phase 0: Cleanup (Do This First)

These are 5–15 minute tasks each. Do them before any new features.

### 0a — Delete dead code
**Branch:** `cleanup-dead-code`

Delete these files. Verified: nothing live imports them.

| File | Lines | Why It's Dead |
|---|---|---|
| `src/components/auth/AuthModal.tsx` | 186 | Zero imports. Was for old login flow. |
| `src/components/booking/BookingSteps.tsx` | 187 | Replaced by StepIndicator. Never imported. |
| `src/components/booking/BookingSuccessState.tsx` | 188 | Inline success states in each wizard now. Never imported. |
| `src/lib/auth.ts` | 233 | Only imported by dead AuthModal.tsx. |
| `src/lib/experiences.ts` | 79 | Legacy retreat data. Only imported by dead ExperiencePreview. |
| `src/components/experiences/ExperiencePreview.tsx` | ~60 | Only imports itself + dead experiences.ts. |
| `src/stories/Header.tsx` | ~40 | Storybook scaffold default. Not a real component. |
| `src/stories/Button.tsx` | ~25 | Same. |
| `src/stories/Page.tsx` | ~60 | Same. |
| `src/stories/header.css` | ~20 | Styles for scaffold Header.tsx. |
| `src/stories/button.css` | ~20 | Styles for scaffold Button.tsx. |
| `src/stories/page.css` | ~30 | Styles for scaffold Page.tsx. |
| `docs/BMAD.md` | 84 | Documents "7DAY" corporate experience product. That product no longer exists. |

After deleting, update any story files that imported from these paths. Then `npm run build` — it must pass.

### 0b — Fix build script
**Branch:** `cleanup-storybook-build`

In `package.json`, change:
```json
"build": "npm run build-storybook && next build"
```
To:
```json
"build": "next build",
"build:storybook": "storybook build --output-dir public/storybook"
```

Add `public/storybook/` to `.gitignore`. Run `git rm -r --cached public/storybook/` to stop tracking those files. Commit. Build must pass.

### 0c — Delete stale branches
**Branch:** not needed — do directly on main

```bash
git branch -D lead-notifications seo-meta setup sitemap vendor-data vendor-photos
git push origin --delete lead-notifications seo-meta setup sitemap vendor-data vendor-photos
```

Verify none of these have unmerged work first: `git log main..{branch} --oneline` for each. If any show commits, cherry-pick what's needed before deleting.

### 0d — Split admin into tab components
**Branch:** `cleanup-admin-split`

Current: `src/app/admin/page.tsx` at 753 lines, all 3 tabs inlined.

Target structure:
```
src/app/admin/
├── page.tsx              # Tab state + shared header (~60 lines)
├── InquiriesTab.tsx      # Inquiries table + detail modal
├── ApplicationsTab.tsx   # Applications table + detail modal
└── JobsTab.tsx           # Jobs table + detail modal
```

Each tab is self-contained: own data fetch, own table, own detail modal. `page.tsx` just renders `{activeTab === 'inquiries' && <InquiriesTab />}` etc. No shared state between tabs except which tab is active.

### 0e — Delete stale PRD docs
**Branch:** `cleanup-dead-code` (same as 0a, batch it)

Delete everything in `src/app/design-system/docs/`. These are PRDs and architecture docs for the old "7DAY" product. The current product's single source of truth is `docs/backlog.md`.

---

## Phase 1: E3 — Protect Admin

Do this before E1. It's the biggest security risk and the smallest fix.

| Branch | Task | Minutes |
|---|---|---|
| `e3-1-admin-auth-gate` | Email input + code verification UI on `/admin`. No session = no data. | 15 |
| `e3-2-admin-session` | Store verified session in cookie via API route. `getCurrentAdmin()` checks it. | 10 |
| `e3-3-admin-service-role` | Move admin data fetches to API routes. Use `SUPABASE_SERVICE_ROLE_KEY` server-side only. | 15 |

---

## Phase 2: E1 — Email Notifications

Foundation for everything else. Single `sendEmail` utility, one template per event.

| Branch | Task | Minutes |
|---|---|---|
| `e1-0-email-setup` | Install `resend`. Create `src/lib/email.ts` with `sendEmail(to, subject, html)`. Add `RESEND_API_KEY` to `.env.local.example`. | 10 |
| `e1-1-vendor-inquiry-notify` | After inquiry insert, `sendEmail` to vendor with planner's details. | 10 |
| `e1-2-planner-inquiry-confirm` | Same handler, second `sendEmail` to planner confirming submission. | 5 |
| `e1-3-owner-quote-notify` | After quote insert, `sendEmail` to job owner with vendor's quote. | 10 |
| `e1-4-vendor-quote-confirm` | Same handler, second `sendEmail` to vendor confirming receipt. | 5 |
| `e1-5-applicant-decision` | In admin approve/reject handler, `sendEmail` to applicant with decision. | 10 |

---

## Phase 3: E2 — Connect Browse to Real Data

The marketplace currently shows hardcoded vendors. This makes it real.

| Branch | Task | Minutes |
|---|---|---|
| `e2-1-browse-from-supabase` | Replace `getAllVendors()` in `/app` with `useEffect` Supabase fetch. Same filter logic, same UI. | 15 |
| `e2-2-approve-creates-vendor` | In admin approve handler, after status update, insert into `vendors` table with fields mapped from the application. | 15 |
| `e2-3-vendor-detail-from-db` | `VendorPageClient` fetches by slug from Supabase instead of `vendors.ts`. | 10 |
| `e2-4-remove-vendors-ts` | Delete `src/lib/vendors.ts`. Fix all imports (HorizontalExperiences, browse page, vendor detail). Build must pass. | 10 |

---

## Phase 4: E5 — Quote Acceptance

Closes the conversion loop on the job board.

| Branch | Task | Minutes |
|---|---|---|
| `e5-1-quotes-status-column` | Add `status TEXT DEFAULT 'pending'` to `quotes` table in schema SQL. | 5 |
| `e5-2-accept-quote-ui` | Accept button per quote in `JobDetailClient`. On click: update status, close job. | 10 |
| `e5-3-acceptance-email` | After accepting, `sendEmail` to vendor with full event details. | 5 |

---

## Conventions (Every New File Must Follow These)

**Colors:** Inline `style={{}}` or Tailwind brackets. Never CSS variables.
`#F5C842` yellow · `#E8B430` hover · `#3B2A1A` dark brown · `#6B4226` mid brown · `#A0785A` accent · `#FAFAF8` off-white · `#FAF5F0` cream

**Page shell:**
```tsx
<div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
  <Header variant="app" />
  <div className="max-w-{3xl|4xl|7xl} mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* content */}
  </div>
  <Footer />
</div>
```

**Form inputs in wizards:** Raw `<input>` with brown focus rings. Do NOT use the `<Input>` UI component (blue rings).
```tsx
className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] outline-none"
// error state adds: border-red-300
```

**Supabase writes:** Dynamic import inside async handler only.
```tsx
const { supabase } = await import('@/lib/supabase')
```

**ID generation:** `prefix_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

**Modal overlay:** `fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]`

---

## What NOT to Do

- Don't push to main directly. One branch per story.
- Don't let Vercel be the first to catch build errors. Run `npm run build` locally.
- Don't add more docs in `design-system/docs/`. The backlog is the source of truth.
- Don't add tests before product-market fit. Ship, learn, then test.
- Don't abstract shared code until you have 3+ identical instances.
- Don't use the `<Input>` UI component in wizards.
- Don't add payment processing, mobile apps, AI matching, or reviews. See `docs/backlog.md` "What NOT to Build Next" section.
