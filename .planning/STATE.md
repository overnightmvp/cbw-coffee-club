# The Bean Route: Project State

## Project Reference

**Building:** The Bean Route — 90-day coffee culture and marketplace authority hub with blog, internal linking strategy, SEO optimization, and free coffee growth loop.

**Core Value:** Drive organic discovery and vendor acquisition through high-intent content.

## Current Position

**Phase:** 02-Design-System-UX
**Current Plan:** 02 of 5 (shadcn/ui foundation complete)
**Status:** Executing Phase 2 plans

**Progress:** [██████░░░░] 56%

## Recent Decisions

### Phase 2: Design System & UX Optimization (ACTIVE - Days 31-40)
- **shadcn/ui strategy:** Tailwind config approach (not CSS variables) for light-mode-only Phase 2 - simpler, defer dark mode to Phase 5
- **Input height h-12 (48px):** WCAG 2.1 Level AA compliance (44px minimum + 4px margin) for all touch targets
- **Flow diagrams:** Markdown + Mermaid (version-controlled) vs Figma - no external dependencies, git-trackable
- **Flow priorities:** Vendor registration (mobile broken) → Event organizer inquiry (mobile broken)
- **Focus areas:** Visual clarity, mobile optimization, form friction reduction, flow diagrams
- **Onboarding fixes:** Landing page clarity (mission/value/CTA/proof), post-reg gaps (feedback/approval/next steps)
- **Testing:** E2E (Playwright) focus on critical flows, form validation, mobile responsiveness

### Phase 1: Content Strategy (Confirmed)
- Payload CMS selected for blog backend (allows non-dev publishing)
- 90-post strategy: 30 venue spotlights, 20 location guides, 15 how-to guides, 25 coffee education
- Geographic phases: Days 1-30 (Chadstone), 31-40 (design system), 41-70 (Knox expansion), 71-90 (broader coverage)
- 1 post per day target for consistent SEO signal
- AI-assisted production with human refinement
- Free coffee incentive model for vendor acquisition
- **Phase 01:** RichTextRenderer already exists - no implementation needed (pre-existing work)
- **Phase 01:** 8/10 venues need verification - documented research gaps and next steps
- **Phase 01 Plan 02:** Markdown-first workflow for content (draft → review → publish) improves quality control
- **Phase 01 Plan 02:** 10 venue spotlight posts drafted (2 verified, 8 pending), ready for Payload CMS entry
- **Phase 01 Plan 03:** 7 location guide posts drafted (15,074 words) covering Chadstone + 5 adjacent suburbs
- **Phase 01 Plan 03:** Geographic clustering strategy (hub-spoke model) establishes parent-child SEO topology
- **Phase 01 Plan 03:** Roundup content format (3-10 vendors per guide) maximizes internal linking density (~43 links)

## Blockers & Concerns

**Current Blockers:**
- None

**Identified Risks:**
- **Venue Verification Gap:** Only 2/10 venues verified for spotlight posts (need 5+ minimum)
- **Venue Permissions:** Need to contact venues for permission before publishing spotlights
- **Geographic Scope:** Chadstone area may have limited mobile cart coverage, may need to expand suburbs

**Mitigations:**
- Complete Google Maps + Instagram research before Plan 01-02
- Create vendor outreach email template
- Expand to Box Hill, Monash, Wheelers Hill if needed

## Pending Todos

None currently tracked. Todos should be created when roadmap is broken into phases.

## Performance Metrics

| Phase-Plan | Duration (min) | Tasks | Files | Commits | Status |
|------------|----------------|-------|-------|---------|--------|
| 01-01 | 4 | 3 | 2 | 1 | ✅ Complete |
| 01-02 | 6 | 2 | 11 | 1 | ✅ Complete |
| 01-03 | 292 | 2 | 8 | 2 | ✅ Complete |
| Phase 01 P03 | 9 | 2 tasks | 5 files |
| Phase 01-Chadstone-Deep-Dive P04 | 273 | 2 tasks | 13 files |
| Phase 02 P01 | 8 | 2 tasks | 12 files |

## Session Continuity

**Last session:** 2026-02-24T16:13:56.052Z
**Stopped at:** Completed 02-01-PLAN.md (shadcn/ui foundation + flow diagrams)
**Resume file:** None

---

*Last updated: 2026-02-24 after Phase 2 context capture (discuss-phase complete)*
