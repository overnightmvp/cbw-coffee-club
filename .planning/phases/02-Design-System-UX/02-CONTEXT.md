# Phase 2: Design System & UX Optimization - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement a consistent design system using shadcn/ui across the entire platform (vendor directory, event organizer flows, admin portal, blog) without restructuring existing code. Optimize critical user flows by fixing mobile experience, form friction, and onboarding blind spots.

This phase is about *visual consistency* and *user experience improvement*, not architectural changes.

</domain>

<decisions>
## Implementation Decisions

### shadcn/ui Implementation Strategy
- **Scope:** Comprehensive migration — replace all existing UI components with shadcn/ui equivalents (buttons, inputs, modals, cards, etc.)
- **Customization:** Use CSS variables + Tailwind theme approach for The Bean Route brand customization
- **Installation:** Use CLI tool (`npx shadcn-ui add`) for adding components — fastest, keeps updates clean
- **Theming:** Light mode only for now. Dark mode support deferred to future phase.

### Flow Optimization Priority
- **Primary flow:** Vendor registration (main pain point: broken mobile experience)
- **Secondary flow:** Event organizer inquiry (main pain point: broken mobile experience)
- **Focus areas:** Visual clarity, mobile optimization, form friction reduction
- **Deliverable:** Create comprehensive user flow diagrams showing current state and optimized design for both flows

### Onboarding Blind Spots

**Vendor onboarding issues:**
- Landing page clarity: Vendor page doesn't adequately communicate:
  - What is The Bean Route (mission/value proposition)
  - How to get started (clear CTA to registration)
  - Benefits/ROI for vendors (why register)
  - Social proof (existing vendors, testimonials, metrics)
- Post-registration gaps (all three present):
  - No immediate success confirmation or feedback
  - Unclear approval process and timeline
  - No guidance on next steps or profile completion

**Event organizer onboarding issues:**
- Mobile experience is broken across the entire flow (vendor discovery, inquiry submission, quote review)

### Component Testing & Accessibility

- **Test strategy:** Prioritize E2E tests (Playwright) — test critical flows end-to-end
- **Component organization:** Keep flat structure in `src/components/ui` for simplicity
- **Test file location:** Claude's discretion — determine during implementation based on project conventions
- **E2E test focus:**
  - Critical user flows (vendor registration, event organizer inquiry, admin access)
  - Form validation (inputs, error messages, submission)
  - Mobile responsiveness (layout, touch targets, navigation)

### Claude's Discretion
- Test file organization (collocated vs centralized — choose based on project setup)
- Exact component implementation details for shadcn/ui integration
- Specific CSS token values and spacing system (follow design best practices)

</decisions>

<specifics>
## Specific Ideas & References

- **Mobile-first approach:** Both vendor registration and event organizer flows suffer from poor mobile experience. These should be designed mobile-first, then enhanced for desktop.
- **Flow diagrams:** Create visual before/after diagrams showing how each flow will be improved. These become reference docs for implementation.
- **Quick wins on landing page:** Add social proof section (vendor count, testimonials), clarify value props with icons/visual hierarchy, add visible CTA buttons above fold.

</specifics>

<deferred>
## Deferred Ideas

- **Dark mode support** — Phase 5 (Execution & Launch Prep)
- **Advanced theming (high contrast, multiple color themes)** — Future phase
- **A/B testing infrastructure** — Could be added to Phase 5
- **Accessibility audit** — Not comprehensive in this phase; E2E tests will catch major issues, but formal WCAG audit deferred
- **Admin portal redesign** — Lower priority; focus on vendor/organizer flows in Phase 2. Admin optimization Phase 4+

</deferred>

---

*Phase: 02-Design-System-UX*
*Context gathered: 2026-02-24*
